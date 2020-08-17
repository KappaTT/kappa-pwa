import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useSafeArea } from 'react-native-safe-area-context';

import { theme } from '@constants';
import TabBarButton from '@components/TabBarButton';
import { TRedux } from '@reducers';
import { TabBarHeight } from '@services/utils';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import PopupButton from '@components/PopupButton';
import Icon from '@components/Icon';

const TabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
  activeTintColor,
  inactiveTintColor
}) => {
  const focusedOptions = descriptors[state.routes[state.index].key].options;

  const user = useSelector((state: TRedux) => state.auth.user);
  const pendingExcusesArray = useSelector((state: TRedux) => state.kappa.pendingExcusesArray);

  const unreadMessages = React.useMemo(() => {
    if (pendingExcusesArray.length > 0) return true;

    return false;
  }, [pendingExcusesArray]);

  const insets = useSafeArea();

  return (
    <View
      style={[
        styles.containerWrapper,
        {
          paddingBottom: insets.bottom
        }
      ]}
    >
      <View style={[styles.container, { paddingRight: 0 }]}>
        {state.routes.map((route, routeIndex) => {
          const { options } = descriptors[route.key];

          const isRouteActive = routeIndex === state.index;
          const labelText = options.title || route.name;

          const isMessages = labelText === 'Messages';

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true
            });

            if (!isRouteActive && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key
            });
          };

          return (
            <TabBarButton
              key={routeIndex}
              route={route}
              renderIcon={options.tabBarIcon}
              label={labelText}
              isRouteActive={isRouteActive}
              activeTintColor={activeTintColor}
              inactiveTintColor={inactiveTintColor}
              onTabPress={onPress}
              onTabLongPress={onLongPress}
              user={user}
              badge={isMessages && unreadMessages}
            />
          );
        })}

        <PopupButton
          label="Vote"
          icon={<Icon family="MaterialIcons" name="open-in-new" color={theme.COLORS.WHITE} size={20} />}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerWrapper: {
    backgroundColor: theme.COLORS.WHITE
  },
  container: {
    flexDirection: 'row',
    height: TabBarHeight,
    paddingLeft: 32,
    paddingRight: 32,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default TabBar;
