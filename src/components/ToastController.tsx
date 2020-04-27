import React from 'react';
import { StyleSheet, Keyboard, AppState, AppStateStatus } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import * as Updates from 'expo-updates';

import { TRedux } from '@reducers';
import { TToast } from '@reducers/ui';
import { _auth, _kappa, _ui } from '@reducers/actions';
import { theme } from '@constants';
import { log } from '@services/logService';
import Block from '@components/Block';
import Ghost from '@components/Ghost';
import Toast from '@components/Toast';
import RoundButton from '@components/RoundButton';

const ToastController: React.FC<{}> = ({}) => {
  const globalErrorMessage = useSelector((state: TRedux) => state.kappa.globalErrorMessage);
  const globalErrorCode = useSelector((state: TRedux) => state.kappa.globalErrorCode);
  const globalErrorDate = useSelector((state: TRedux) => state.kappa.globalErrorDate);
  const isShowingToast = useSelector((state: TRedux) => state.ui.isShowingToast);
  const isHidingToast = useSelector((state: TRedux) => state.ui.isHidingToast);
  const toastTitle = useSelector((state: TRedux) => state.ui.toastTitle);
  const toastMessage = useSelector((state: TRedux) => state.ui.toastMessage);
  const toastAllowClose = useSelector((state: TRedux) => state.ui.toastAllowClose);
  const toastTimer = useSelector((state: TRedux) => state.ui.toastTimer);
  const toastCode = useSelector((state: TRedux) => state.ui.toastCode);
  const toastTitleColor = useSelector((state: TRedux) => state.ui.toastTitleColor);
  const toastChildren = useSelector((state: TRedux) => state.ui.toastChildren);

  const [appState, setAppState] = React.useState<AppStateStatus>(AppState.currentState);

  const dispatch = useDispatch();
  const dispatchShowToast = React.useCallback((toast: Partial<TToast>) => dispatch(_ui.showToast(toast)), [dispatch]);
  const dispatchHideToast = React.useCallback(() => dispatch(_ui.hideToast()), [dispatch]);
  const dispatchDoneHidingToast = React.useCallback(() => dispatch(_ui.doneHidingToast()), [dispatch]);
  const dispatchClearError = React.useCallback(() => dispatch(_kappa.clearGlobalError()), [dispatch]);
  const dispatchSignOut = React.useCallback(() => dispatch(_auth.signOut()), [dispatch]);

  const onDoneClosing = React.useCallback(() => {
    dispatchDoneHidingToast();

    if (toastCode > 0) {
      dispatchClearError();
    }
  }, [toastCode]);

  const onPressSignOut = React.useCallback(() => {
    dispatchHideToast();
    dispatchSignOut();
  }, []);

  const onPressReload = async () => {
    await Updates.reloadAsync();
  };

  const checkForUpdates = async () => {
    log('Checking for updates');

    try {
      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();

        dispatchShowToast({
          toastTitle: 'Update Ready',
          toastMessage: 'The latest version has been downloaded, please reload the app to use it!',
          toastAllowClose: false,
          toastTimer: -1,
          toastCode: 426
        });
      }
    } catch (error) {
      log(error.message);
    }
  };

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    setAppState(nextAppState);
  };

  React.useEffect(() => {
    if (isShowingToast) {
      Keyboard.dismiss();
    }
  }, [isShowingToast]);

  React.useEffect(() => {
    if (globalErrorMessage !== '') {
      dispatchShowToast({
        toastTitle: 'Error',
        toastMessage: globalErrorMessage,
        toastAllowClose: globalErrorCode !== 401,
        toastTimer: globalErrorCode !== 401 ? 3000 : -1,
        toastTitleColor: theme.COLORS.PRIMARY,
        toastCode: globalErrorCode
      });
    }
  }, [globalErrorMessage, globalErrorCode, globalErrorDate]);

  React.useEffect(() => {
    if (appState === 'active') {
      checkForUpdates();
    }
  }, [appState]);

  React.useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
    };
  }, []);

  return (
    <Ghost style={styles.container}>
      {isShowingToast && (
        <Toast
          title={toastTitle}
          message={toastMessage}
          titleColor={toastTitleColor}
          timer={toastTimer}
          allowClose={toastAllowClose}
          shouldClose={isHidingToast}
          onDoneClosing={onDoneClosing}
        >
          {toastChildren !== null && toastChildren}
          {toastCode === 401 && (
            <Block style={styles.signInButton}>
              <RoundButton label="Return to Sign In" onPress={onPressSignOut} />
            </Block>
          )}
          {toastCode === 426 && (
            <Block style={styles.signInButton}>
              <RoundButton label="Reload" onPress={onPressReload} />
            </Block>
          )}
        </Toast>
      )}
    </Ghost>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  signInButton: {
    marginTop: 8,
    marginBottom: 20,
    width: 196
  }
});

export default ToastController;
