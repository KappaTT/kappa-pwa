import React from 'react';
import { NavigationProp } from '@react-navigation/native';

import Content from '@screens/content/CoursesContent';

const CoursesScreen: React.FC<{
  navigation: NavigationProp<any, 'Courses'>;
}> = ({ navigation }) => {
  return <Content navigation={navigation} />;
};

export default CoursesScreen;
