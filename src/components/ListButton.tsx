import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { theme } from '@constants';
import Block from '@components/Block';
import Icon from '@components/Icon';
import Text from '@components/Text';

const ListButton: React.FC<{
  keyText: string;
  valueText: string;
  valueColor?: string;
  disabled?: boolean;
  onPress?(): void;
}> = ({ keyText, valueText = '', valueColor = theme.COLORS.PRIMARY, disabled = false, onPress = () => {} }) => {
  const computedOpacity = disabled ? 0.5 : 1;

  return (
    <Block style={styles.wrapper}>
      <TouchableOpacity style={styles.button} disabled={disabled} onPress={onPress}>
        <Text
          style={[
            styles.keyText,
            {
              opacity: computedOpacity
            }
          ]}
        >
          {keyText}
        </Text>

        <Block style={styles.activeContent}>
          <Text
            style={[
              styles.valueText,
              {
                color: valueColor,
                opacity: computedOpacity
              }
            ]}
          >
            {valueText}
          </Text>

          <Icon
            style={{
              opacity: computedOpacity
            }}
            family="MaterialIcons"
            name="keyboard-arrow-right"
            size={24}
            color={valueColor}
          />
        </Block>
      </TouchableOpacity>
    </Block>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    height: 44,
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
  keyText: {
    fontFamily: 'OpenSans',
    fontSize: 15,
    color: theme.COLORS.BLACK
  },
  activeContent: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  valueText: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 12,
    textTransform: 'uppercase'
  }
});

export default ListButton;
