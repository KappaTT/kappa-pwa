import React from 'react';
import { TouchableWithoutFeedback, Keyboard, View } from 'react-native';

const KeyboardDismissHOC = Component => {
  return ({ children, ...props }) => (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <Component {...props}>{children}</Component>
    </TouchableWithoutFeedback>
  );
};

const KeyboardDismissView = KeyboardDismissHOC(View);

export default KeyboardDismissView;
