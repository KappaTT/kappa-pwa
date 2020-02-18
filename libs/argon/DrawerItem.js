import React from 'react';
import { StyleSheet } from 'react-native';
import { Block, Text, theme } from '../galio';

import Icon from './Icon';
import argonTheme from '../../src/constants/Theme';

class DrawerItem extends React.Component {
  render() {
    const { focused, title, renderIcon } = this.props;

    const containerStyles = [styles.defaultStyle, focused ? [styles.activeStyle, styles.shadow] : null];

    return (
      <Block flex row style={containerStyles}>
        <Block middle flex={0.1} style={{ marginRight: 5 }}>
          {renderIcon()}
        </Block>
        <Block row center flex={0.9}>
          <Text size={15} bold={focused ? true : false} color={focused ? 'white' : 'rgba(0,0,0,0.5)'}>
            {title}
          </Text>
        </Block>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  defaultStyle: {
    marginHorizontal: 14,
    paddingVertical: 15,
    paddingHorizontal: 14
  },
  activeStyle: {
    backgroundColor: argonTheme.COLORS.ACTIVE,
    borderRadius: 4
  },
  shadow: {
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowRadius: 8,
    shadowOpacity: 0.1
  }
});

export default DrawerItem;
