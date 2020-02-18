import React from 'react';
import { Image, StatusBar } from 'react-native';
import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';

import { Block, GalioProvider } from '../libs/galio';

import { Images, theme } from './constants';
import AppNavigator from './navigation/TabAppNavigator';
import { setTopLevelNavigator } from './navigation/NavigationService';

const assetImages = [];

function cacheImages(images: any) {
  return images.map((image: any) => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}

const App = () => {
  const [isLoadingComplete, setIsLoadingComplete] = React.useState(false);

  const _loadResourcesAsync = async () => {
    await Promise.all([
      ...cacheImages(assetImages),
      Font.loadAsync({
        Montserrat: require('../assets/font/Montserrat-Regular.ttf'),
        'Montserrat-Bold': require('../assets/font/Montserrat-Bold.ttf'),
        'Montserrat-Light': require('../assets/font/Montserrat-Light.ttf'),
        'Montserrat-Medium': require('../assets/font/Montserrat-Medium.ttf'),
        'Montserrat-SemiBold': require('../assets/font/Montserrat-SemiBold.ttf'),
        OpenSans: require('../assets/font/OpenSans-Regular.ttf'),
        'OpenSans-Bold': require('../assets/font/OpenSans-Bold.ttf'),
        'OpenSans-Light': require('../assets/font/OpenSans-Light.ttf'),
        Galio: require('../assets/font/galio.ttf'),
        ArgonExtra: require('../assets/font/argon.ttf')
      })
    ]);
  };

  const _handleLoadingError = (error: any) => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  const _handleFinishLoading = () => {
    setIsLoadingComplete(true);
  };

  if (!isLoadingComplete) {
    return (
      <AppLoading startAsync={_loadResourcesAsync} onError={_handleLoadingError} onFinish={_handleFinishLoading} />
    );
  } else {
    return (
      <GalioProvider theme={theme}>
        <StatusBar barStyle="dark-content" />

        <Block flex>
          <AppNavigator ref={navigatorRef => setTopLevelNavigator(navigatorRef)} />
        </Block>
      </GalioProvider>
    );
  }
};

export default App;
