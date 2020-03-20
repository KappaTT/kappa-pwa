import React from 'react';
import { StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import { TRedux } from '@reducers';
import { _auth } from '@reducers/actions';
import { theme } from '@constants';
import { Block, Text } from '@components';

const LoginPage: React.FC<{
  onRequestClose(): void;
}> = ({ onRequestClose }) => {
  const authorized = useSelector((state: TRedux) => state.auth.authorized);

  const dispatch = useDispatch();

  const renderBackground = () => {
    return <Block style={styles.bg} />;
  };

  const renderContent = () => {
    return (
      <Block style={styles.fg}>
        <Text>Let's finish setting up</Text>
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
    height: '60%',
    bottom: 0,
    backgroundColor: theme.COLORS.WHITE
  },
  fg: {
    flex: 1
  }
});

export default LoginPage;
