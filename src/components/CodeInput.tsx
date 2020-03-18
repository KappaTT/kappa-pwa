import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

import Block from '@components/Block';
import { theme } from '@constants';

const regex = /^[a-z0-9]+$/i;

const CodeInput: React.FC<{
  length?: number;
  keyboardType?: 'default' | 'numeric';
  value?: string;
  error?: boolean;
  onFocus?(): void;
  onChange?(text: string): void;
  onSubmit?(text: string): void;
}> = ({
  length = 6,
  keyboardType = 'default',
  value = '',
  error = false,
  onFocus = () => {},
  onChange = (text: string) => {},
  onSubmit = (text: string) => {}
}) => {
  const buildArray = (text: string) => {
    let chars = [];

    for (let i = 0; i < length; i++) {
      chars.push('');
    }

    for (let i = 0; i < text.length; i++) {
      chars[i] = text[i];
    }

    return chars;
  };

  const [focusedIndex, setFocusedIndex] = React.useState<number>(value.length < length ? 0 : -1);
  const [valueArray, setValueArray] = React.useState(buildArray(value));

  const refs = valueArray.map(v => React.useRef(undefined));

  const processInput = React.useCallback(
    (text: string, index: number) => {
      let values = valueArray;

      let newText = text.match(regex) ? text.toUpperCase() : '';

      if (index < length) {
        if (newText) {
          values[index] = newText[newText.length - 1];
        } else {
          values[index] = '';
        }
      }

      setValueArray(values);

      let newIndex = newText.length > 0 ? index + 1 : index - 1;

      if (newText === '' && text !== '') {
        newIndex = index;
      }

      if (newIndex >= 0 && newIndex < length) {
        setFocusedIndex(newIndex);
        refs[newIndex].current.focus();
      } else if (newIndex >= length) {
        refs[index].current.blur();

        onSubmit(values.join(''));
      } else {
        refs[1].current.focus();
        refs[0].current.focus();
      }

      onChange(values.join(''));
    },
    [valueArray]
  );

  const blur = () => {
    setFocusedIndex(-1);

    for (let i = 0; i < length; i++) {
      refs[i].current.blur();
    }
  };

  React.useEffect(() => {
    if (value !== valueArray.join('')) {
      setValueArray(buildArray(value));

      if (value.length === length) {
        blur();
      }
    }

    if (error) {
      blur();
    }
  }, [value, error]);

  const renderFocus = (v: string, index: number) => {
    return (
      <TextInput
        key={index}
        ref={e => (refs[index].current = e)}
        autoFocus={value.length < length && !error}
        caretHidden={true}
        style={[styles.input, error ? styles.inputError : styles.inputFocus]}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType={keyboardType}
        textContentType="oneTimeCode"
        value={v ? v[v.length - 1] : ''}
        onChangeText={(text: string) => {
          processInput(text, index);
        }}
        blurOnSubmit={false}
        onSubmitEditing={() => {}}
        onFocus={() => {
          setFocusedIndex(index);
          onFocus();
        }}
        onBlur={() => setFocusedIndex(-1)}
      />
    );
  };

  const renderBlur = (v: string, index: number) => {
    return (
      <TextInput
        key={index}
        ref={e => (refs[index].current = e)}
        caretHidden={true}
        style={[styles.input, error ? styles.inputError : styles.inputBlur]}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType={keyboardType}
        textContentType="oneTimeCode"
        value={v ? v[v.length - 1] : ''}
        onChangeText={(text: string) => {
          processInput(text, index);
        }}
        blurOnSubmit={false}
        onSubmitEditing={() => {}}
        onFocus={() => {
          setFocusedIndex(index);
          onFocus();
        }}
      />
    );
  };

  return (
    <Block style={styles.container}>
      {valueArray.map((v, index) => {
        if (index === focusedIndex) {
          return renderFocus(v, index);
        } else {
          return renderBlur(v, index);
        }
      })}
    </Block>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 40,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  inputBlur: {
    borderColor: theme.COLORS.LIGHT_GRAY
  },
  inputFocus: {
    borderColor: theme.COLORS.ROYALTY
  },
  inputError: {
    borderColor: theme.COLORS.ERROR
  },
  input: {
    width: 30,
    textAlign: 'center',
    fontSize: 18,
    marginHorizontal: 2,
    borderWidth: 0,
    borderBottomWidth: 2
  }
});

export default CodeInput;
