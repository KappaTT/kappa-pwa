import React from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import { Input } from '../galio';

import { theme } from '../../src/constants';

class ArInput extends React.Component {
  render() {
    const { placeholder, shadowless, border, success, error, maxLength, getRef } = this.props;

    const inputStyles = [
      styles.input,
      !shadowless && styles.shadow,
      border && styles.border,
      success && styles.success,
      error && styles.error,
      { ...this.props.style }
    ];

    const bgColor = success
      ? theme.COLORS.INPUT_SUCCESS_LIGHT
      : error
      ? theme.COLORS.INPUT_ERROR_LIGHT
      : theme.COLORS.WHITE;
    const borderColor = success ? theme.COLORS.INPUT_SUCCESS : error ? theme.COLORS.INPUT_ERROR : theme.COLORS.INPUT;

    return (
      <Input
        getRef={getRef}
        placeholder={placeholder || 'write something here'}
        placeholderTextColor={theme.COLORS.MUTED}
        style={inputStyles}
        color={theme.COLORS.HEADER}
        bgColor={bgColor}
        borderColor={borderColor}
        maxLength={maxLength}
        {...this.props}
      />
    );
  }
}

ArInput.defaultProps = {
  shadowless: false,
  success: false,
  error: false,
  getRef: ref => {}
};

ArInput.propTypes = {
  shadowless: PropTypes.bool,
  success: PropTypes.bool,
  error: PropTypes.bool,
  getRef: PropTypes.func
};

const styles = StyleSheet.create({
  input: {
    borderRadius: 4,
    backgroundColor: '#FFFFFF'
  },
  border: {
    borderColor: theme.COLORS.BORDER
  },
  success: {
    borderColor: theme.COLORS.INPUT_SUCCESS
  },
  error: {
    borderColor: theme.COLORS.INPUT_ERROR
  },
  shadow: {
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    shadowOpacity: 0.85,
    elevation: 2
  }
});

export default ArInput;
