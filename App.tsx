import React from 'react';
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
import RootNavigator from './router';

// Define the config

// extend the theme
export const theme = extendTheme({ config });

export default function App() {
  return (
    <Provider store={store}>
      <NativeBaseProvider>
        <RootNavigator />
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
