import React from 'react';
import { Switch as NativeSwitch, Platform } from 'react-native';

import { theme } from '@constants';

const Switch: React.FC<{
  value?: boolean;
  thumbColor?: string;
  backgroundColor?: string;
  trackColor?: string;
  onValueChange?(newValue: boolean): void;
}> = ({
  value = false,
  thumbColor = theme.COLORS.PRIMARY,
  backgroundColor = theme.COLORS.MAIN_GRAY,
  trackColor = theme.COLORS.PRIMARY,
  onValueChange = (newValue: boolean) => {}
}) => {
  const _thumbColor =
    Platform.OS === 'ios' ? null : Platform.OS === 'android' && value ? thumbColor : theme.COLORS.DARK_GRAY;

  return (
    <NativeSwitch
      value={value}
      thumbColor={_thumbColor}
      ios_backgroundColor={backgroundColor}
      trackColor={{ false: trackColor, true: trackColor }}
      onValueChange={onValueChange}
    />
  );
};

export default Switch;
