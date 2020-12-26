import React from 'react';
import { StyleSheet, TouchableWithoutFeedback } from 'react-native';

import { TUser } from '@backend/auth';
import Block from '@components/Block';
import Icon from '@components/Icon';
import Badge from '@components/Badge';
import TextBadge from '@components/TextBadge';

const TabBarButton: React.FC<{
  route: any;
  renderIcon({ focused, color, size }: { focused: boolean; color: string; size: number }): React.ReactNode;
  label: string;
  isRouteActive: boolean;
  activeTintColor: string;
  inactiveTintColor: string;
  onTabPress(): void;
  onTabLongPress(): void;
  user?: TUser;
  badge?: boolean;
  badgeText?: string;
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
  badge,
  badgeText = ''
}) => {
  const tintColor = React.useMemo(() => (isRouteActive ? activeTintColor : inactiveTintColor), [
    activeTintColor,
    inactiveTintColor,
    isRouteActive
  ]);

  const isProfile = React.useMemo(() => label === 'Profile', [label]);

  return (
    <TouchableWithoutFeedback style={styles.wrapper} onPress={onTabPress} onLongPress={onTabLongPress}>
      <Block style={styles.container}>
        <Block style={styles.content}>
          {isProfile && user && user.privileged ? (
            <Icon name="user-check" family="Feather" color={tintColor} size={28} />
          ) : (
            <React.Fragment>
              {renderIcon({ focused: isRouteActive, color: tintColor, size: 28 })}
              {badgeText === '' ? <Badge active={badge} /> : <TextBadge active={badge} label={badgeText} />}
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
