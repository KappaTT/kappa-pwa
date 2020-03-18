import React from 'react';
import { StyleSheet } from 'react-native';

import { theme } from '@constants';
import Block from '@components/Block';
import Icon from '@components/Icon';
import Text from '@components/Text';

const Toast: React.FC<{
  title: string;
  subtitle?: string;
  bgColor?: string;
  textColor?: string;
}> = ({ title, subtitle = '' }) => {
  return (
    <Block style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </Block>
  );
};

// TODO: max width, text-wrapping
// animate in and out

const styles = StyleSheet.create({
  container: {},
  title: {},
  subtitle: {}
});

export default Toast;
