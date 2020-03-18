import React from 'react';
import { TouchableWithoutFeedback, View } from 'react-native';

const Interceptor: React.FC<{
  onPress(): void;
  children: React.ReactNode;
}> = ({ onPress, children }) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View pointerEvents="box-only">{children}</View>
    </TouchableWithoutFeedback>
  );
};

export default Interceptor;
