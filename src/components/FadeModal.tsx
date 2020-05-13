import React from 'react';
import { StyleSheet, Modal, StatusBar } from 'react-native';

import KeyboardDismissView from '@components/KeyboardDismissView';

const FadeModal: React.FC<{
  transparent?: boolean;
  presentationType?: 'fullScreen' | 'pageSheet' | 'formSheet' | 'overFullScreen';
  visible: boolean;
  disableAndroidBack?: boolean;
  statusBarStyle?: '' | 'light-content' | 'dark-content';
  onRequestClose?(): void;
  onDismiss?(): void;
  children: React.ReactNode;
}> = ({
  transparent = false,
  presentationType,
  visible,
  disableAndroidBack = false,
  statusBarStyle = '',
  onRequestClose = () => {},
  onDismiss = () => {},
  children
}) => {
  return (
    <Modal
      animationType="fade"
      presentationStyle={presentationType}
      transparent={transparent}
      visible={visible}
      onRequestClose={!disableAndroidBack && onRequestClose}
      onDismiss={onDismiss}
    >
      {statusBarStyle !== '' && (
        <StatusBar animated={true} translucent={true} backgroundColor="transparent" barStyle={statusBarStyle} />
      )}

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
