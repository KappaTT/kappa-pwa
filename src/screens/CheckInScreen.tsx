import React from 'react';
import { NavigationProp } from '@react-navigation/native';

import Content from '@screens/content/CheckInContent';

const CheckInScreen: React.FC<{
  navigation: NavigationProp<any, 'Check In'>;
}> = ({ navigation }) => {
  return <Content navigation={navigation} />;
};

export default CheckInScreen;
