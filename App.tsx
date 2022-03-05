import React, { useEffect, useState } from 'react';
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
import { setStatusBarHidden, StatusBar } from 'expo-status-bar';
import RootNavigator from './src/router';
import * as NavigationBar from 'expo-navigation-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useIsForeground } from './src/hooks/useIsForeground';

// Define the config

// extend the theme
export const theme = extendTheme({ config });

export default function App() {
  const appStateVisible = useIsForeground();
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const sub = NavigationBar.addVisibilityListener(({ visibility }) => {
      if (visibility === 'visible') {
        if (timer !== null) {
          clearTimeout(timer);
        }
        setTimer(
          setTimeout(() => {
            NavigationBar.setVisibilityAsync('hidden');
          
          }, 2000)
        );
      }
    });
    setStatusBarHidden(true, 'slide');
    NavigationBar.setBehaviorAsync('inset-swipe');
    return () => {
      sub.remove();
      if (timer !== null) {
        clearTimeout(timer);
      }
    };
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
