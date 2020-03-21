import React from 'react';
import { StyleSheet } from 'react-native';

import { theme } from '@constants';
import Block from '@components/Block';
import CheckListButton from '@components/CheckListButton';

const RadioList: React.FC<{
  options: Array<string>;
  selected: string;
  onChange?(chosen: string): void;
}> = ({ options, selected, onChange = (chosen: string) => {} }) => {
  return (
    <Block style={styles.wrapper}>
      {options.map(option => (
        <CheckListButton key={option} label={option} selected={option === selected} onPress={() => onChange(option)} />
      ))}
    </Block>
  );
};

const styles = StyleSheet.create({
  wrapper: {}
});

export default RadioList;
