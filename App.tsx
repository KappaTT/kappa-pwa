import React from 'react';
import * as Sentry from 'sentry-expo';
import Constants from 'expo-constants';
import { Provider } from 'react-redux';
import { AppearanceProvider } from 'react-native-appearance';

import App from './src/App';
import store from '@reducers';

Sentry.init({
  dsn: 'https://83abd164c9094221ba93a377464f3fe4@o378213.ingest.sentry.io/5201293',
  enableInExpoDevelopment: false,
  debug: true
});

const AppWrapper = () => {
  return (
    <Provider store={store}>
      <AppearanceProvider>
        <App />
      </AppearanceProvider>
    </Provider>
  );
};

export default AppWrapper;
