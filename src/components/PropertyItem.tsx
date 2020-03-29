import React from 'react';
import { StyleSheet } from 'react-native';

import { theme } from '@constants';
import Block from '@components/Block';
import Text from '@components/Text';

const PropertyItem: React.FC<{
  label: string;
  value: string | number;
}> = ({ label, value }) => {
  return (
    <Block style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </Block>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 6
  },
  label: {
    width: 80,
    fontFamily: 'Montserrat-Medium',
    fontSize: 10,
    color: theme.COLORS.GRAY
  },
  value: {
    marginLeft: 4,
    fontFamily: 'Montserrat',
    fontSize: 10,
    color: theme.COLORS.GRAY_BLUE
  }
});

export default PropertyItem;
