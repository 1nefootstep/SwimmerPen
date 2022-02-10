import { useState } from 'react';
import { useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';

export function useIsForeground() {
  // const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(true);
  const _handleAppStateChange = (nextAppState: AppStateStatus) => {
    setAppStateVisible(
      (AppState.currentState.match(/inactive|background/) ?? false) &&
        nextAppState === 'active'
    );
  };

  useEffect(() => {
    AppState.addEventListener('change', _handleAppStateChange);
    return () => {
      AppState.removeEventListener('change', _handleAppStateChange);
    };
  }, [setAppStateVisible]);

  return appStateVisible;
}
