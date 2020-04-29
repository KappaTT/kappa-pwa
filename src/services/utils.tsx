import { Platform, StatusBar, Dimensions } from 'react-native';
import Constants from 'expo-constants';
import { getStatusBarHeight } from 'react-native-status-bar-height';

const { width, height } = Dimensions.get('screen');

export const StatusHeight = StatusBar.currentHeight || getStatusBarHeight();
export const HeaderHeight = 42;
export const iPhoneX = () => Platform.OS === 'ios' && (height === 812 || width === 812);
export const TabBarHeight = 48;
export const NavigationHeight = iPhoneX() ? 16 : 0;

export const deviceId = Constants.installationId;

export const sleep = (time: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
};

export const isEmpty = (obj: any) => {
  if (obj === undefined || obj === null) return true;
  if (obj.constructor !== Object) return false;

  for (const key in obj) {
    return false;
  }

  return true;
};
