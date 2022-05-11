import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { NativeBaseProvider, extendTheme } from 'native-base';
import { config } from './src/constants/Config';
import { store } from './src/state/redux';
import { setStatusBarHidden, StatusBar } from 'expo-status-bar';
import RootNavigator from './src/router';
import * as NavigationBar from 'expo-navigation-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useIsForeground } from './src/hooks/useIsForeground';

// extend the theme
export const theme = extendTheme({ config });

export default function App() {
  const appStateVisible = useIsForeground();
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  // hides the status bar when the app is on the foreground of device
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
