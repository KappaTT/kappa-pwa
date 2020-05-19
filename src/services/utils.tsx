import { Platform, StatusBar, Dimensions } from 'react-native';
import Constants from 'expo-constants';
import { getStatusBarHeight } from 'react-native-status-bar-height';

const { width, height } = Dimensions.get('window');

export const StatusHeight = StatusBar.currentHeight || getStatusBarHeight();
export const HeaderHeight = 42;
export const iPhoneX = () => Platform.OS === 'ios' && (height === 812 || width === 812);
export const TabBarHeight = 48;
export const NavigationHeight = iPhoneX() ? 16 : 0;
export const HORIZONTAL_PADDING = 20;

export const deviceId = Constants.installationId;

export const sleep = (time: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
};

export const castTo = (value: string, type: string) => {
  if (typeof value === type) {
    return value;
  }

  switch (type) {
    case 'boolean':
      return value === 'true';
    case 'string':
      return value.toString();
    case 'number':
      return Number(value);
    default:
      return JSON.parse(value);
  }
};

export const castToString = (value: any) => {
  if (typeof value === 'string') {
    return value;
  }

  switch (typeof value) {
    case 'boolean':
    case 'number':
      return value.toString();
    default:
      return JSON.stringify(value);
  }
};

export const isEmpty = (obj: any) => {
  if (obj === undefined || obj === null) return true;
  if (obj.constructor !== Object) return false;

  for (const key in obj) {
    return false;
  }

  return true;
};
