import React from 'react';
import { TouchableWithoutFeedback, View } from 'react-native';

import Interceptor from './Interceptor';

const AuthorizedComponent: React.SFC<{
  authorized: boolean;
  onPress(): void;
  children: React.ReactNode;
}> = ({ authorized, onPress, children }) => {
  if (authorized) {
    return <React.Fragment>{children}</React.Fragment>;
  }

  return <Interceptor onPress={onPress}>{children}</Interceptor>;
};

export default AuthorizedComponent;
