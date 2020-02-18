import React from 'react';
import { StyleSheet } from 'react-native';

import { theme } from '../constants';

import Block from './Block';
import Button from './Button';
import Text from './Text';

const RoundButton: React.SFC<{
  label: string;
  icon?: React.ReactNode;
  loading?: boolean;
  onPress?(): void;
}> = ({ label, icon, loading = false, onPress = () => {} }) => {
  return (
    <Button
      style={styles.button}
      round
      onPress={() => {
        !loading && onPress();
      }}
      loading={loading}
    >
      <Block style={styles.buttonContent}>
        {icon}

        <Text style={icon ? styles.buttonTextWithIcon : styles.buttonText}>{label}</Text>
      </Block>
    </Button>
  );
};

const styles = StyleSheet.create({
  button: {
    marginBottom: 0,
    width: '100%',
    backgroundColor: theme.COLORS.ROYALTY,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 16,
    shadowColor: theme.COLORS.ROYALTY,
    shadowOpacity: 0.6,
    elevation: 2
  },
  buttonContent: {
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  buttonTextWithIcon: {
    marginLeft: 10,
    fontFamily: 'OpenSans',
    fontSize: 18,
    color: theme.COLORS.WHITE
  },
  buttonText: {
    fontFamily: 'OpenSans',
    fontSize: 18,
    color: theme.COLORS.WHITE
  }
});

export default RoundButton;
