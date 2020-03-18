import React from 'react';
import { StyleSheet } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import { theme } from '@constants';
import { Icon, TabBar } from '@components';
import { HomeScreen, AboutScreen, LoginScreen } from '@screens';

const EventsStack = createStackNavigator({
  Events: {
    screen: AboutScreen,
    navigationOptions: ({ navigation }) => ({
      header: null
    })
  }
});

EventsStack.navigationOptions = ({ navigation }) => ({
  tabBarLabel: 'Events',
  tabBarIcon: ({ tintColor }) => (
    <Icon style={styles.iconEvents} name="calendar" family="Feather" color={tintColor} size={24} />
  )
});

const DirectoryStack = createStackNavigator({
  Directory: {
    screen: HomeScreen,
    navigationOptions: ({ navigation }) => ({
      header: null
    })
  }
});

DirectoryStack.navigationOptions = ({ navigation }) => ({
  tabBarLabel: 'Directory',
  tabBarIcon: ({ tintColor }) => (
    <Icon style={styles.iconDirectory} name="contacts" family="AntDesign" color={tintColor} size={24} />
  )
});

const CheckInStack = createStackNavigator({
  CheckIn: {
    screen: HomeScreen,
    navigationOptions: ({ navigation }) => ({
      header: null
    })
  }
});

CheckInStack.navigationOptions = ({ navigation }) => ({
  tabBarLabel: 'Check In',
  tabBarIcon: ({ tintColor }) => (
    <Icon style={styles.iconCheckIn} name="check-square" family="Feather" color={tintColor} size={24} />
  )
});

const AnnouncementsStack = createStackNavigator({
  Announcements: {
    screen: AboutScreen,
    navigationOptions: ({ navigation }) => ({
      header: null
    })
  }
});

AnnouncementsStack.navigationOptions = ({ navigation }) => ({
  tabBarLabel: 'Announcements',
  tabBarIcon: ({ tintColor }) => (
    <Icon style={styles.iconAnnouncements} name="message-square" family="Feather" color={tintColor} size={24} />
  )
});

const ProfileStack = createStackNavigator({
  Profile: {
    screen: LoginScreen,
    navigationOptions: ({ navigation }) => ({
      header: null
    })
  }
});

ProfileStack.navigationOptions = ({ navigation }) => ({
  tabBarLabel: 'Profile',
  tabBarIcon: ({ tintColor }) => (
    <Icon style={styles.iconProfile} name="user" family="Feather" color={tintColor} size={24} />
  )
});

const styles = StyleSheet.create({
  iconEvents: {},
  iconDirectory: {
    paddingTop: 4
  },
  iconCheckIn: {},
  iconAnnouncements: {},
  iconProfile: {}
});

export default createBottomTabNavigator(
  {
    EventsStack,
    DirectoryStack,
    CheckInStack,
    AnnouncementsStack,
    ProfileStack
  },
  {
    tabBarComponent: TabBar,
    tabBarOptions: {
      activeTintColor: theme.COLORS.BLACK,
      inactiveTintColor: '#B1B6C0'
    }
  }
);
