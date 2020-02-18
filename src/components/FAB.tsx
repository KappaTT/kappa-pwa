import React from 'react';
import { StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';

import { theme } from '../constants';
import Block from './Block';
import Icon from './Icon';
import Badge from './Badge';
import IconBadge from './IconBadge';

const FAB: React.SFC<{
  iconFamily: string;
  iconName: string;
  iconProps?: any;
  iconColor?: string;
  bgColor?: string;
  size?: number;
  badge?: boolean;
  style?: ViewStyle;
  onPress(): void;
}> = ({
  iconFamily,
  iconName,
  iconProps,
  iconColor = theme.COLORS.WHITE,
  bgColor = theme.COLORS.ROYALTY,
  size = 56,
  badge = false,
  style,
  onPress
}) => {
  return (
    <Block style={style}>
      <Block style={{ width: size, height: size }}>
        <TouchableOpacity onPress={onPress} style={styles.button} activeOpacity={0.8}>
          <Block style={{ backgroundColor: bgColor, borderRadius: 28, flex: 1 }}>
            <Block style={styles.container}>
              <Icon family={iconFamily} name={iconName} color={iconColor} size={size / 2} rest={iconProps} />
            </Block>
          </Block>
        </TouchableOpacity>

        <IconBadge
          iconColor={iconColor}
          bgColor={bgColor}
          active={badge}
          fab={true}
          name="lock-outline"
          family="MaterialIcons"
        />
      </Block>
    </Block>
  );
};

const styles = StyleSheet.create({
  button: {
    flex: 1,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 16,
    shadowColor: theme.COLORS.BLACK,
    shadowOpacity: 0.4,
    elevation: 2
  },
  container: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default FAB;
