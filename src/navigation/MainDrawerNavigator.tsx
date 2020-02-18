import React from 'react';
import { Easing, Animated } from 'react-native';
import { NavigationTransitionProps, NavigationSceneRendererProps } from 'react-navigation-transition-config';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';

import { HomeScreen, AboutScreen, LoginScreen } from '../screens';
import Menu from './Menu';
import { Header, DrawerItem } from '../components';

const transitionConfig = (
  transitionProps: NavigationTransitionProps,
  prevTransitionProps: NavigationTransitionProps
) => ({
  transitionSpec: {
    duration: 400,
    easing: Easing.out(Easing.poly(4)),
    timing: Animated.timing
  },
  screenInterpolator: (sceneProps: NavigationSceneRendererProps) => {
    const { layout, position, scene } = sceneProps;
    const thisSceneIndex = scene.index;
    const width = layout.initWidth;

    const scale = position.interpolate({
      inputRange: [thisSceneIndex - 1, thisSceneIndex, thisSceneIndex + 1],
      outputRange: [4, 1, 1]
    });
    const opacity = position.interpolate({
      inputRange: [thisSceneIndex - 1, thisSceneIndex, thisSceneIndex + 1],
      outputRange: [0, 1, 1]
    });
    const translateX = position.interpolate({
      inputRange: [thisSceneIndex - 1, thisSceneIndex],
      outputRange: [width, 0]
    });

    const scaleWithOpacity = { opacity };
    const screenName = 'Search';

    if (
      screenName === transitionProps.scene.route.routeName ||
      (prevTransitionProps && screenName === prevTransitionProps.scene.route.routeName)
    ) {
      return scaleWithOpacity;
    }
    return { transform: [{ translateX }] };
  }
});

// HOME

const HomeStack = createStackNavigator(
  {
    Dashboard: {
      screen: HomeScreen,
      navigationOptions: ({ navigation }) => ({
        header: <Header title="Home" navigation={navigation} />
      })
    }
  },
  {
    cardStyle: {
      backgroundColor: '#FFFFFF'
    },
    transitionConfig
  }
);

HomeStack.navigationOptions = ({ navigation }) => ({
  drawerLabel: ({ focused }) => <DrawerItem focused={focused} screen="HomeScreen" title="Home" />
});

// MAP

const AboutStack = createStackNavigator(
  {
    Map: {
      screen: AboutScreen,
      navigationOptions: ({ navigation }) => ({
        header: <Header title="About" navigation={navigation} />
      })
    }
  },
  {
    cardStyle: {
      backgroundColor: '#FFFFFF'
    },
    transitionConfig
  }
);

AboutStack.navigationOptions = ({ navigation }) => ({
  drawerLabel: ({ focused }) => <DrawerItem focused={focused} screen="AboutScreen" title="About" />
});

// LOGIN

const LoginStack = createStackNavigator({
  Login: {
    screen: LoginScreen,
    navigationOptions: ({ navigation }) => ({
      header: null
    })
  }
});

LoginStack.navigationOptions = ({ navigation }) => ({
  drawerLabel: ({ focused }) => undefined
});

export default createDrawerNavigator(
  {
    LoginStack,
    HomeStack,
    AboutStack
  },
  Menu
);
