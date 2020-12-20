import { AppState, AppStateStatus } from 'react-native';

export let reachedBackground = false;
export let onForegroundCallback = () => {};

/**
 * Update the foreground callback to be a given callback.
 */
export const setForegroundCallback = (callback: () => void) => {
  onForegroundCallback = callback;
};

/**
 * Handle the app state change and call appropriate callbacks.
 */
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

/**
 * Check if the app state is background.
 */
export const isBackground = (appState: AppStateStatus) => {
  return appState === 'background';
};

/**
 * Check if the app state is foreground.
 */
export const isForeground = (appState: AppStateStatus) => {
  return appState === 'active';
};

/**
 * Add the app state listener.
 */
export const attach = () => {
  AppState.addEventListener('change', handleAppStateChange);
};

/**
 * Remove the app state listener.
 */
export const dettach = () => {
  AppState.removeEventListener('change', handleAppStateChange);
};
