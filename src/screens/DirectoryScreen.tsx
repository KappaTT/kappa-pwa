import React from 'react';

import { NavigationTypes } from '@types';
import Content from '@screens/content/DirectoryContent';

const DirectoryScreen: React.FC<{
  navigation: NavigationTypes.ParamType;
}> = ({ navigation }) => {
  return <Content navigation={navigation} />;
};

export default DirectoryScreen;
