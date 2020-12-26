import React from 'react';
import { StyleSheet } from 'react-native';

import Ghost from '@components/Ghost';

const LocalModalController: React.FC = ({ children }) => {
  return <Ghost style={styles.container}>{children}</Ghost>;
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  }
});

export default LocalModalController;
