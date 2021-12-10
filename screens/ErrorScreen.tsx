import React from 'react';
import { Center, Heading } from 'native-base';

export default function LoadingScreen(props: { failReason?: string }) {
  return (
    <Center
      flex={1}
      _dark={{ bg: 'coolGray.800' }}
      _light={{ bg: 'warmGray.50' }}
    >
      <Heading color="primary.500" fontSize="md">
        {`Error: ${props.failReason ?? 'unknown'}`}
      </Heading>
    </Center>
  );
}
