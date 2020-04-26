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
  timer?: number;
  allowClose?: boolean;
  shouldClose?: boolean;
  showClose?: boolean;
  onDoneClosing(): void;
  children?: React.ReactNode;
}> = ({
  title = '',
  message = '',
  timer = -1,
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
      duration: 200,
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

  React.useEffect(() => {
    if (timer > 0) {
      const t = setTimeout(handleClose, timer);
      return () => clearTimeout(t);
    }
  }, [timer]);

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
    width: width - 40,
    borderRadius: 8,
    backgroundColor: theme.COLORS.WHITE
  },
  container: {
    marginTop: 20,
    marginHorizontal: 20
  },
  title: {
    overflow: 'visible',
    marginBottom: 5,
    fontFamily: 'OpenSans-Bold',
    fontSize: 18
  },
  message: {
    fontFamily: 'OpenSans',
    fontSize: 13
  },
  contentWrapper: {
    marginTop: 20,
    width: '100%',
    display: 'flex',
    alignItems: 'center'
  }
});

export default Toast;
