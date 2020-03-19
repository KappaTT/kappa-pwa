import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';

import { theme } from '@constants';
import { Block, Text } from '@components';

const LoginPage: React.FC<{
  onRequestClose(): void;
}> = ({ onRequestClose }) => {
  const renderBackground = () => {
    return <Block style={styles.bg} />;
  };

  const renderContent = () => {
    return (
      <Block flex middle>
        <Text>Login</Text>
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
  }
});

export default LoginPage;
