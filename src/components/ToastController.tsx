import React from 'react';
import { StyleSheet, Keyboard, AppState, AppStateStatus } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import * as Updates from 'expo-updates';
import { NotificationFeedbackType } from 'expo-haptics';

import { hapticNotification } from '@services/hapticService';
import { TRedux } from '@reducers';
import { TToast } from '@reducers/ui';
import { _auth, _kappa, _ui, _voting } from '@reducers/actions';
import { theme } from '@constants';
import { log } from '@services/logService';
import Block from '@components/Block';
import Ghost from '@components/Ghost';
import Toast from '@components/Toast';
import RoundButton from '@components/RoundButton';

const ToastController: React.FC = () => {
  const authorized = useSelector((state: TRedux) => state.auth.authorized);
  const kappaGlobalErrorMessage = useSelector((state: TRedux) => state.kappa.globalErrorMessage);
  const kappaGlobalErrorCode = useSelector((state: TRedux) => state.kappa.globalErrorCode);
  const kappaGlobalErrorDate = useSelector((state: TRedux) => state.kappa.globalErrorDate);
  const votingGlobalErrorMessage = useSelector((state: TRedux) => state.voting.globalErrorMessage);
  const votingGlobalErrorCode = useSelector((state: TRedux) => state.voting.globalErrorCode);
  const votingGlobalErrorDate = useSelector((state: TRedux) => state.voting.globalErrorDate);
  const isShowingToast = useSelector((state: TRedux) => state.ui.isShowingToast);
  const isHidingToast = useSelector((state: TRedux) => state.ui.isHidingToast);
  const toast = useSelector((state: TRedux) => state.ui.toast);

  const [appState, setAppState] = React.useState<AppStateStatus>(AppState.currentState);

  const dispatch = useDispatch();
  const dispatchShowToast = React.useCallback((toast: Partial<TToast>) => dispatch(_ui.showToast(toast)), [dispatch]);
  const dispatchHideToast = React.useCallback(() => dispatch(_ui.hideToast()), [dispatch]);
  const dispatchDoneHidingToast = React.useCallback(() => dispatch(_ui.doneHidingToast()), [dispatch]);
  const dispatchClearKappaError = React.useCallback(() => dispatch(_kappa.clearGlobalError()), [dispatch]);
  const dispatchClearVotingError = React.useCallback(() => dispatch(_voting.clearGlobalError()), [dispatch]);
  const dispatchSignOut = React.useCallback(() => dispatch(_auth.signOut()), [dispatch]);

  const onDoneClosing = React.useCallback(() => {
    dispatchDoneHidingToast();

    if (toast.code > 0) {
      dispatchClearKappaError();
      dispatchClearVotingError();
    }
  }, [dispatchClearKappaError, dispatchClearVotingError, dispatchDoneHidingToast, toast.code]);

  const onPressSignOut = React.useCallback(() => {
    dispatchHideToast();
    dispatchSignOut();
  }, [dispatchHideToast, dispatchSignOut]);

  const onPressReload = React.useCallback(async () => {
    await Updates.reloadAsync();
  }, []);

  const handleAppStateChange = React.useCallback((nextAppState: AppStateStatus) => {
    setAppState(nextAppState);
  }, []);

  const checkForUpdates = React.useCallback(async () => {
    log('Checking for updates');

    try {
      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();

        if (authorized) {
          dispatchShowToast({
            title: 'Update Ready',
            message: 'The latest version has been downloaded, please reload the app to use it!',
            allowClose: false,
            timer: -1,
            code: 426,
            hapticType: NotificationFeedbackType.Warning
          });
        } else {
          await Updates.reloadAsync();
        }
      }
    } catch (error) {
      log(error.message);
    }
  }, [authorized, dispatchShowToast]);

  React.useEffect(() => {
    if (kappaGlobalErrorMessage !== '' && kappaGlobalErrorDate !== null) {
      dispatchShowToast({
        title: 'Error',
        message: kappaGlobalErrorMessage,
        allowClose: kappaGlobalErrorCode !== 401,
        timer: kappaGlobalErrorCode !== 401 ? 3000 : -1,
        titleColor: theme.COLORS.PRIMARY,
        code: kappaGlobalErrorCode,
        hapticType: NotificationFeedbackType.Warning
      });
    }
  }, [dispatchShowToast, kappaGlobalErrorMessage, kappaGlobalErrorCode, kappaGlobalErrorDate]);

  React.useEffect(() => {
    if (votingGlobalErrorMessage !== '' && votingGlobalErrorDate !== null) {
      dispatchShowToast({
        title: 'Error',
        message: votingGlobalErrorMessage,
        allowClose: votingGlobalErrorCode !== 401,
        timer: votingGlobalErrorCode !== 401 ? 3000 : -1,
        titleColor: theme.COLORS.PRIMARY,
        code: votingGlobalErrorCode,
        hapticType: NotificationFeedbackType.Warning
      });
    }
  }, [
    dispatchShowToast,
    kappaGlobalErrorMessage,
    kappaGlobalErrorCode,
    votingGlobalErrorMessage,
    votingGlobalErrorCode,
    votingGlobalErrorDate
  ]);

  React.useEffect(() => {
    if (appState === 'active') {
      checkForUpdates();
    }
  }, [appState, checkForUpdates]);

  React.useEffect(() => {
    if (isShowingToast) {
      Keyboard.dismiss();
    }
  }, [isShowingToast]);

  React.useEffect(() => {
    if (toast.hapticType !== null) {
      hapticNotification(toast.hapticType);
    }
  }, [toast.hapticType]);

  React.useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
    };
  }, [handleAppStateChange]);

  return (
    <Ghost style={styles.container}>
      {isShowingToast && (
        <Toast toast={toast} shouldClose={isHidingToast} onDoneClosing={onDoneClosing}>
          {toast.children !== null && toast.children}
          {toast.code === 401 && (
            <Block style={styles.signInButton}>
              <RoundButton label="Return to Sign In" onPress={onPressSignOut} />
            </Block>
          )}
          {toast.code === 426 && (
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
