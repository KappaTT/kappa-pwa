import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useSafeArea } from 'react-native-safe-area-context';

import { theme } from '@constants';
import TabBarButton from '@components/TabBarButton';
import { NavigationTypes } from '@types';

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
    height: 48,
    paddingHorizontal: 24
  }
});

export default TabBar;
