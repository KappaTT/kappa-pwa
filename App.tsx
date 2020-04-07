import React from 'react';
import { Provider } from 'react-redux';
import { AppearanceProvider } from 'react-native-appearance';

import App from './src/App';
import store from '@reducers';

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
