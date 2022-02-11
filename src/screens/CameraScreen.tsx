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

function getMaxFps(format: CameraDeviceFormat): number {
  return format.frameRateRanges.reduce((prev, curr) => {
    if (curr.maxFrameRate > prev) return curr.maxFrameRate;
    else return prev;
  }, 0);
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
  // const [ratio, setRatio] = useState('4:3');
  // const [isRatioSet, setIsRatioSet] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  // const [videoQuality, setVideoQuality] = useState<AvailableResolution>('720p');
  const [isMute, setIsMute] = useState<boolean>(false);
  // const [zoom, setZoom] = useState<number>(1);
  // const [maxZoom, setMaxZoom] = useState<number>(1);

  const devices = useCameraDevices();
  const device = devices.back;
  // const isForeground = useIsForeground();
  const format = useMemo(() => {
    if (device === undefined) {
      return undefined;
    }
    const f = device?.formats.sort(sortFormats)[0];
    console.log(
      `resolution: ${f?.videoWidth}x${
        f?.videoHeight
      },\n fps range: ${f?.frameRateRanges.map(e =>
        JSON.stringify(e)
      )},\n max zoom:${f?.maxZoom}`
    );
    return f;
  }, [device?.formats]);

  useEffect(() => {
    (async () => {
      // const { status } = await Camera.requestCameraPermissionsAsync();
      const cameraPermission = await Camera.getCameraPermissionStatus();
      const microphonePermission = await Camera.getMicrophonePermissionStatus();
      // const micPermissionResponse =
      //   await Camera.requestMicrophonePermissionsAsync();
      //console.log(`${JSON.stringify(micPermissionResponse)}`);
      if (
        cameraPermission === 'not-determined' &&
        microphonePermission === 'not-determined'
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

  // const prepareRatio = async () => {
  //   let desiredRatio = '16:9';
  //   if (Platform.OS === 'android') {
  //     const ratios = await cameraRef.current!.getSupportedRatiosAsync();
  //     if (ratios.some(r => r === desiredRatio)) {
  //       setRatio(desiredRatio);
  //     }
  //   }
  //   setIsRatioSet(true);
  // };

  // const onCameraReady = async () => {
  //   if (!isRatioSet) {
  //     await prepareRatio();
  //   }
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
        <Column flex={1} mr="3">
          <Column flex={1} alignItems="flex-start">
            <Column justifyContent="space-around" m={3}>
              <BackButton goBack={navigation.goBack} />
              <SelectMode />
              <Column flex={2} />
              <MuteButton isMute={isMute} setIsMute={setIsMute} />
              <Column flex={1} />
            </Column>
          </Column>
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