import React from 'react';
import { StyleSheet, Image, StatusBar, Platform } from 'react-native';
import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import { useSelector, useDispatch } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';

import { GalioProvider } from '@galio';

import { TRedux } from '@reducers';
import { _auth, _kappa, _prefs, _ui } from '@reducers/actions';
import { incompleteUser } from '@backend/auth';
import {
  Block,
  Ghost,
  FadeModal,
  SlideModal,
  EventDrawer,
  BrotherDrawer,
  ToastController,
  VotingController
} from '@components';
import { Images, theme } from '@constants';
import AppNavigator from '@navigation/AppNavigator';
import { LoginPage, OnboardingPage } from '@pages';

enableScreens();

const assetImages = [Images.Kappa];

const cacheImages = (images: any) => {
  return images.map((image: any) => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
};

const _loadResourcesAsync = async () => {
  await Promise.all([
    ...cacheImages(assetImages),
    Font.loadAsync({
      OpenSans: require('../assets/font/OpenSans-Regular.ttf'),
      'OpenSans-Bold': require('../assets/font/OpenSans-Bold.ttf'),
      'OpenSans-SemiBold': require('../assets/font/OpenSans-SemiBold.ttf'),
      'OpenSans-Light': require('../assets/font/OpenSans-Light.ttf'),
      'PlayfairDisplay-Bold': require('../assets/font/PlayfairDisplay-Bold.ttf')
    })
  ]);
};

const _handleLoadingError = (error: any) => {
  // In this case, you might want to report the error to your error
  // reporting service, for example Sentry
  console.warn(error);
};

const App = () => {
  const loadedUser = useSelector((state: TRedux) => state.auth.loadedUser);
  const authorized = useSelector((state: TRedux) => state.auth.authorized);
  const user = useSelector((state: TRedux) => state.auth.user);
  const loginVisible = useSelector((state: TRedux) => state.auth.visible);
  const loadedPrefs = useSelector((state: TRedux) => state.prefs.loaded);
  const selectedEventId = useSelector((state: TRedux) => state.kappa.selectedEventId);
  const selectedUserEmail = useSelector((state: TRedux) => state.kappa.selectedUserEmail);
  const editingUserEmail = useSelector((state: TRedux) => state.kappa.editingUserEmail);

  const [isLoadingComplete, setIsLoadingComplete] = React.useState<boolean>(false);

  const userIsIncomplete = React.useMemo(() => {
    if (!authorized || !user) return false;

    let incomplete = false;

    for (const key of Object.keys(incompleteUser)) {
      if (user[key] === undefined || user[key] === incompleteUser[key]) {
        incomplete = true;
        break;
      }
    }

    return incomplete;
  }, [authorized, user]);

  const dispatch = useDispatch();
  const dispatchShowLogin = React.useCallback(() => dispatch(_auth.showModal()), [dispatch]);
  const dispatchCancelEditUser = React.useCallback(() => dispatch(_kappa.cancelEditUser()), [dispatch]);
  const dispatchLoadUser = React.useCallback(() => dispatch(_auth.loadUser()), [dispatch]);
  const dispatchLoadPrefs = React.useCallback(() => dispatch(_prefs.loadPrefs()), [dispatch]);

  const _handleFinishLoading = React.useCallback(() => {
    setIsLoadingComplete(true);
  }, []);

  React.useEffect(() => {
    if (!loadedUser) {
      dispatchLoadUser();
    }
  }, [dispatchLoadUser, loadedUser]);

  React.useEffect(() => {
    if (loadedUser && !authorized) {
      dispatchShowLogin();
    }
  }, [loadedUser, authorized, dispatchShowLogin]);

  React.useEffect(() => {
    if (!loadedPrefs) {
      dispatchLoadPrefs();
    }
  }, [dispatchLoadPrefs, loadedPrefs]);

  const renderOverlay = () => {
    if (Platform.OS === 'ios' || selectedEventId !== '' || selectedUserEmail !== '') {
      return (
        <React.Fragment>
          <Ghost style={styles.overlay}>
            <EventDrawer />
          </Ghost>

          <Ghost style={styles.overlay}>
            <BrotherDrawer />
          </Ghost>
        </React.Fragment>
      );
    } else {
      return <React.Fragment />;
    }
  };

  if (!isLoadingComplete) {
    return (
      <AppLoading startAsync={_loadResourcesAsync} onError={_handleLoadingError} onFinish={_handleFinishLoading} />
    );
  } else {
    return (
      <GalioProvider theme={theme}>
        <StatusBar animated={true} translucent={true} backgroundColor="transparent" barStyle="dark-content" />

        <SafeAreaProvider>
          <Block flex>
            <AppNavigator />

            {renderOverlay()}

            <FadeModal transparent={false} visible={loginVisible} disableAndroidBack={true} onRequestClose={() => {}}>
              <LoginPage />
            </FadeModal>

            <SlideModal
              transparent={false}
              visible={userIsIncomplete || (authorized && editingUserEmail === user.email)}
              onRequestClose={dispatchCancelEditUser}
              disableAndroidBack={userIsIncomplete}
            >
              <OnboardingPage />
            </SlideModal>

            <ToastController />

            <VotingController />
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
