import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';

import { theme } from '@constants';
import Block from '@components/Block';
import Input from '@components/Input';
import Icon from '@components/Icon';

const FormattedInput: React.FC<{
  style?: ViewStyle;
  bgColor?: string;
  width?: string | number;
  iconFamily?: string;
  iconName?: string;
  placeholderText: string;
  value: string;
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
  editable?: boolean;
  getRef?(ref): void;
  formatter?(text: string): string;
  onChangeText?(text: string): void;
  onSubmit?(text: string): void;
}> = ({
  style,
  bgColor,
  width = '100%',
  iconFamily,
  iconName,
  placeholderText,
  value,
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
  editable = true,
  getRef = (ref) => {},
  formatter = (text: string) => text,
  onChangeText = (text: string) => {},
  onSubmit = (text: string) => {}
}) => {
  const handleTextChange = React.useCallback(
    (text: string) => {
      onChangeText(formatter(text));
    },
    [formatter, onChangeText]
  );

  return (
    <Block style={{ width }}>
      <Input
        getRef={getRef}
        style={[styles.input, style]}
        bgColor={bgColor}
        editable={editable}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        numberOfLines={numberOfLines}
        maxLength={maxLength}
        shadowless
        error={error}
        autoFocus={autoFocus}
        placeholder={placeholderText}
        placeholderTextColor={theme.COLORS.LOGIN_INPUT_ICON}
        defaultValue={value}
        value={value}
        type={keyboardType}
        returnKeyType={returnKeyType}
        autoCapitalize="none"
        autoCorrect={true}
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
        onChangeText={handleTextChange}
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
