import { Platform, StatusBar, Dimensions } from 'react-native';
import Constants from 'expo-constants';
import { getStatusBarHeight } from 'react-native-status-bar-height';

import { theme } from '@galio';

const { width, height } = Dimensions.get('screen');

export const StatusHeight = StatusBar.currentHeight || getStatusBarHeight();
export const HeaderHeight = theme.SIZES.BASE * 3.5 + (StatusHeight || 0);
export const iPhoneX = () => Platform.OS === 'ios' && (height === 812 || width === 812);
export const TabBarHeight = 60;
export const NavigationHeight = iPhoneX() ? 16 : 0;

export const deviceId = Constants.installationId;

export const sleep = (time: number) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, time);
  });
};

export const isEmpty = (obj: any) => {
  return Object.entries(obj).length === 0 && obj.constructor === Object;
};
