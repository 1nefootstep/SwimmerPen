import React from 'react';
import { Button, Icon, Row } from 'native-base';
import { AntDesign } from '@expo/vector-icons';

export default function Home({ navigation }) {
  return (
    <Row flex={1} justifyContent="space-around" alignItems="center">
      <Button
        h={{ sm: '25', md: '48', lg: '96' }}
        onPress={() => {
          navigation.navigate('CameraScreen');
        }}
        leftIcon={<Icon as={AntDesign} name="camera" size="sm" />}
      >
        Camera
      </Button>
      <Button
        onPress={() => {
          navigation.navigate('AnnotationScreen');
        }}
        leftIcon={<Icon as={AntDesign} name="camera" size="sm" />}
      >
        Annotation
      </Button>
      <Button
        onPress={() => {
          navigation.navigate('Statistics');
        }}
        leftIcon={<Icon as={AntDesign} name="camera" size="sm" />}
      >
        Report
      </Button>
    </Row>
  );
}
