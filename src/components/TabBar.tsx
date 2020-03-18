import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useSafeArea } from 'react-native-safe-area-context';

import { TRedux } from '@reducers';
import { _auth, _map } from '@reducers/actions';

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

  const dispatch = useDispatch();

  // redux selectors
  const authorized = useSelector((state: TRedux) => state.auth.authorized);
  const createPostVisible = useSelector((state: TRedux) => state.map.createPostVisible);

  // redux dispatch
  const dispatchShowLoginModal = React.useCallback(() => dispatch(_auth.showModal()), [dispatch]);
  const dispatchShowCreatePost = React.useCallback(() => dispatch(_map.showCreatePost()), [dispatch]);
  const dispatchHideCreatePost = React.useCallback(() => dispatch(_map.hideCreatePost()), [dispatch]);

  const insets = useSafeArea();

  return (
    <View
      style={[
        styles.floatingContainer,
        {
          marginBottom: insets.bottom / 2
        }
      ]}
    >
      {routes
        .filter(route => !getLabelText({ route }).endsWith('Stack'))
        .map((route, routeIndex) => {
          const isRouteActive = routeIndex === activeRouteIndex;
          const labelText = getLabelText({ route });
          const isMap = labelText === 'Map';
          const isPost = labelText === 'Post';

          const onPress = () => {
            if (isPost) {
              if (!authorized) {
                dispatchShowLoginModal();
                return;
              }

              if (!createPostVisible) {
                dispatchShowCreatePost();
              }
            } else {
              if (createPostVisible) {
                dispatchHideCreatePost();
              }

              onTabPress({ route });
            }
          };

          const onLongPress = () => onTabLongPress({ route });

          const isActive = (isRouteActive && !createPostVisible) || (isPost && createPostVisible);

          return (
            <TabBarButton
              key={routeIndex}
              route={route}
              renderIcon={renderIcon}
              label={labelText}
              isRouteActive={isActive}
              activeTintColor={activeTintColor}
              inactiveTintColor={inactiveTintColor}
              onTabPress={onPress}
              onTabLongPress={onLongPress}
              locked={isPost && !authorized}
            />
          );
        })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 68,
    paddingHorizontal: 24,
    shadowColor: theme.COLORS.GRAY,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 2,
    backgroundColor: theme.COLORS.MAIN_GRAY
  },
  floatingContainer: {
    position: 'absolute',
    bottom: 8,
    left: 10,
    right: 10,
    borderRadius: 28,
    flexDirection: 'row',
    height: 56,
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 2,
    backgroundColor: theme.COLORS.WHITE
  }
});

export default TabBar;
