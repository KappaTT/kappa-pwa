import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import { TRedux } from '../reducers';
import { _auth, _map } from '../reducers/actions';

import { theme } from '../constants';
import TabBarButton from './TabBarButton';
import { iPhoneX } from '../services/utils';

const TabBar = props => {
  const {
    renderIcon,
    getLabelText,
    activeTintColor,
    inactiveTintColor,
    onTabPress,
    onTabLongPress,
    navigation
  } = props;

  const { routes, index: activeRouteIndex } = navigation.state;

  const dispatch = useDispatch();

  // redux selectors
  const authorized = useSelector((state: TRedux) => state.auth.authorized);
  const createPostVisible = useSelector((state: TRedux) => state.map.createPostVisible);

  // redux dispatch
  const dispatchShowLoginModal = React.useCallback(() => dispatch(_auth.showModal()), [dispatch]);
  const dispatchShowCreatePost = React.useCallback(() => dispatch(_map.showCreatePost()), [dispatch]);
  const dispatchHideCreatePost = React.useCallback(() => dispatch(_map.hideCreatePost()), [dispatch]);

  return (
    <View style={[styles.floatingContainer, iPhoneX() ? styles.iosContainer : styles.androidContainer]}>
      {routes
        .filter(route => !getLabelText({ route }).endsWith('Stack'))
        .map((route, routeIndex) => {
          const isRouteActive = routeIndex === activeRouteIndex;
          const isPost = getLabelText({ route }) === 'Post';

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
              label={getLabelText({ route })}
              isRouteActive={isActive}
              activeTintColor={activeTintColor}
              inactiveTintColor={inactiveTintColor}
              onTabPress={onPress}
              onTabLongPress={onLongPress}
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
    paddingHorizontal: 4,
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 2,
    backgroundColor: theme.COLORS.WHITE
  },
  iosContainer: {
    marginBottom: 16
    // paddingBottom: 16
  },
  androidContainer: {
    paddingBottom: 0
  }
});

export default TabBar;
