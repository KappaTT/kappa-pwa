import React from 'react';
import { StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';

import { HORIZONTAL_PADDING } from '@services/utils';
import { theme } from '@constants';
import Block from '@components/Block';
import Text from '@components/Text';

const EndCapButton: React.FC<{
  label: string;
  direction?: string;
  color?: string;
  loading?: boolean;
  disabled?: boolean;
  onPress?(): void;
}> = ({
  label,
  direction = 'right',
  color = theme.COLORS.PRIMARY,
  loading = false,
  disabled = false,
  onPress = () => {}
}) => {
  const computedOpacity = disabled ? 0.5 : 1;

  return (
    <Block
      style={[
        styles.wrapper,
        direction === 'right'
          ? {
              right: HORIZONTAL_PADDING
            }
          : direction === 'left'
          ? {
              left: HORIZONTAL_PADDING
            }
          : {}
      ]}
    >
      {loading ? (
        <ActivityIndicator style={styles.button} color={theme.COLORS.PRIMARY} />
      ) : (
        <TouchableOpacity style={styles.button} disabled={disabled} onPress={onPress}>
          <Text
            style={[
              styles.text,
              {
                opacity: computedOpacity,
                color
              }
            ]}
          >
            {label}
          </Text>
        </TouchableOpacity>
      )}
    </Block>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    height: 42
  },
  button: {
    height: 42,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  text: {
    fontFamily: 'OpenSans',
    fontSize: 15
  }
});

export default EndCapButton;
