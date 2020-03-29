import React from 'react';
import { StyleSheet, TouchableOpacity, Animated, Dimensions, Easing } from 'react-native';

import { theme } from '@constants';
import Block from '@components/Block';
import Text from '@components/Text';
import Icon from '@components/Icon';
import GradientView from '@components/GradientView';

const { height } = Dimensions.get('screen');

const BackButton: React.FC<{
  onPress(): void;
}> = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.backButton} onPress={() => onPress()}>
      <Icon family="Ionicons" name="ios-arrow-back" color={theme.COLORS.WHITE} size={18} />
    </TouchableOpacity>
  );
};

const RouterModal: React.FC<{
  routerName: string;
  gradient: string[];
  onPress(): void;
  children: React.ReactNode;
}> = ({ routerName, gradient, onPress, children }) => {
  const [topPosition, setTopPosition] = React.useState(new Animated.Value(height));

  React.useEffect(() => {
    Animated.timing(topPosition, {
      toValue: 0,
      easing: Easing.out(Easing.poly(4)),
      duration: 400
    }).start();
  }, []);

  const handleBackPress = () => {
    Animated.timing(topPosition, {
      toValue: height,
      easing: Easing.out(Easing.poly(4)),
      duration: 400
    }).start(() => {
      onPress();
    });
  };

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: topPosition,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: theme.COLORS.WHITE
      }}
    >
      {routerName !== undefined && routerName !== '' && (
        <Block style={styles.routerHeader}>
          <GradientView style={styles.routerGradient} colors={gradient}>
            <BackButton onPress={handleBackPress} />
            <Text style={styles.routerTitle}>{routerName}</Text>
          </GradientView>
        </Block>
      )}
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.COLORS.WHITE
  },
  routerHeader: {
    shadowOffset: { width: 0, height: -3 },
    shadowRadius: 16,
    shadowColor: theme.COLORS.BLACK,
    shadowOpacity: 0.5,
    elevation: 2
  },
  routerGradient: {
    height: 40,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  backButton: {
    marginLeft: 12,
    marginRight: 14,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 8
  },
  routerTitle: {
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
    color: theme.COLORS.WHITE
  },
  contentWrapper: {
    flexGrow: 1,
    backgroundColor: theme.COLORS.WHITE
  }
});

export default RouterModal;
