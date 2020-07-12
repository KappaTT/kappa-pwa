import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { hapticImpact } from '@services/hapticService';
import { theme } from '@constants';
import Block from '@components/Block';
import Icon from '@components/Icon';
import Text from '@components/Text';

const CheckListButton: React.FC<{
  label: {
    title: string;
    subtitle?: string;
  };
  selected: boolean;
  valueColor?: string;
  disabled?: boolean;
  haptic?: boolean;
  onPress?(): void;
}> = ({ label, selected, valueColor = theme.COLORS.PRIMARY, disabled = false, haptic = true, onPress = () => {} }) => {
  const computedOpacity = disabled ? 0.5 : 1;

  return (
    <Block style={styles.wrapper}>
      <TouchableOpacity
        style={[
          styles.button,
          {
            opacity: computedOpacity
          }
        ]}
        activeOpacity={0.4}
        disabled={disabled}
        onPress={() => {
          if (haptic) {
            hapticImpact();
          }

          onPress();
        }}
      >
        <Block>
          <Text style={styles.label}>{label.title}</Text>
          {label.subtitle !== undefined && <Text style={styles.sublabel}>{label.subtitle}</Text>}
        </Block>

        <Block style={styles.activeContent}>
          {selected && <Icon family="Feather" name="check" size={24} color={valueColor} />}
        </Block>
      </TouchableOpacity>
    </Block>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    height: 48,
    borderBottomColor: theme.COLORS.LIGHT_GRAY,
    borderBottomWidth: 1
  },
  button: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  label: {
    fontFamily: 'OpenSans',
    fontSize: 15,
    color: theme.COLORS.BLACK
  },
  sublabel: {
    fontFamily: 'OpenSans',
    fontSize: 12,
    color: theme.COLORS.DARK_GRAY
  },
  activeContent: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  }
});

export default CheckListButton;
