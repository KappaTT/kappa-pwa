import React from 'react';

import { NavigationTypes } from '../types';
import LoginContent from './content/LoginContent';

const LoginScreen: React.FC<{
  navigation: NavigationTypes.ParamType;
}> = ({ navigation }) => {
  return <LoginContent navigation={navigation} />;
};

export default LoginScreen;
