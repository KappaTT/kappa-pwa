import React from 'react';
import { StyleSheet, Image, StatusBar } from 'react-native';
import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import { useSelector, useDispatch } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';

import { GalioProvider } from '@galio';

import { TRedux } from '@reducers';
import { _auth, _prefs, _ui } from '@reducers/actions';
import { incompleteUser } from '@backend/auth';
import { Block, Ghost, FadeModal, SlideModal, EventDrawer, BrotherDrawer, ToastController } from '@components';
import { Images, theme } from '@constants';
import AppNavigator from '@navigation/TabAppNavigator';
import { setTopLevelNavigator } from '@navigation/NavigationService';
import { LoginPage, OnboardingPage } from '@pages';

enableScreens();

const assetImages = [Images.Kappa];

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
  const loadedUser = useSelector((state: TRedux) => state.auth.loadedUser);
  const authorized = useSelector((state: TRedux) => state.auth.authorized);
  const user = useSelector((state: TRedux) => state.auth.user);
  const loginVisible = useSelector((state: TRedux) => state.auth.visible);
  const loadedPrefs = useSelector((state: TRedux) => state.prefs.loaded);
  const onboardingVisible = useSelector((state: TRedux) => state.auth.onboardingVisible);
  const isEditingUser = useSelector((state: TRedux) => state.auth.isEditingUser);

  const [isLoadingComplete, setIsLoadingComplete] = React.useState<boolean>(false);
  const [isNavigatorReady, setIsNavigatorReady] = React.useState<boolean>(false);

  const dispatch = useDispatch();
  const dispatchShowLogin = React.useCallback(() => dispatch(_auth.showModal()), [dispatch]);
  const dispatchHideLogin = React.useCallback(() => dispatch(_auth.hideModal()), [dispatch]);
  const dispatchShowOnboarding = React.useCallback(() => dispatch(_auth.showOnboarding()), [dispatch]);
  const dispatchHideOnboarding = React.useCallback(() => dispatch(_auth.hideOnboarding()), [dispatch]);
  const dispatchLoadUser = React.useCallback(() => dispatch(_auth.loadUser()), [dispatch]);
  const dispatchLoadPrefs = React.useCallback(() => dispatch(_prefs.loadPrefs()), [dispatch]);

  const _loadResourcesAsync = async () => {
    await Promise.all([
      ...cacheImages(assetImages),
      Font.loadAsync({
        OpenSans: require('../assets/font/OpenSans-Regular.ttf'),
        'OpenSans-Bold': require('../assets/font/OpenSans-Bold.ttf'),
        'OpenSans-SemiBold': require('../assets/font/OpenSans-SemiBold.ttf'),
        'OpenSans-Light': require('../assets/font/OpenSans-Light.ttf'),
        'PlayfairDisplay-Bold': require('../assets/font/PlayfairDisplay-Bold.ttf'),
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
    if (!authorized || !user) {
      if (onboardingVisible) {
        dispatchHideOnboarding();
      }

      return;
    }

    if (isEditingUser) {
      return;
    }

    let incomplete = false;

    for (const key of Object.keys(incompleteUser)) {
      if (user[key] === undefined || user[key] === incompleteUser[key]) {
        incomplete = true;
        break;
      }
    }

    if (incomplete && !onboardingVisible) {
      dispatchShowOnboarding();
    } else if (!incomplete && onboardingVisible) {
      dispatchHideOnboarding();
    }
  }, [authorized, user, onboardingVisible, isEditingUser]);

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

            <Ghost style={styles.overlay}>
              <EventDrawer />
            </Ghost>

            <Ghost style={styles.overlay}>
              <BrotherDrawer />
            </Ghost>

            <FadeModal transparent={false} visible={loginVisible} disableAndroidBack={true} onRequestClose={() => {}}>
              <LoginPage />
            </FadeModal>

            <SlideModal
              transparent={false}
              visible={onboardingVisible}
              onRequestClose={() => {}}
              disableAndroidBack={true}
            >
              <OnboardingPage />
            </SlideModal>

            <ToastController />
          </Block>
        </SafeAreaProvider>
      </GalioProvider>
    );
  }
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  }
});

export default App;
