import React from 'react';
import {
  Pressable,
  Center,
  Box,
  Text,
  Row,
  Spacer,
  VStack,
  Image,
} from 'native-base';
import { ImageRequireSource } from 'react-native';

function ImageButton({
  onPress,
  description,
  requireAsset,
}: {
  onPress: () => void;
  description: string;
  requireAsset: ImageRequireSource;
}) {
  return (
    <VStack flex={1} justifyContent="center" alignItems="center">
      <Pressable onPress={onPress}>
        {({ isPressed }) => {
          return (
            <Center>
              <Image
                blurRadius={isPressed ? 20 : 0}
                borderRadius="40"
                size={isPressed ? '56' : '64'}
                source={requireAsset}
                alt={description}
              />
              <Text>{description}</Text>
            </Center>
          );
        }}
      </Pressable>
    </VStack>
  );
}

export default function Home({ navigation }) {
  return (
    <Row flex={1} justifyContent="space-around" alignItems="center">
      <Spacer />

      <Box flex={3} h="95%">
        <ImageButton
          onPress={() => navigation.navigate('CameraScreen')}
          description="Camera"
          requireAsset={require('../../assets/swimButton.jpg')}
        />
      </Box>
      <Spacer />
      <Box flex={3} h="95%">
        <ImageButton
          onPress={() => navigation.navigate('AnnotationScreen')}
          description="Annotation"
          requireAsset={require('../../assets/annotationButton.jpg')}
        />
      </Box>
      <Spacer />
    </Row>
  );
}
