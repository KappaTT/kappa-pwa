import React from 'react';
import { StyleSheet } from 'react-native';

import { Icon, DrawerItem as ArgonDrawerItem } from '../../libs/argon';
import { theme } from '../constants';

const DrawerItem: React.SFC<{
  title: string;
  focused: boolean;
  screen: string;
}> = ({ title, focused, screen }) => {
  const renderIconDefault = (family: string, name: string, size: number) => {
    return <Icon name={name} family={family} size={size} color={focused ? 'white' : theme.COLORS.ICON} />;
  };

  const renderIcon = () => {
    switch (title) {
      case 'Home':
        return renderIconDefault('MaterialCommunityIcons', 'view-dashboard', 20);
      case 'About':
        return renderIconDefault('MaterialCommunityIcons', 'map-marker', 20);
      default:
        return null;
    }
  };

  return <ArgonDrawerItem screen={screen} focused={focused} title={title} renderIcon={renderIcon} />;
};

const styles = StyleSheet.create({});

export default DrawerItem;
