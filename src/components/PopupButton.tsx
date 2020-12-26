import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';

import { theme } from '@constants';

const PopupButton: React.FC<{
  label: string;
  icon?: React.ReactNode;
  color?: string;
  textColor?: string;
  loading?: boolean;
  disabled?: boolean;
  onPress?(): void;
}> = ({
  label,
  icon,
  color = theme.COLORS.PRIMARY,
  textColor = theme.COLORS.WHITE,
  loading = false,
  disabled = false,
  onPress = () => {}
}) => {
  const onButtonPress = React.useCallback(() => {
    if (!loading) {
      onPress();
    }
  }, [loading, onPress]);

  return (
    <TouchableOpacity activeOpacity={0.6} onPress={onButtonPress}>
      <View style={[styles.content, { backgroundColor: color }]}>
        <Text style={[styles.buttonLabel, { color: textColor, marginLeft: icon ? 8 : 0 }]}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  content: {
    alignSelf: 'flex-start',
    height: 36,
    marginLeft: 10,
    paddingHorizontal: 10,
    borderTopLeftRadius: 28,
    borderBottomLeftRadius: 28,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  buttonLabel: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 16
  }
});

export default PopupButton;
