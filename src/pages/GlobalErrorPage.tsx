import React from 'react';
import { StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useSafeArea } from 'react-native-safe-area-context';

import { TRedux } from '@reducers';
import { _auth, _kappa } from '@reducers/actions';
import { theme } from '@constants';
import { Block, Text, Icon, RoundButton } from '@components';
import { TabBarHeight } from '@services/utils';

const GlobalErrorPage: React.FC<{ errorMessage: string; errorCode: number }> = ({ errorMessage, errorCode }) => {
  const authorized = useSelector((state: TRedux) => state.auth.authorized);

  const dispatch = useDispatch();
  const dispatchClearError = React.useCallback(() => dispatch(_kappa.clearGlobalError()), [dispatch]);
  const dispatchSignOut = React.useCallback(() => dispatch(_auth.signOut()), [dispatch]);

  const insets = useSafeArea();

  const requestClear = React.useCallback(() => {
    if (errorCode !== 401) {
      dispatchClearError();
    }
  }, [errorCode]);

  const onPressSignOut = React.useCallback(() => {
    dispatchClearError();
    dispatchSignOut();
  }, []);

  React.useEffect(() => {
    if (errorMessage !== '' && errorCode !== 401) {
      setTimeout(dispatchClearError, 3000);
    }
  }, [errorMessage]);

  const renderBackground = () => {
    return (
      <TouchableWithoutFeedback onPress={requestClear}>
        <Block style={styles.bg} />
      </TouchableWithoutFeedback>
    );
  };

  const renderContent = () => {
    return (
      <Block
        style={[
          styles.fg,
          {
            minHeight: TabBarHeight + insets.bottom,
            paddingBottom: insets.bottom
          }
        ]}
      >
        <Block style={styles.messageContainer}>
          <Icon family="Feather" name="alert-circle" color={theme.COLORS.ERROR} />
          <Text style={styles.message}>{errorMessage}</Text>
        </Block>

        {errorCode === 401 && authorized && (
          <Block style={styles.signInButton}>
            <RoundButton label="Return to Sign In" onPress={onPressSignOut} />
          </Block>
        )}
      </Block>
    );
  };

  return (
    <Block flex>
      {renderBackground()}
      {renderContent()}
    </Block>
  );
};

const styles = StyleSheet.create({
  bg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.4)'
  },
  fg: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.COLORS.WHITE,
    borderTopColor: theme.COLORS.LIGHT_BORDER,
    borderTopWidth: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  messageContainer: {
    marginTop: 8,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  message: {
    marginLeft: 4,
    fontFamily: 'OpenSans-SemiBold',
    textTransform: 'capitalize',
    color: theme.COLORS.ERROR
  },
  signInButton: {
    marginTop: 8,
    width: 196
  }
});

export default GlobalErrorPage;
