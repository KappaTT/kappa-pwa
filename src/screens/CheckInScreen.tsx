import React from 'react';

import { NavigationTypes } from '@types';
import Content from '@screens/content/CheckInContent';

const CheckInScreen: React.FC<{
  navigation: NavigationTypes.ParamType;
}> = ({ navigation }) => {
  return <Content navigation={navigation} />;
};

export default CheckInScreen;
