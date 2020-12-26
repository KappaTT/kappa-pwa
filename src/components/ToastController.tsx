import React from 'react';
import { StyleSheet, Keyboard } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import { TRedux } from '@reducers';
import { TToast } from '@reducers/ui';
import { _auth, _kappa, _ui, _voting } from '@reducers/actions';
import { theme } from '@constants';
import Block from '@components/Block';
import Ghost from '@components/Ghost';
import Toast from '@components/Toast';
import RoundButton from '@components/RoundButton';

const ToastController: React.FC = () => {
  const kappaGlobalErrorMessage = useSelector((state: TRedux) => state.kappa.globalErrorMessage);
  const kappaGlobalErrorCode = useSelector((state: TRedux) => state.kappa.globalErrorCode);
  const kappaGlobalErrorDate = useSelector((state: TRedux) => state.kappa.globalErrorDate);
  const votingGlobalErrorMessage = useSelector((state: TRedux) => state.voting.globalErrorMessage);
  const votingGlobalErrorCode = useSelector((state: TRedux) => state.voting.globalErrorCode);
  const votingGlobalErrorDate = useSelector((state: TRedux) => state.voting.globalErrorDate);
  const isShowingToast = useSelector((state: TRedux) => state.ui.isShowingToast);
  const isHidingToast = useSelector((state: TRedux) => state.ui.isHidingToast);
  const toast = useSelector((state: TRedux) => state.ui.toast);

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

  React.useEffect(() => {
    // Detect if a new kappa error should be displayed
    if (kappaGlobalErrorMessage !== '' && kappaGlobalErrorDate !== null) {
      dispatchShowToast({
        title: 'Error',
        message: kappaGlobalErrorMessage,
        allowClose: kappaGlobalErrorCode !== 401,
        timer: kappaGlobalErrorCode !== 401 ? 3000 : -1,
        titleColor: theme.COLORS.PRIMARY,
        code: kappaGlobalErrorCode
      });
    }
  }, [dispatchShowToast, kappaGlobalErrorMessage, kappaGlobalErrorCode, kappaGlobalErrorDate]);

  React.useEffect(() => {
    // Detect if a new voting error should be displayed
    if (votingGlobalErrorMessage !== '' && votingGlobalErrorDate !== null) {
      dispatchShowToast({
        title: 'Error',
        message: votingGlobalErrorMessage,
        allowClose: votingGlobalErrorCode !== 401,
        timer: votingGlobalErrorCode !== 401 ? 3000 : -1,
        titleColor: theme.COLORS.PRIMARY,
        code: votingGlobalErrorCode
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
    // Dismiss keyboard if a toast opens
    if (isShowingToast) {
      Keyboard.dismiss();
    }
  }, [isShowingToast]);

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
