import React from 'react';
import { Provider } from 'react-redux';

import {
  Text,
  Box,
  Link,
  HStack,
  Center,
  Heading,
  Switch,
  useColorMode,
  NativeBaseProvider,
  extendTheme,
  VStack,
  Code,
} from 'native-base';
import NativeBaseIcon from './components/NativeBaseIcon';
import * as ScreenOrientation from 'expo-screen-orientation';

import CameraScreen from './screens/Camera';
import { config } from './constants/Config';
import { store } from './state/redux';

// Define the config

// extend the theme
export const theme = extendTheme({ config });

// return (
//   <NativeBaseProvider>
//     <Center
//       _dark={{ bg: "blueGray.900" }}
//       _light={{ bg: "blueGray.50" }}
//       px={4}
//       flex={1}
//     >
//       <VStack space={5} alignItems="center">
//         <NativeBaseIcon />
//         <Heading size="lg">Welcome to NativeBase</Heading>
//         <HStack space={2} alignItems="center">
//           <Text>Edit</Text>
//           <Code>App.tsx</Code>
//           <Text>and save to reload.</Text>
//         </HStack>
//         <Link href="https://docs.nativebase.io" isExternal>
//           <Text color="primary.500" underline fontSize={"xl"}>
//             Learn NativeBase
//           </Text>
//         </Link>
//         <ToggleDarkMode />
//       </VStack>
//     </Center>
//   </NativeBaseProvider>
// );

export default function App() {
  return (
    <Provider store={store}>
      <NativeBaseProvider>
        <Box flex={1} safeArea>
          <CameraScreen />
        </Box>
      </NativeBaseProvider>
    </Provider>
  );
}

// Color Switch Component
function ToggleDarkMode() {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <HStack space={2} alignItems="center">
      <Text>Dark</Text>
      <Switch
        isChecked={colorMode === 'light' ? true : false}
        onToggle={toggleColorMode}
        aria-label={
          colorMode === 'light' ? 'switch to dark mode' : 'switch to light mode'
        }
      />
      <Text>Light</Text>
    </HStack>
  );
}
