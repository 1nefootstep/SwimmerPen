import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Box, Row, Center, Column, Text } from 'native-base';
import { LayoutChangeEvent, PixelRatio, StyleSheet } from 'react-native';
import RecordButton from '../components/camera/RecordButton';
import SelectMode from '../components/SelectMode';
import BackButton from '../components/BackButton';
import MuteButton from '../components/camera/MuteButton';
import CheckpointButton from '../components/camera/CheckpointButton';
import LoadingScreen from './LoadingScreen';
import ErrorScreen from './ErrorScreen';
import { createDirs } from '../FileHandler';
import { clearAnnotation } from '../state/redux';
import { useAppDispatch, useAppSelector } from '../state/redux/hooks';
import {
  Camera,
  CameraDeviceFormat,
  useCameraDevices,
  useFrameProcessor,
} from 'react-native-vision-camera';
import { useIsForeground } from '../hooks/useIsForeground';
import SelectFormat from '../components/camera/SelectFormat';
import { getMaxFps } from '../state/Util';
import { NavigatorProps } from '../router';
import { detectSwimmers, BoundingFrame } from '../detectSwimmer';
import { runOnJS, useSharedValue } from 'react-native-reanimated';
import { DistanceOrDone } from '../state/AnnotationMode';

/**
 * Returns true if a is closer to idealRatio compared to b.
 */
function ratioIsCloser(
  a: { width: number; height: number },
  b: { width: number; height: number },
  idealRatio: number
) {
  const ratioA = a.width / a.height;
  const ratioB = b.width / b.height;
  return Math.abs(ratioB - idealRatio) - Math.abs(ratioA - idealRatio) > 0;
}

function filterFormats({
  formats,
  idealRatio,
}: {
  formats: CameraDeviceFormat[];
  idealRatio?: number;
}) {
  const result: { [resolution: string]: CameraDeviceFormat } = {};
  formats.forEach(e => {
    const { videoHeight: height, videoWidth: width } = e;
    if (height < 480 || width < 480 || height > width) {
      return;
    }
    if (
      idealRatio !== undefined &&
      (width / height).toPrecision(4) !== idealRatio.toPrecision(4)
    ) {
      return;
    }
    const identifier = `${width}x${height}`;
    if (result[identifier] === undefined) {
      result[identifier] = e;
    } else {
      if (getMaxFps(result[identifier]) < getMaxFps(e)) {
        result[identifier] = e;
      }
    }
  });
  return Object.entries(result).map(e => e[1]);
}

interface DistanceToScWithTime {
  [distance: number | string]: { sc: number; time: number };
}

