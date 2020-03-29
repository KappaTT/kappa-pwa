import React from 'react';
import { StyleSheet, TouchableWithoutFeedback } from 'react-native';

import Block from '@components/Block';
import Text from '@components/Text';
import Icon from '@components/Icon';
import { theme } from '@constants';
import { TUser } from '@backend/auth';

const TabBarButton: React.FC<{
  route: any;
  renderIcon(props: any): React.ReactNode;
  label: string;
  isRouteActive: boolean;
  activeTintColor: string;
  inactiveTintColor: string;
  onTabPress(): void;
  onTabLongPress(): void;
  user?: TUser;
}> = ({
  route,
  renderIcon,
  label,
  isRouteActive,
  activeTintColor,
  inactiveTintColor,
  onTabPress,
  onTabLongPress,
  user
}) => {
  const tintColor = isRouteActive ? activeTintColor : inactiveTintColor;

  const isProfile = label === 'Profile';

  return (
    <TouchableWithoutFeedback style={styles.wrapper} onPress={onTabPress} onLongPress={onTabLongPress}>
      <Block style={styles.container}>
        <Block style={styles.content}>
          {isProfile && user && user.privileged ? (
            <Icon name="user-check" family="Feather" color={tintColor} size={24} />
          ) : (
            renderIcon({ route, focused: isRouteActive, tintColor: tintColor })
          )}
        </Block>
      </Block>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    paddingVertical: 8,
    width: 56,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
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
