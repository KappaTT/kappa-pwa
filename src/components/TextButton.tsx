import React from 'react';
import { StyleSheet, TouchableOpacity, ViewStyle, TextStyle, Text } from 'react-native';

const TextButton: React.FC<{
  label: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  passiveLabel?: string;
  passiveStyle?: TextStyle;
  onPress?(): void;
}> = ({ label, style = {}, textStyle = {}, passiveLabel, passiveStyle = {}, onPress = () => {} }) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
      {passiveLabel !== undefined && <Text style={passiveStyle}>{passiveLabel} </Text>}
      <Text style={textStyle}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around'
  }
});

export default TextButton;
