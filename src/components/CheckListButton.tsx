import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { theme } from '@constants';
import Block from '@components/Block';
import Icon from '@components/Icon';
import Text from '@components/Text';

const CheckListButton: React.FC<{
  label: string;
  selected: boolean;
  valueColor?: string;
  disabled?: boolean;
  onPress?(): void;
}> = ({ label, selected, valueColor = theme.COLORS.PRIMARY, disabled = false, onPress = () => {} }) => {
  const computedOpacity = disabled ? 0.5 : 1;

  return (
    <Block style={styles.wrapper}>
      <TouchableOpacity style={styles.button} disabled={disabled} onPress={onPress}>
        <Text
          style={[
            styles.label,
            {
              opacity: computedOpacity
            }
          ]}
        >
          {label}
        </Text>

        <Block style={styles.activeContent}>
          {selected && (
            <Icon
              style={{
                opacity: computedOpacity
              }}
              family="Feather"
              name="check"
              size={24}
              color={valueColor}
            />
          )}
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
  activeContent: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  }
});

export default CheckListButton;
