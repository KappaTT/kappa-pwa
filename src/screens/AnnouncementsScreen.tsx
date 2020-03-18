import React from 'react';

import { NavigationTypes } from '@types';
import Content from '@screens/content/AnnouncementsContent';

const AnnouncementsScreen: React.FC<{
  navigation: NavigationTypes.ParamType;
}> = ({ navigation }) => {
  return <Content navigation={navigation} />;
};

export default AnnouncementsScreen;
