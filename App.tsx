import React, { useEffect, useRef, useState } from 'react';
import { Provider } from 'react-redux';
import {
  Text,
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
import { AppState, AppStateStatus } from 'react-native';

// Define the config

// extend the theme
export const theme = extendTheme({ config });

export default function App() {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    AppState.addEventListener('change', _handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', _handleAppStateChange);
    };
  }, []);

  const _handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      console.log('App has come to the foreground!');
    }

    appState.current = nextAppState;
    setAppStateVisible(appState.current);
    console.log('AppState', appState.current);
  };

  useEffect(() => {
    SystemNavigationBar.stickyImmersive();
  }, [appStateVisible]);

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
