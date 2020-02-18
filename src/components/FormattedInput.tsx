import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';

import { theme } from '../constants';
import Block from './Block';
import Input from './Input';
import Icon from './Icon';

const FormattedInput: React.SFC<{
  style?: ViewStyle;
  width?: string | number;
  iconFamily?: string;
  iconName?: string;
  placeholderText: string;
  defaultValue?: string;
  keyboardType?: string;
  returnKeyType?: string;
  password?: boolean;
  textContentType?: string;
  maxLength?: number;
  multiline?: boolean;
  numberOfLines?: number;
  autoFocus?: boolean;
  blurOnSubmit?: boolean;
  error?: boolean;
  getRef?(ref): void;
  formatter?(text: string): string;
  onChangeText?(text: string): void;
  onSubmit?(text: string): void;
}> = ({
  style,
  width = '100%',
  iconFamily,
  iconName,
  placeholderText,
  defaultValue,
  keyboardType = 'default',
  returnKeyType,
  password = false,
  textContentType = 'none',
  maxLength,
  multiline = false,
  numberOfLines = 1,
  autoFocus = false,
  blurOnSubmit = !multiline,
  error = false,
  getRef = ref => {},
  formatter = (text: string) => text,
  onChangeText = (text: string) => {},
  onSubmit = (text: string) => {}
}) => {
  const [value, setValue] = React.useState<string>(defaultValue);

  React.useEffect(() => {
    const newText = formatter(defaultValue);
    setValue(newText);
    onChangeText(newText);
  }, [defaultValue]);

  return (
    <Block style={{ width: width }}>
      <Input
        getRef={getRef}
        style={[styles.input, style]}
        multiline={multiline}
        numberOfLines={numberOfLines}
        maxLength={maxLength}
        shadowless
        error={error}
        autoFocus={autoFocus}
        placeholder={placeholderText}
        placeholderTextColor={theme.COLORS.LOGIN_INPUT_ICON}
        defaultValue={defaultValue}
        value={value}
        type={keyboardType}
        returnKeyType={returnKeyType}
        autoCapitalize="none"
        autoCorrect={false}
        password={password}
        viewPass={password}
        textContentType={textContentType}
        iconColor={theme.COLORS.LOGIN_INPUT_ICON}
        iconContent={
          iconFamily !== undefined &&
          iconName !== undefined && (
            <Icon
              size={18}
              color={theme.COLORS.LOGIN_INPUT_ICON}
              style={{ marginRight: 8 }}
              family={iconFamily}
              name={iconName}
            />
          )
        }
        onChangeText={(text: string) => {
          const newText = formatter(text);
          setValue(newText);
          onChangeText(newText);
        }}
        blurOnSubmit={blurOnSubmit}
        onSubmitEditing={onSubmit}
      />
    </Block>
  );
};

const styles = StyleSheet.create({
  input: {
    borderRadius: 4,
    height: 44
  }
});

export default FormattedInput;
