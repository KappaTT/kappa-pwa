import React from 'react';
import { StyleSheet } from 'react-native';

import { theme } from '@constants';
import Block from '@components/Block';
import Text from '@components/Text';
import Button from '@components/Button';

const RoundButton: React.FC<{
  color?: string;
  label: string;
  icon?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  right?: boolean;
  alt?: boolean;
  onPress?(): void;
}> = ({
  color = theme.COLORS.PRIMARY,
  label,
  icon,
  loading = false,
  disabled = false,
  right = false,
  alt = false,
  onPress = () => {}
}) => {
  const buttonStyle = StyleSheet.flatten([
    styles.button,
    alt
      ? {
          backgroundColor: theme.COLORS.WHITE,
          borderWidth: 1,
          borderColor: color
        }
      : {
          backgroundColor: color
        }
  ]);

  return (
    <Button
      style={buttonStyle}
      round
      shadowless
      disabled={disabled}
      onPress={() => {
        !loading && onPress();
      }}
      loading={loading}
    >
      <Block style={styles.buttonContent}>
        {!right && icon}

        <Text
          style={[
            styles.buttonText,
            icon && styles.buttonTextWithIcon,
            alt
              ? {
                  color: color
                }
              : {
                  color: theme.COLORS.WHITE
                }
          ]}
        >
          {label}
        </Text>

        {right && icon}
      </Block>
    </Button>
  );
};

const styles = StyleSheet.create({
  button: {
    marginBottom: 0,
    width: '100%'
  },
  buttonContent: {
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  buttonText: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 18
  },
  buttonTextWithIcon: {
    marginHorizontal: 10
  }
});

export default RoundButton;
