import React, { useEffect } from 'react';
import { Provider } from 'react-redux';

import {
  Text,
  Box,
  HStack,
  Switch,
  useColorMode,
  NativeBaseProvider,
  extendTheme,
} from 'native-base';

import { config } from './constants/Config';
import { store } from './state/redux';
import { StatusBar } from 'expo-status-bar';
import RootNavigator from './router';
import SystemNavigationBar from 'react-native-system-navigation-bar';

// Define the config

// extend the theme
export const theme = extendTheme({ config });

export default function App() {
  SystemNavigationBar.immersive();
  return (
    <Provider store={store}>
      <NativeBaseProvider>
        <RootNavigator />
        <StatusBar hidden={true} />
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
