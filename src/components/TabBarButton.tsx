import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';

import { Block } from '@galio';
import theme from '@constants/Theme';
import IconBadge from '@components/IconBadge';

const TabBarButton: React.FC<{
  route: any;
  renderIcon(props: any): React.ReactNode;
  label: string;
  isRouteActive: boolean;
  activeTintColor: string;
  inactiveTintColor: string;
  locked?: boolean;
  onTabPress(): void;
  onTabLongPress(): void;
}> = ({
  route,
  renderIcon,
  label,
  isRouteActive,
  activeTintColor,
  inactiveTintColor,
  locked = false,
  onTabPress,
  onTabLongPress
}) => {
  const containerStyle = isRouteActive ? styles.focusedContainer : styles.container;
  const tintColor = isRouteActive ? activeTintColor : inactiveTintColor;

  return (
    <TouchableOpacity style={styles.wrapper} onPress={onTabPress} onLongPress={onTabLongPress}>
      <Block style={containerStyle}>
        <Block style={styles.content}>
          <Block style={styles.iconWrapper}>
            {renderIcon({ route, focused: isRouteActive, tintColor: tintColor })}
            {locked && (
              <IconBadge
                iconColor={tintColor}
                bgColor={theme.COLORS.WHITE}
                active={true}
                fab={false}
                name="lock-outline"
                family="MaterialIcons"
              />
            )}
          </Block>
          {isRouteActive && <Text style={[styles.label, { color: tintColor }]}>{label}</Text>}
        </Block>
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
  focusedContainer: {
    backgroundColor: '#613CE820',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 24,
    shadowColor: theme.COLORS.ROYALTY,
    shadowOpacity: 0.95,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2
  },
  container: {
    paddingVertical: 8
  },
  content: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  iconWrapper: {
    paddingRight: 6
  },
  label: {
    fontFamily: 'Montserrat-SemiBold'
  }
});

export default TabBarButton;
