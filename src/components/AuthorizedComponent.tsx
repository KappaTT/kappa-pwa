import React from 'react';

import Interceptor from '@components/Interceptor';

const AuthorizedComponent: React.FC<{
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
