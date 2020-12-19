import React from 'react';
import * as Sentry from 'sentry-expo';
import { Provider } from 'react-redux';
import { AppearanceProvider } from 'react-native-appearance';

import App from './src/App';
import store from '@reducers';
import * as secrets from 'secrets';

Sentry.init({
  dsn: secrets.SENTRY_DSN,
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
