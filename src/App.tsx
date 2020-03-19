import React from 'react';
import { Image, StatusBar } from 'react-native';
import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import { useSelector, useDispatch } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { GalioProvider } from '@galio';

import { TRedux } from '@reducers';
import { _auth, _prefs } from '@reducers/actions';
import { Block, FadeModal } from '@components';
import { Images, theme } from '@constants';
import AppNavigator from '@navigation/TabAppNavigator';
import { setTopLevelNavigator, navigate } from '@navigation/NavigationService';
import { LoginPage } from '@pages';

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
  const [isLoadingComplete, setIsLoadingComplete] = React.useState<boolean>(false);
  const [isNavigatorReady, setIsNavigatorReady] = React.useState<boolean>(false);

  const loadedUser = useSelector((state: TRedux) => state.auth.loadedUser);
  const authorized = useSelector((state: TRedux) => state.auth.authorized);
  const loginVisible = useSelector((state: TRedux) => state.auth.visible);
  const loadedPrefs = useSelector((state: TRedux) => state.prefs.loaded);

  const dispatch = useDispatch();
  const dispatchShowLogin = React.useCallback(() => dispatch(_auth.showModal()), [dispatch]);
  const dispatchLoadUser = React.useCallback(() => dispatch(_auth.loadUser()), [dispatch]);
  const dispatchLoadPrefs = React.useCallback(() => dispatch(_prefs.loadPrefs()), [dispatch]);

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

  React.useEffect(() => {
    if (!loadedUser) {
      dispatchLoadUser();
    }
  }, [loadedUser]);

  React.useEffect(() => {
    if (loadedUser && !authorized) {
      dispatchShowLogin();
    }
  }, [loadedUser, authorized]);

  React.useEffect(() => {
    if (!loadedPrefs) {
      dispatchLoadPrefs();
    }
  }, [loadedPrefs]);

  if (!isLoadingComplete) {
    return (
      <AppLoading startAsync={_loadResourcesAsync} onError={_handleLoadingError} onFinish={_handleFinishLoading} />
    );
  } else {
    return (
      <GalioProvider theme={theme}>
        <StatusBar barStyle="dark-content" />

        <SafeAreaProvider>
          <Block flex>
            <AppNavigator
              ref={navigatorRef => {
                setTopLevelNavigator(navigatorRef);
                setIsNavigatorReady(true);
              }}
            />

            <FadeModal transparent={false} visible={loginVisible} onRequestClose={() => {}}>
              <LoginPage onRequestClose={() => {}}></LoginPage>
            </FadeModal>
          </Block>
        </SafeAreaProvider>
      </GalioProvider>
    );
  }
};

export default App;
