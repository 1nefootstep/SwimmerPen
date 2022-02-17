import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Text, Box, Row, Center, Column, Container } from 'native-base';

import { StyleSheet, Platform } from 'react-native';
import RecordButton from '../components/camera/RecordButton';
import SelectMode from '../components/SelectMode';
import SelectResolution, {
  AvailableResolution,
} from '../components/camera/SelectResolution';
import Zoom from '../components/camera/Zoom';
import BackButton from '../components/BackButton';
import MuteButton from '../components/camera/MuteButton';
import CheckpointButton from '../components/camera/CheckpointButton';
import LoadingScreen from './LoadingScreen';
import ErrorScreen from './ErrorScreen';
import { createDirs } from '../FileHandler';
import { clearAnnotation } from '../state/redux';
import { useAppDispatch } from '../state/redux/hooks';
import {
  Camera,
  CameraDeviceFormat,
  useCameraDevices,
} from 'react-native-vision-camera';
import { useIsForeground } from '../hooks/useIsForeground';
import SelectFormat from '../components/camera/SelectFormat';
import { getMaxFps } from '../state/Util';

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

function sortFormats(
  left: CameraDeviceFormat,
  right: CameraDeviceFormat,
  idealResolution = [1920, 1080],
  idealFps = 60
): number {
  // in this case, points aren't "normalized" (e.g. higher resolution = 1 point, lower resolution = -1 points)
  // the closer to 0, the more points
  function inversePoints({
    value,
    numerator = 1,
    denominator = 0.1,
  }: {
    value: number;
    numerator?: number;
    denominator?: number;
  }) {
    return numerator / (denominator + Math.abs(value));
  }
  const idealRatio = idealResolution[0] / idealResolution[1];
  const idealPixelCount = idealResolution[0] * idealResolution[1];
  let leftPoints = inversePoints({
    value: left.videoWidth / left.videoHeight - idealRatio,
  });
  let rightPoints = inversePoints({
    value: right.videoWidth / right.videoHeight - idealRatio,
  });

  leftPoints += inversePoints({
    value: getMaxFps(left) - idealFps,
    denominator: idealFps / 10,
    numerator: idealFps,
  });
  rightPoints += inversePoints({
    value: getMaxFps(right) - idealFps,
    denominator: idealFps / 10,
    numerator: idealFps,
  });
  leftPoints += inversePoints({
    value: left.videoWidth * left.videoHeight - idealPixelCount,
    denominator: idealPixelCount / 10,
    numerator: idealPixelCount,
  });
  rightPoints += inversePoints({
    value: right.videoWidth * right.videoHeight - idealPixelCount,
    denominator: idealPixelCount / 10,
    numerator: idealPixelCount,
  });

  return rightPoints - leftPoints;
}

export default function CameraScreen({ navigation }) {
  const dispatch = useAppDispatch();
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const cameraRef = useRef<Camera>(null);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  // const [videoQuality, setVideoQuality] = useState<AvailableResolution>('720p');
  const [isMute, setIsMute] = useState<boolean>(false);
  const [format, setFormat] = useState<CameraDeviceFormat | undefined>(
    undefined
  );

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
      //console.log(`creating dir ${result ? 'successful' : 'failed'}`);
      dispatch(clearAnnotation());
    })();
  }, [setHasPermission]);

  const onChangeFormat = (f?: CameraDeviceFormat) => {
    if (f !== undefined) {
      setFormat(f);
    }
  };

  if (hasPermission === null) {
    return (
      <ErrorScreen failReason="Do not have camera permissions or microphone permission." />
    );
  }
  if (hasPermission === false || device === null || device === undefined) {
    return <LoadingScreen itemThatIsLoading="camera" />;
  }
  return (
    <Box flex={1}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        format={format}
        ref={cameraRef}
        video={true}
        audio={!isMute}
        isActive={true}
        enableZoomGesture={true}
        onInitialized={() => setIsReady(true)}
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
            <RecordButton
              isRecording={isRecording}
              setIsRecording={setIsRecording}
              camera={cameraRef.current}
              isReady={isReady}
            />
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
