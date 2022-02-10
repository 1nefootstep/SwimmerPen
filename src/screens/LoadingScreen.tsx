import React from 'react';
import { Center, Spinner, Heading } from 'native-base';

export default function LoadingScreen(props: { itemThatIsLoading?: string }) {
  const itemLoading = props.itemThatIsLoading ?? 'something';
  const loadingText = `Loading ${itemLoading}`;
  return (
    <Center
      flex={1}
      _dark={{ bg: 'coolGray.800' }}
      _light={{ bg: 'warmGray.50' }}
    >
      <Spinner accessibilityLabel={loadingText} />
      <Heading color="primary.500" fontSize="md">
        {loadingText}
      </Heading>
    </Center>
  );
}
