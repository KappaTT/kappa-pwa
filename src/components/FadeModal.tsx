import React from 'react';
import { StyleSheet, Modal } from 'react-native';

import KeyboardDismissView from './KeyboardDismissView';

const FadeModal: React.SFC<{
  transparent?: boolean;
  visible: boolean;
  onRequestClose?(): void;
  onDismiss?(): void;
  children: React.ReactNode;
}> = ({ transparent = false, visible, onRequestClose = () => {}, onDismiss = () => {}, children }) => {
  return (
    <Modal
      animationType="fade"
      transparent={transparent}
      visible={visible}
      onRequestClose={onRequestClose}
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

export default FadeModal;
