import React from 'react';
import { StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';

import { hapticImpact } from '@services/hapticService';
import { HORIZONTAL_PADDING } from '@services/utils';
import { theme } from '@constants';
import Block from '@components/Block';
import Icon from '@components/Icon';

const ButtonWidth = 54;

const EndCapIconButton: React.FC<{
  iconFamily: string;
  iconName: string;
  size?: number;
  position?: number;
  direction?: string;
  color?: string;
  loading?: boolean;
  disabled?: boolean;
  haptic?: boolean;
  onPress?(): void;
}> = ({
  iconFamily,
  iconName,
  size = 24,
  position = 0,
  direction = 'right',
  color = theme.COLORS.PRIMARY,
  loading = false,
  disabled = false,
  haptic = true,
  onPress = () => {}
}) => {
  const computedOpacity = disabled ? 0.5 : 1;

  return (
    <Block
      style={[
        styles.wrapper,
        direction === 'right'
          ? {
              right: HORIZONTAL_PADDING + (size + 12) * position
            }
          : direction === 'left'
          ? {
              left: HORIZONTAL_PADDING
            }
          : {}
      ]}
    >
      {loading ? (
        <ActivityIndicator style={styles.button} />
      ) : (
        <TouchableOpacity
          style={styles.button}
          disabled={disabled}
          onPress={() => {
            if (haptic) {
              hapticImpact();
            }

            onPress();
          }}
        >
          <Icon
            style={{
              opacity: computedOpacity
            }}
            family={iconFamily}
            name={iconName}
            size={size}
            color={color}
          />
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

export default EndCapIconButton;
