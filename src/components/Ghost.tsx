import React from 'react';
import { ViewStyle } from 'react-native';

import Block from '@components/Block';

const Ghost: React.FC<{
  style?: ViewStyle | Array<ViewStyle>;
  children?: React.ReactNode;
}> = ({ style, children }) => {
  return (
    <Block style={style} pointerEvents="box-none">
      {children}
    </Block>
  );
};

export default Ghost;
