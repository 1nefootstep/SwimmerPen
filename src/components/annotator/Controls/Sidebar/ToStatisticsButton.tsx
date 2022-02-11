import React from 'react';
import { Button, Center } from 'native-base';

export default function ToStatisticsButton({ navigation }) {
  return (
    <Center>
      <Button
        onPress={() => {
          navigation.navigate('Statistics');
        }}
        w={24}
        colorScheme="info"
        variant="subtle"
        size={{ sm: 'sm', md: 'sm', lg: 'md' }}
      >
        Statistics
      </Button>
    </Center>
  );
}
