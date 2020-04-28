import React from 'react';
import { ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const GradientView: React.FC<{
  style: ViewStyle;
  colors: string[];
}> = ({ style, colors, children }) => {
  return (
    <LinearGradient style={style} colors={colors} start={[0, 0]} end={[1, 1]}>
      {children}
    </LinearGradient>
  );
};

export default GradientView;
