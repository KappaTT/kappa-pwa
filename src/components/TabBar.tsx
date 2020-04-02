import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useSafeArea } from 'react-native-safe-area-context';

import { theme } from '@constants';
import TabBarButton from '@components/TabBarButton';
import { NavigationTypes } from '@types';
import { TRedux } from '@reducers';
import { TabBarHeight } from '@services/utils';

const TabBar: React.FC<{
  renderIcon(props: any): React.ReactNode;
  getLabelText(route: any): string;
  activeTintColor: string;
  inactiveTintColor: string;
  onTabPress(route: any): void;
  onTabLongPress(route: any): void;
  navigation: NavigationTypes.ParamType;
}> = ({ renderIcon, getLabelText, activeTintColor, inactiveTintColor, onTabPress, onTabLongPress, navigation }) => {
  const { routes, index: activeRouteIndex } = navigation.state;

  const user = useSelector((state: TRedux) => state.auth.user);
  const unreadMessages = false;

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
      <View style={styles.container}>
        {routes
          .filter(route => !getLabelText({ route }).endsWith('Stack'))
          .map((route, routeIndex) => {
            const isRouteActive = routeIndex === activeRouteIndex;
            const labelText = getLabelText({ route });

            const isAnnouncements = labelText === 'Announcements';

            const onPress = () => onTabPress({ route });

            const onLongPress = () => onTabLongPress({ route });

            return (
              <TabBarButton
                key={routeIndex}
                route={route}
                renderIcon={renderIcon}
                label={labelText}
                isRouteActive={isRouteActive}
                activeTintColor={activeTintColor}
                inactiveTintColor={inactiveTintColor}
                onTabPress={onPress}
                onTabLongPress={onLongPress}
                user={user}
                badge={isAnnouncements && unreadMessages}
              />
            );
          })}
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
    paddingHorizontal: 32,
    justifyContent: 'center'
  }
});

export default TabBar;
