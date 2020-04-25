import React from 'react';
import { StyleSheet, TouchableWithoutFeedback } from 'react-native';

import Block from '@components/Block';
import Text from '@components/Text';
import Icon from '@components/Icon';
import Badge from '@components/Badge';
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
  badge?: boolean;
}> = ({
  route,
  renderIcon,
  label,
  isRouteActive,
  activeTintColor,
  inactiveTintColor,
  onTabPress,
  onTabLongPress,
  user,
  badge
}) => {
  const tintColor = isRouteActive ? activeTintColor : inactiveTintColor;

  const isProfile = label === 'Profile';

  return (
    <TouchableWithoutFeedback style={styles.wrapper} onPress={onTabPress} onLongPress={onTabLongPress}>
      <Block style={styles.container}>
        <Block style={styles.content}>
          {isProfile && user && user.privileged ? (
            <Icon name="user-check" family="Feather" color={tintColor} size={28} />
          ) : (
            <React.Fragment>
              {renderIcon({ route, focused: isRouteActive, tintColor: tintColor })}
              <Badge active={badge}></Badge>
            </React.Fragment>
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
    flexGrow: 1,
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
    fontFamily: 'OpenSans-SemiBold'
  }
});

export default TabBarButton;
