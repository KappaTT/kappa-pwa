import React from 'react';
import { StyleSheet, Image, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import { TRedux } from '@reducers';
import { _auth } from '@reducers/actions';
import { theme, Images } from '@constants';
import { Block, Text, GoogleSignInButton } from '@components';

const LoginPage: React.FC<{}> = ({}) => {
  const authorized = useSelector((state: TRedux) => state.auth.authorized);
  const isAuthenticating = useSelector((state: TRedux) => state.auth.isAuthenticating);
  const isSigningInWithGoogle = useSelector((state: TRedux) => state.auth.isSigningInWithGoogle);
  const signInWithGoogleErrorMessage = useSelector((state: TRedux) => state.auth.signInWithGoogleErrorMessage);
  const signInErrorMessage = useSelector((state: TRedux) => state.auth.signInErrorMessage);

  const dispatch = useDispatch();
  const dispatchHideModal = React.useCallback(() => dispatch(_auth.hideModal()), [dispatch]);
  const dispatchSignInWithGoogle = React.useCallback(() => dispatch(_auth.signInWithGoogle()), [dispatch]);

  React.useEffect(() => {
    if (authorized) {
      dispatchHideModal();
    }
  }, [authorized]);

  React.useEffect(() => {
    if (signInWithGoogleErrorMessage) {
      Alert.alert('Could not sign in!', signInWithGoogleErrorMessage);
    }
  }, [signInWithGoogleErrorMessage]);

  React.useEffect(() => {
    if (signInErrorMessage) {
      Alert.alert('Could not sign in!', signInErrorMessage);
    }
  }, [signInErrorMessage]);

  const renderBackground = () => {
    return <Block style={styles.bg} />;
  };

  const renderContent = () => {
    return (
      <Block style={styles.fg}>
        <Block style={styles.content}>
          <Text style={styles.title}>KAPPA</Text>
          <Image style={styles.logo} source={Images.Kappa} resizeMode="contain" />
          <Text style={styles.subtitle}>THETA TAU</Text>
        </Block>

        <Block style={styles.bottomArea}>
          <GoogleSignInButton loading={isSigningInWithGoogle || isAuthenticating} onPress={dispatchSignInWithGoogle} />
        </Block>
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
    flex: 1,
    backgroundColor: theme.COLORS.WHITE
  },
  fg: {
    flex: 1
  },
  content: {
    height: '80%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  bottomArea: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  title: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 48
  },
  subtitle: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 32
  },
  logo: {
    maxWidth: '50%',
    maxHeight: '20%',
    marginVertical: 20
  }
});

export default LoginPage;
