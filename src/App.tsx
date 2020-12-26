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
import {
  Block,
  Ghost,
  EventDrawer,
  BrotherDrawer,
  ToastController,
  VotingController,
  ModalController
} from '@components';
import { Images, theme } from '@constants';
import AppNavigator from '@navigation/AppNavigator';

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
  const loadedPrefs = useSelector((state: TRedux) => state.prefs.loaded);
  const selectedEventId = useSelector((state: TRedux) => state.kappa.selectedEventId);
  const selectedUserEmail = useSelector((state: TRedux) => state.kappa.selectedUserEmail);
  const editingUserEmail = useSelector((state: TRedux) => state.kappa.editingUserEmail);

  const [isLoadingComplete, setIsLoadingComplete] = React.useState<boolean>(false);

  const dispatch = useDispatch();
  const dispatchShowLogin = React.useCallback(() => dispatch(_auth.showModal()), [dispatch]);
  const dispatchCancelEditUser = React.useCallback(() => dispatch(_kappa.cancelEditUser()), [dispatch]);
  const dispatchLoadUser = React.useCallback(() => dispatch(_auth.loadUser()), [dispatch]);
  const dispatchLoadPrefs = React.useCallback(() => dispatch(_prefs.loadPrefs()), [dispatch]);

  const _handleFinishLoading = React.useCallback(() => {
    setIsLoadingComplete(true);
  }, []);

  const handleLoading = React.useCallback(async () => {
    await _loadResourcesAsync();
    _handleFinishLoading();
  }, [_handleFinishLoading]);

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

  React.useEffect(() => {
    handleLoading();
  }, [handleLoading]);

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

            <Ghost style={styles.overlay}>
              <EventDrawer />
            </Ghost>

            <Ghost style={styles.overlay}>
              <BrotherDrawer />
            </Ghost>

            <ModalController />

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
