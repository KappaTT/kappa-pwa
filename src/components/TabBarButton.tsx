import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';

import Block from '@components/Block';
import { theme } from '@constants';

const TabBarButton: React.FC<{
  route: any;
  renderIcon(props: any): React.ReactNode;
  label: string;
  isRouteActive: boolean;
  activeTintColor: string;
  inactiveTintColor: string;
  onTabPress(): void;
  onTabLongPress(): void;
}> = ({ route, renderIcon, label, isRouteActive, activeTintColor, inactiveTintColor, onTabPress, onTabLongPress }) => {
  const tintColor = isRouteActive ? activeTintColor : inactiveTintColor;

  return (
    <TouchableOpacity style={styles.wrapper} onPress={onTabPress} onLongPress={onTabLongPress}>
      <Block style={styles.container}>
        <Block style={styles.content}>{renderIcon({ route, focused: isRouteActive, tintColor: tintColor })}</Block>
      </Block>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    paddingVertical: 8
  },
  content: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  label: {
    fontFamily: 'Montserrat-SemiBold'
  }
});

export default TabBarButton;