export default function CameraScreen({ navigation }: NavigatorProps) {
  const dispatch = useAppDispatch();
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const cameraRef = useRef<Camera>(null);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [isMute, setIsMute] = useState<boolean>(false);
  const [format, setFormat] = useState<CameraDeviceFormat | undefined>(
    undefined
  );
  const [pixelRatio, setPixelRatio] = useState<number>(1);
  const [scWithTimestamp, setScWithTimestamp] = useState<DistanceToScWithTime>(
    {}
  );
  const isRecording = useAppSelector(state => state.recording.isRecording);
  const currentDistance = useAppSelector(
    state => state.recording.currentDistance
  );
  const bfTrio = useSharedValue<BoundingFrameTrio>({});
  const strokeCounted = useSharedValue<number>(0);
  const sharedIsRecording = useSharedValue<boolean>(isRecording);
  const sharedCurrentDistance = useSharedValue<DistanceOrDone>(currentDistance);

  const frameProcessor = useFrameProcessor(frame => {
    'worklet';
    if (
      sharedIsRecording.value &&
      sharedCurrentDistance.value !== 'DONE' &&
      sharedCurrentDistance.value > 0
    ) {
      const results = detectSwimmers(frame);
      if (
        results === null ||
        results === undefined ||
        results.result.length === 0
      ) {
        return;
      }
      const { prevPrevBf, prevBf, currBf } = bfTrio.value;
      const newBfTrio: BoundingFrameTrio = {
        prevPrevBf: prevBf,
        prevBf: currBf,
      };
      const resultBf = results.result.map(e => e.frame);
      let c: BoundingFrame | undefined;
      if (currBf === undefined) {
        // set initial bf
        c = resultBf.reduce((prev, next) => (next.y > prev.y ? next : prev));
        newBfTrio.currBf = c;
        bfTrio.value = newBfTrio;
        return;
      }
      c = resultBf.reduce((prev, curr) => {
        const cx1 = prev.x + prev.width / 2;
        const cy1 = prev.y + prev.height / 2;
        const cx2 = curr.x + curr.width / 2;
        const cy2 = curr.y + curr.height / 2;
        const cx3 = currBf.x + currBf.width / 2;
        const cy3 = currBf.y + currBf.height / 2;
        const dist1 = Math.sqrt(
          Math.pow(cx1 - cx3, 2) + Math.pow(cy1 - cy3, 2)
        );
        const dist2 = Math.sqrt(
          Math.pow(cx2 - cx3, 2) + Math.pow(cy2 - cy3, 2)
        );
        if (dist2 < dist1) {
          return curr;
        } else {
          return prev;
        }
      });
      newBfTrio.currBf = c;
      if (prevBf !== undefined) {
        const bfTrioIsPeak =
          newBfTrio.prevBf === undefined ||
          newBfTrio.prevPrevBf === undefined ||
          newBfTrio.currBf === undefined
            ? false
            : newBfTrio.prevBf.height > newBfTrio.prevPrevBf.height &&
              newBfTrio.prevBf.height >= newBfTrio.currBf.height;
        if (bfTrioIsPeak) {
          strokeCounted.value += 0.5;
        }
      }
      bfTrio.value = newBfTrio;
      // runOnJS(setOcr)(results);
    }
  }, []);
  // const addToLsOfBf = (resultBf: Array<BoundingFrame>) => {
  //   console.log(`new`);
  //   if (resultBf.length === 0) {
  //     return;
  //   }
  //   setLsOfBf(prev => {
  //     let nextBf: BoundingFrame | null = null;
  //     if (prev.length === 0) {
  //       nextBf = resultBf.reduce((prev, next) =>
  //         next.y > prev.y ? next : prev
  //       );
  //     } else {
  //       const prevBf = prev[prev.length - 1];
  //       nextBf = findNearestBoundingFrame(prevBf, resultBf);
  //     }
  //     if (nextBf !== null) {
  //       return prev.concat(nextBf);
  //     }
  //     return prev;
  //   });
  // };
  // const addResultToResultList = (result: DetectionResult) => {
  //   setResultList(resultList.concat(result));
  // }

  useEffect(() => {
    const isStoppingRecording = sharedIsRecording.value && !isRecording;
    sharedIsRecording.value = isRecording;
    sharedCurrentDistance.value = currentDistance;
    if (isStoppingRecording) {
      console.log(`scWithTime: ${JSON.stringify(scWithTimestamp)}`);
      strokeCounted.value = 0;
      setScWithTimestamp({});
    }
    setScWithTimestamp(prev => {
      if (prev[currentDistance] !== undefined) {
        return prev;
      }
      const copied = { ...prev };
      copied[currentDistance] = { sc: strokeCounted.value, time: Date.now() };
      return copied;
    });
  }, [isRecording, currentDistance]);
  const isActive = useIsForeground();

  const devices = useCameraDevices();
  const device = devices.back;
  const formats = useMemo(() => {
    if (device === undefined) {
      return [];
    }

    const result = filterFormats({
      formats: device.formats,
      idealRatio: 16 / 9,
    });
    if (result.length !== 0) {
      return result;
    }
    return filterFormats({ formats: device.formats });
  }, [device?.formats]);
  useEffect(() => {
    if (format === undefined && formats.length !== 0) {
      const format1080 = formats.find(e => e.photoHeight === 1080);
      setFormat(format1080 ?? formats[0]);
    }
  }, [formats]);

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.getCameraPermissionStatus();
      const microphonePermission = await Camera.getMicrophonePermissionStatus();
      if (
        cameraPermission !== 'authorized' &&
        microphonePermission !== 'authorized'
      ) {
        const newCameraPermission = await Camera.requestCameraPermission();
        const newMicrophonePermission =
          await Camera.requestMicrophonePermission();
        setHasPermission(
          newCameraPermission === 'authorized' &&
            newMicrophonePermission === 'authorized'
        );
      } else {
        setHasPermission(
          cameraPermission === 'authorized' &&
            microphonePermission === 'authorized'
        );
      }
      await createDirs();
      dispatch(clearAnnotation());
    })();
  }, [setHasPermission]);

  const onChangeFormat = (f?: CameraDeviceFormat) => {
    if (f !== undefined) {
      setFormat(f);
    }
  };

  console.log(`stroke count: ${strokeCounted.value}`);
  // const renderOverlay = () => {
  //   return (
  //     <>
  //       {ocr?.result.map((e, i) => {
  //         const width = e.frame.width * pixelRatio;
  //         const height = e.frame.height * pixelRatio;
  //         return (
  //           <Box
  //             key={`${e.label}-${JSON.stringify(e.frame)}`}
  //             style={{
  //               position: 'absolute',
  //               left: e.frame.x * pixelRatio,
  //               top: e.frame.y * pixelRatio,
  //               backgroundColor: 'transparent',
  //               width: width,
  //               height: height,
  //               borderColor: 'red',
  //               borderWidth: 1,
  //               borderRadius: 6,
  //             }}
  //           />
  //         );
  //       })}
  //     </>
  //   );
  // };

  if (hasPermission === null) {
    return (
      <ErrorScreen failReason="Do not have camera permissions or microphone permission." />
    );
  }
  if (hasPermission === false || device === null || device === undefined) {
    return <LoadingScreen itemThatIsLoading="camera" />;
  }
  return (
    <Box
      flex={1}
      onLayout={(event: LayoutChangeEvent) => {
        setPixelRatio(
          event.nativeEvent.layout.width /
            PixelRatio.getPixelSizeForLayoutSize(event.nativeEvent.layout.width)
        );
      }}
    >
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        format={format}
        ref={cameraRef}
        video={true}
        audio={!isMute}
        isActive={isActive}
        enableZoomGesture={true}
        onInitialized={() => setIsReady(true)}
        frameProcessorFps={5}
        frameProcessor={frameProcessor}
      />
      <Row flex={1}>
        <Column justifyContent="space-around" m={3}>
          <BackButton goBack={navigation.goBack} />
          <SelectMode />
          <Column flex={2} />
          <MuteButton isMute={isMute} setIsMute={setIsMute} />
          <SelectFormat
            formats={formats}
            format={format}
            onChangeFormat={onChangeFormat}
          />
        </Column>
        <Row flex={1} justifyContent="flex-end" mr="3">
          <Column justifyContent="center" alignItems="center">
            <RecordButton camera={cameraRef.current} isReady={isReady} />
            <Center
              position="absolute"
              bottom={0}
              mb={{ sm: 5, md: 8, lg: 16 }}
            >
              <CheckpointButton />
            </Center>
          </Column>
        </Row>
      </Row>
    </Box>
  );
}
