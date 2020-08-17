import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';

import { hapticImpact } from '@services/hapticService';
import { theme } from '@constants';
import { TabBarHeight, HeaderHeight } from '@services/utils';

const PopupButton: React.FC<{
  label: string;
  icon?: React.ReactNode;
  color?: string;
  textColor?: string;
  loading?: boolean;
  disabled?: boolean;
  haptic?: boolean;
  onPress?(): void;
}> = ({
  label,
  icon,
  color = theme.COLORS.PRIMARY,
  textColor = theme.COLORS.WHITE,
  loading = false,
  disabled = false,
  haptic = true,
  onPress = () => {}
}) => {
  const insets = useSafeArea();

  const onButtonPress = React.useCallback(() => {
    if (!loading) {
      if (haptic) {
        hapticImpact();
      }

      onPress();
    }
  }, [haptic, loading, onPress]);

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
