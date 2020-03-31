import React from 'react';
import { StyleSheet, Modal } from 'react-native';

import KeyboardDismissView from '@components/KeyboardDismissView';

const SlideModal: React.FC<{
  transparent?: boolean;
  visible: boolean;
  disableAndroidBack?: boolean;
  onRequestClose?(): void;
  onDismiss?(): void;
  children: React.ReactNode;
}> = ({
  transparent = false,
  visible,
  disableAndroidBack = false,
  onRequestClose = () => {},
  onDismiss = () => {},
  children
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={transparent}
      visible={visible}
      onRequestClose={!disableAndroidBack && onRequestClose}
      onDismiss={onDismiss}
    >
      <KeyboardDismissView style={styles.dismissView}>{children}</KeyboardDismissView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  dismissView: {
    flex: 1
  }
});

export default SlideModal;
