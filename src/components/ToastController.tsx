import React from 'react';
import { StyleSheet, Keyboard } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import { TRedux } from '@reducers';
import { TToast } from '@reducers/ui';
import { _auth, _kappa, _ui } from '@reducers/actions';
import { theme } from '@constants';
import Block from '@components/Block';
import Ghost from '@components/Ghost';
import Toast from '@components/Toast';
import RoundButton from '@components/RoundButton';

const ToastController: React.FC<{}> = ({}) => {
  const authorized = useSelector((state: TRedux) => state.auth.authorized);
  const globalErrorMessage = useSelector((state: TRedux) => state.kappa.globalErrorMessage);
  const globalErrorCode = useSelector((state: TRedux) => state.kappa.globalErrorCode);
  const isShowingToast = useSelector((state: TRedux) => state.ui.isShowingToast);
  const isHidingToast = useSelector((state: TRedux) => state.ui.isHidingToast);
  const toastTitle = useSelector((state: TRedux) => state.ui.toastTitle);
  const toastMessage = useSelector((state: TRedux) => state.ui.toastMessage);
  const toastAllowClose = useSelector((state: TRedux) => state.ui.toastAllowClose);
  const toastTimer = useSelector((state: TRedux) => state.ui.toastTimer);
  const toastCode = useSelector((state: TRedux) => state.ui.toastCode);
  const toastChildren = useSelector((state: TRedux) => state.ui.toastChildren);

  const [storedTitle, setStoredTitle] = React.useState<string>('');
  const [storedMessage, setStoredMessage] = React.useState<string>('');

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

  const handleTimer = React.useCallback(() => {
    if (storedTitle === toastTitle && storedMessage === toastMessage) {
      dispatchHideToast();
    }
  }, [storedTitle, storedMessage, toastTitle, toastMessage]);

  const onPressSignOut = React.useCallback(() => {
    dispatchHideToast();
    dispatchSignOut();
  }, []);

  React.useEffect(() => {
    if (globalErrorMessage !== '') {
      dispatchShowToast({
        toastTitle: 'Error',
        toastMessage: globalErrorMessage,
        toastAllowClose: globalErrorCode !== 401,
        toastTimer: globalErrorCode !== 401 ? 3000 : -1,
        toastCode: globalErrorCode
      });
    }
  }, [globalErrorMessage, globalErrorCode]);

  React.useEffect(() => {
    if (isShowingToast) {
      Keyboard.dismiss();

      if (toastTimer > 0) {
        setStoredTitle(toastTitle);
        setStoredMessage(toastMessage);
        setTimeout(handleTimer, toastTimer);
      }
    }
  }, [isShowingToast, toastTimer, toastTitle, toastMessage, storedTitle, storedMessage]);

  return (
    <Ghost style={styles.container}>
      {isShowingToast && (
        <Toast
          title={toastTitle}
          message={toastMessage}
          allowClose={toastAllowClose}
          shouldClose={isHidingToast}
          onDoneClosing={onDoneClosing}
        >
          {toastChildren !== null && toastChildren}
          {toastCode === 401 && authorized && (
            <Block style={styles.signInButton}>
              <RoundButton label="Return to Sign In" onPress={onPressSignOut} />
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
    width: 196
  }
});

export default ToastController;
