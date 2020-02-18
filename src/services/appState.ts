import { AppState, AppStateStatus } from 'react-native';

export let reachedBackground = false;
export let onForegroundCallback = () => {};

export const setForegroundCallback = (callback: () => void) => {
  onForegroundCallback = callback;
};

export const handleAppStateChange = (nextAppState: AppStateStatus) => {
  if (isBackground(nextAppState)) {
    reachedBackground = true;
  } else if (isForeground(nextAppState)) {
    if (reachedBackground) {
      onForegroundCallback();
    }

    reachedBackground = false;
  }
};

export const isBackground = (appState: AppStateStatus) => {
  return appState === 'background';
};

export const isForeground = (appState: AppStateStatus) => {
  return appState === 'active';
};

export const attach = () => {
  AppState.addEventListener('change', handleAppStateChange);
};

export const dettach = () => {
  AppState.removeEventListener('change', handleAppStateChange);
};
