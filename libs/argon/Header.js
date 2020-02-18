import React from 'react';
import { withNavigation } from 'react-navigation';
import { TouchableOpacity, StyleSheet, Platform, Dimensions } from 'react-native';
import { Button, Block, NavBar, Text, theme } from '../galio';

import Icon from './Icon';
import Input from './Input';
import Tabs from './Tabs';
import argonTheme from '../../src/constants/Theme';

const { height, width } = Dimensions.get('window');
const iPhoneX = () => Platform.OS === 'ios' && (height === 812 || width === 812 || height === 896 || width === 896);

class Header extends React.Component {
  handleLeftPress = () => {
    const { back, navigation } = this.props;
    return back ? navigation.goBack() : navigation.openDrawer();
  };

  render() {
    const {
      back,
      title,
      white,
      transparent,
      bgColor,
      iconColor,
      titleColor,
      navigation,
      renderRight,
      renderHeader,
      ...props
    } = this.props;
    const { routeName } = navigation.state;
    const noShadow = ['Search', 'Categories', 'Deals', 'Pro', 'Profile'].includes(routeName);
    const headerStyles = [!noShadow ? styles.shadow : null, transparent ? { backgroundColor: 'rgba(0,0,0,0)' } : null];

    const navbarStyles = [styles.navbar, bgColor && { backgroundColor: bgColor }];

    return (
      <Block style={headerStyles}>
        <NavBar
          back={back}
          title={title}
          style={navbarStyles}
          transparent={transparent}
          right={renderRight()}
          rightStyle={{ justifyContent: 'flex-end', alignItems: 'center' }}
          left={
            <Icon
              name={back ? 'nav-left' : 'menu-8'}
              family="ArgonExtra"
              size={14}
              onPress={this.handleLeftPress}
              color={iconColor || argonTheme.COLORS.ICON}
            />
          }
          leftStyle={{ paddingVertical: 12, flex: 0.2 }}
          titleStyle={[
            styles.title,
            { color: argonTheme.COLORS[white ? 'WHITE' : 'HEADER'] },
            titleColor && { color: titleColor }
          ]}
          {...props}
        />
        {renderHeader()}
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    width: '100%',
    fontSize: 16,
    fontWeight: 'bold'
  },
  navbar: {
    paddingVertical: 0,
    paddingBottom: theme.SIZES.BASE * 1.5,
    paddingTop: iPhoneX ? theme.SIZES.BASE * 4 : theme.SIZES.BASE,
    zIndex: 5
  },
  shadow: {
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.2,
    elevation: 3
  }
});

export default withNavigation(Header);
