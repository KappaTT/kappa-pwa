import React from 'react';
import { StyleSheet } from 'react-native';

import { theme } from '../constants';
import Badge from './Badge';
import Block from './Block';
import Icon from './Icon';

const IconBadge: React.SFC<{
  active: boolean;
  fab?: boolean;
  name: string;
  family: string;
  size?: number;
  bgColor?: string;
  iconColor?: string;
}> = ({
  active,
  fab = false,
  name,
  family,
  size = 12,
  bgColor = theme.COLORS.ROYALTY,
  iconColor = theme.COLORS.WHITE
}) => {
  return (
    <Badge active={active} fab={fab}>
      <Block style={[styles.bg, { backgroundColor: bgColor }]}>
        <Icon style={styles.icon} family={family} name={name} size={size} color={iconColor} />
      </Block>
    </Badge>
  );
};

const styles = StyleSheet.create({
  bg: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 4, height: -4 },
    shadowRadius: 2,
    shadowColor: theme.COLORS.BLACK,
    shadowOpacity: 0.1,
    elevation: 2
  },
  icon: {
    position: 'absolute',
    right: 1
  }
});

export default IconBadge;
