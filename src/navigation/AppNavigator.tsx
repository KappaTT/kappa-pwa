import React from 'react';
import { NavigationContainer, DefaultTheme, Theme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import { theme } from '@constants';
import { MessagesScreen, CheckInScreen, DirectoryScreen, EventsScreen, ProfileScreen } from '@screens';
import { navigationRef } from '@navigation/NavigationService';
import { TabBar, Icon } from '@components';

// Create stacks
const EventsStack = createStackNavigator();
const DirectoryStack = createStackNavigator();
const CheckInStack = createStackNavigator();
const MessagesStack = createStackNavigator();
const ProfileStack = createStackNavigator();

const EventsStackNavigator = () => {
  return (
    <EventsStack.Navigator screenOptions={{ headerShown: false }}>
      <EventsStack.Screen name="Events" component={EventsScreen} />
    </EventsStack.Navigator>
  );
};

const DirectoryStackNavigator = () => {
  return (
    <DirectoryStack.Navigator screenOptions={{ headerShown: false }}>
      <DirectoryStack.Screen name="Directory" component={DirectoryScreen} />
    </DirectoryStack.Navigator>
  );
};

const CheckInStackNavigator = () => {
  return (
    <CheckInStack.Navigator screenOptions={{ headerShown: false }}>
      <CheckInStack.Screen name="Check In" component={CheckInScreen} />
    </CheckInStack.Navigator>
  );
};

const MessagesStackNavigator = () => {
  return (
    <MessagesStack.Navigator screenOptions={{ headerShown: false }}>
      <MessagesStack.Screen name="Messages" component={MessagesScreen} />
    </MessagesStack.Navigator>
  );
};

const ProfileStackNavigator = () => {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="Profile" component={ProfileScreen} />
    </ProfileStack.Navigator>
  );
};

// Create Tab navigator for caching
const Tab = createBottomTabNavigator();

const NavigatorTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: theme.COLORS.WHITE
  }
};

const AppNavigator = () => {
  return (
    <NavigationContainer ref={navigationRef} theme={NavigatorTheme}>
      <Tab.Navigator
        tabBar={(props) => <TabBar {...props} />}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            switch (route.name) {
              case 'Events':
                return <Icon name="calendar" family="Feather" color={color} size={size} />;
              case 'Directory':
                return <Icon name="contacts" family="AntDesign" color={color} size={size} />;
              case 'Check In':
                return <Icon name="check-square" family="Feather" color={color} size={size} />;
              case 'Messages':
                return <Icon name="message-square" family="Feather" color={color} size={size} />;
              case 'Profile':
                return <Icon name="user" family="Feather" color={color} size={size} />;
            }
          }
        })}
        tabBarOptions={{
          activeTintColor: theme.COLORS.BLACK,
          inactiveTintColor: '#B1B6C0'
        }}
      >
        <Tab.Screen name="Events" component={EventsStackNavigator} />
        <Tab.Screen name="Directory" component={DirectoryStackNavigator} />
        <Tab.Screen name="Check In" component={CheckInStackNavigator} />
        <Tab.Screen name="Messages" component={MessagesStackNavigator} />
        <Tab.Screen name="Profile" component={ProfileStackNavigator} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
