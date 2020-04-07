import React from 'react';
import { StyleSheet } from 'react-native';

import { theme } from '@constants';
import Block from '@components/Block';
import CheckListButton from '@components/CheckListButton';

const RadioList: React.FC<{
  options: Array<{
    id: string;
    title: string;
    subtitle?: string;
  }>;
  selected: string;
  renderItem?(id: string): React.ReactElement;
  onChange?(chosen: string): void;
}> = ({ options, selected, renderItem, onChange = (chosen: string) => {} }) => {
  return (
    <Block style={styles.wrapper}>
      {options.map(option => (
        <CheckListButton
          key={option.id}
          label={option}
          selected={option.id === selected}
          onPress={() => onChange(option.id)}
        />
      ))}
    </Block>
  );
};

const styles = StyleSheet.create({
  wrapper: {}
});

export default RadioList;
