import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { theme } from '@galio';
import Icon from '@components/Icon';

const CloseButton: React.FC<{
  onPress?(): void;
}> = ({ onPress = () => {} }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button} activeOpacity={0.8}>
      <Icon family="FontAwesome" name="close" size={18} color={theme.COLORS.WHITE} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: `${theme.COLORS.BLACK}40`,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default CloseButton;
