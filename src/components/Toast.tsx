import React from 'react';
import { StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Animated, Easing, Dimensions } from 'react-native';

import { theme } from '@constants';
import Block from '@components/Block';
import Icon from '@components/Icon';
import Text from '@components/Text';

const { width, height } = Dimensions.get('screen');

const Toast: React.FC<{
  title?: string;
  message?: string;
  allowClose?: boolean;
  shouldClose?: boolean;
  showClose?: boolean;
  onDoneClosing(): void;
  children?: React.ReactNode;
}> = ({
  title = '',
  message = '',
  allowClose = true,
  shouldClose = false,
  showClose = false,
  onDoneClosing,
  children
}) => {
  const heightBase = new Animated.Value(height * 0.05);
  const opacityBase = new Animated.Value(1);
  const [progress, setProgress] = React.useState<Animated.Value>(new Animated.Value(1));

  const handleClose = () => {
    Animated.timing(progress, {
      toValue: 1,
      easing: Easing.out(Easing.poly(4)),
      duration: 400,
      useNativeDriver: true
    }).start(() => {
      onDoneClosing();
    });
  };

  React.useEffect(() => {
    Animated.timing(progress, {
      toValue: 0,
      easing: Easing.out(Easing.poly(4)),
      duration: 400,
      useNativeDriver: true
    }).start();
  }, []);

  React.useEffect(() => {
    if (shouldClose) {
      handleClose();
    }
  }, [shouldClose]);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: 0,
        width: width,
        height: height,
        opacity: Animated.subtract(opacityBase, progress),
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
      }}
    >
      <Animated.View
        style={{
          position: 'absolute',
          transform: [
            {
              translateY: Animated.multiply(heightBase, progress)
            }
          ],
          width: width,
          height: height,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <TouchableOpacity
          style={styles.background}
          activeOpacity={1}
          onPress={() => {
            allowClose && handleClose();
          }}
        ></TouchableOpacity>

        <Block style={styles.wrapper}>
          <Block style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            {<Text style={styles.message}>{message}</Text>}
            {children !== null && <Block style={styles.contentWrapper}>{children}</Block>}
          </Block>
        </Block>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    top: 0,
    width: width,
    height: height
  },
  wrapper: {
    width: width - 60,
    minHeight: 80,
    borderRadius: 10,
    backgroundColor: theme.COLORS.WHITE,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 16,
    shadowColor: theme.COLORS.BLACK,
    shadowOpacity: 0.2,
    elevation: 2
  },
  container: {
    margin: 20,
    paddingVertical: 20
  },
  title: {
    overflow: 'visible',
    marginBottom: 5,
    paddingVertical: 2,
    fontFamily: 'OpenSans-Bold',
    fontSize: 24,
    lineHeight: 24
  },
  message: {
    fontFamily: 'OpenSans',
    fontSize: 16,
    lineHeight: 16
  },
  contentWrapper: {
    marginTop: 20,
    width: '100%',
    display: 'flex',
    alignItems: 'center'
  }
});

export default Toast;
