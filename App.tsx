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
import { config } from './src/constants/Config';
import { store } from './src/state/redux';
import { StatusBar } from 'expo-status-bar';
import RootNavigator from './src/router';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import { AppState, AppStateStatus } from 'react-native';
import Constants from 'expo-constants';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useIsForeground } from './src/hooks/useIsForeground';

// Define the config

// extend the theme
export const theme = extendTheme({ config });

export default function App() {
  const appState = useRef(AppState.currentState);
  const appStateVisible = useIsForeground();
  // const [appStateVisible, setAppStateVisible] = useState(appState.current);

  // useEffect(() => {
  //   AppState.addEventListener('change', _handleAppStateChange);

  //   return () => {
  //     AppState.removeEventListener('change', _handleAppStateChange);
  //   };
  // }, []);

  // const _handleAppStateChange = (nextAppState: AppStateStatus) => {
  //   if (
  //     appState.current.match(/inactive|background/) &&
  //     nextAppState === 'active'
  //   ) {
  //     //console.log('App has come to the foreground!');
  //   }

  //   appState.current = nextAppState;
  //   setAppStateVisible(appState.current);
  //   //console.log('AppState', appState.current);
  // };

  useEffect(() => {
    if (Constants.appOwnership !== 'expo') {
      SystemNavigationBar.stickyImmersive();
    }
  }, [appStateVisible]);

  return (
    <Provider store={store}>
      <NativeBaseProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <RootNavigator />
        </GestureHandlerRootView>
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
