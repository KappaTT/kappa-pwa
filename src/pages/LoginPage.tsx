import React from 'react';
import { StyleSheet, Image } from 'react-native';

import { theme, Images } from '@constants';
import { Block, Text, GoogleSignInButton } from '@components';

const LoginPage: React.FC<{
  onRequestClose(): void;
}> = ({ onRequestClose }) => {
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
          <GoogleSignInButton onPress={() => {}} />
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
    fontFamily: 'PlayfairDisplay-Medium',
    fontSize: 48
  },
  subtitle: {
    fontFamily: 'PlayfairDisplay-Medium',
    fontSize: 32
  },
  logo: {
    maxWidth: '50%',
    maxHeight: '20%',
    marginVertical: 20
  }
});

export default LoginPage;
