import React from 'react';

import { NavigationTypes } from '@types';
import Content from '@screens/content/MessagesContent';

const MessagesScreen: React.FC<{
  navigation: NavigationTypes.ParamType;
}> = ({ navigation }) => {
  return <Content navigation={navigation} />;
};

export default MessagesScreen;
