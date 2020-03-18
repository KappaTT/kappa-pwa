import React from 'react';
import { StyleSheet } from 'react-native';

import Block from '@components/Block';

const TextConstraint: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <Block style={styles.constraint}>{children}</Block>;
};

const styles = StyleSheet.create({
  constraint: {
    alignSelf: 'flex-start'
  }
});

export default TextConstraint;
