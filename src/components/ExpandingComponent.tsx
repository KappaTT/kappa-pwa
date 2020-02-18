import React from 'react';
import { LayoutAnimation, UIManager, Easing, Dimensions } from 'react-native';

import Block from './Block';

type TDimension = {
  top: number;
  left: number;
  width: number;
  height: number;
};

const ExpandingComponent: React.SFC<{
  small: TDimension;
  large: TDimension;
  duration: number;
  expanding: boolean;
  collapsing: boolean;
  onExpand?(): void;
  onCollapse?(): void;
  children: React.ReactNode;
}> = ({ small, large, duration, expanding, collapsing, onExpand = () => {}, onCollapse = () => {}, children }) => {
  UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

  const [position, setPosition] = React.useState<TDimension>(small);

  React.useEffect(() => {
    if (expanding) {
      LayoutAnimation.easeInEaseOut(onExpand);
      setPosition(large);
    } else if (collapsing) {
      LayoutAnimation.easeInEaseOut(onCollapse);
      setPosition(small);
    }
  }, [expanding, collapsing]);

  return <Block style={[position]}>{children}</Block>;
};

export default ExpandingComponent;
