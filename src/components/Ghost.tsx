import React from 'react';
import { ViewStyle } from 'react-native';

import Block from './Block';

const Ghost: React.SFC<{
  style?: ViewStyle;
  children?: React.ReactNode;
}> = ({ style, children }) => {
  return (
    <Block style={style} pointerEvents="box-none">
      {children}
    </Block>
  );
};

export default Ghost;
