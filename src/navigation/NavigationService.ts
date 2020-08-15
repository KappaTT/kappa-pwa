import React from 'react';
import { CommonActions, NavigationContainerRef } from '@react-navigation/native';

export const navigationRef = React.createRef<NavigationContainerRef>();

export const navigate = (name: string, params: any = {}) => {
  navigationRef.current?.dispatch(
    CommonActions.navigate({
      name,
      params
    })
  );
};
