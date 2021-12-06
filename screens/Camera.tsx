import React, { useState, useEffect, useRef } from 'react';
import { Text, Box, Row, Center, Column } from 'native-base';

import { Camera } from 'expo-camera';

import { Platform } from 'react-native';
import RecordButton from '../components/camera/RecordButton';
import SelectMode from '../components/SelectMode';
import SelectResolution from '../components/camera/SelectResolution';

export default function CameraScreen() {
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const cameraRef = useRef<Camera>(null);
  const [ratio, setRatio] = useState('4:3');
  const [isRatioSet, setIsRatioSet] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [videoQuality, setVideoQuality] = useState<string>('720');
  const [isMute, setIsMute] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      const micPermissionResponse =
        await Camera.requestMicrophonePermissionsAsync();
      console.log(`${JSON.stringify(micPermissionResponse)}`);
      setHasPermission(
        status === 'granted' && micPermissionResponse.status === 'granted'
      );
    })();
  }, []);

  const prepareRatio = async () => {
    let desiredRatio = '16:9';
    if (Platform.OS === 'android') {
      const ratios = await cameraRef.current!.getSupportedRatiosAsync();
      if (ratios.some((r) => r === desiredRatio)) {
        setRatio(desiredRatio);
      }
    }
    setIsRatioSet(true);
  };

  const onCameraReady = async () => {
    if (!isRatioSet) {
      await prepareRatio();
    }
  };

  if (hasPermission === null) {
    return <Center />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <Box flex={1}>
      <Camera
        style={{ flex: 1 }}
        type={Camera.Constants.Type.back}
        onCameraReady={onCameraReady}
        autoFocus={true}
        ratio={ratio}
        ref={cameraRef}
      >
        <Row flex={1}>
          <Column flex={1} mr="3">
            <Column flex={1} alignItems="flex-start" ml="3">
              <Column flex={1} justifyContent="space-around">
                <SelectMode />
                <Column flex={2} />
                <SelectResolution
                  resolutions={['480', '720', '1080', '2160']}
                  setVideoQuality={setVideoQuality}
                />
              </Column>
            </Column>
          </Column>
          <Column flex={1} alignItems="flex-end" mr="3">
            <Column flex={1} justifyContent="center">
              <RecordButton
                isRecording={isRecording}
                setIsRecording={setIsRecording}
                cameraRef={cameraRef}
                recordOptions={{ quality: videoQuality }}
              />
            </Column>
          </Column>
        </Row>
      </Camera>
    </Box>
  );
}
