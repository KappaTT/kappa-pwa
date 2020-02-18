import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import { theme } from '../../libs/galio';
import { Icon } from '../../libs/argon';
import { TabBar } from '../components';
import { HomeScreen, AboutScreen, LoginScreen } from '../screens';

// HOME

const HomeStack = createStackNavigator({
  Map: {
    screen: HomeScreen,
    navigationOptions: ({ navigation }) => ({
      header: null
    })
  }
});

HomeStack.navigationOptions = ({ navigation }) => ({
  tabBarLabel: 'Home',
  activeTintColor: 'white',
  inactiveTintColor: 'black',
  tabBarIcon: ({ tintColor }) => <Icon name="map" family="Feather" color={tintColor} size={theme.SIZES.BASE * 1.2} />
});

// ABOUT

const AboutStack = createStackNavigator({
  Profile: {
    screen: AboutScreen,
    navigationOptions: ({ navigation }) => ({
      header: null
    })
  }
});

AboutStack.navigationOptions = ({ navigation }) => ({
  tabBarLabel: 'About',
  tabBarIcon: ({ tintColor }) => <Icon name="plus" family="Octicons" color={tintColor} size={theme.SIZES.BASE * 1.2} />
});

// LOGIN

const LoginStack = createStackNavigator({
  Profile: {
    screen: LoginScreen,
    navigationOptions: ({ navigation }) => ({
      header: null
    })
  }
});

LoginStack.navigationOptions = ({ navigation }) => ({
  tabBarLabel: 'Login',
  tabBarIcon: ({ tintColor }) => <Icon name="user" family="Feather" color={tintColor} size={theme.SIZES.BASE * 1.2} />
});

export default createBottomTabNavigator(
  {
    HomeStack,
    AboutStack,
    LoginStack
  },
  {
    tabBarComponent: TabBar,
    tabBarOptions: {
      activeTintColor: '#613CE8',
      inactiveTintColor: '#B1B6C0'
    }
  }
);
