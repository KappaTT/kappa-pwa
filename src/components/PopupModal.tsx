import React from 'react';
import { StyleSheet, TouchableOpacity, Animated, Easing, Dimensions, KeyboardAvoidingView, Text } from 'react-native';

import { theme } from '@constants';
import Block from '@components/Block';
import Icon from '@components/Icon';
import CloseButton from '@components/CloseButton';
import KeyboardDismissView from '@components/KeyboardDismissView';

const { width, height } = Dimensions.get('screen');

const PopupModal: React.FC<{
  title: string;
  subtitle?: string;
  allowClose?: boolean;
  shouldClose?: boolean;
  showClose?: boolean;
  onPressClose(): void;
  children?: React.ReactNode;
}> = ({ title, subtitle, allowClose = true, shouldClose = false, showClose = false, onPressClose, children }) => {
  const heightBase = new Animated.Value(height * 0.05);
  const backgroundBase = new Animated.Value(0.2);
  const opacityBase = new Animated.Value(1);
  const [progress, setProgress] = React.useState<Animated.Value>(new Animated.Value(1));

  const handleClose = () => {
    Animated.timing(progress, {
      toValue: 1,
      easing: Easing.out(Easing.poly(4)),
      duration: 400,
      useNativeDriver: true
    }).start(() => {
      onPressClose();
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

        <KeyboardAvoidingView behavior="padding" enabled>
          <KeyboardDismissView>
            <Block style={styles.wrapper}>
              <Block style={styles.container}>
                {showClose && (
                  <Block style={styles.closeWrapper}>
                    <CloseButton
                      onPress={() => {
                        allowClose && handleClose();
                      }}
                    />
                  </Block>
                )}

                <Text style={styles.title}>{title}</Text>
                {typeof subtitle === 'string' && <Text style={styles.subtitle}>{subtitle}</Text>}
                <Block style={styles.contentWrapper}>{children}</Block>
              </Block>
            </Block>
          </KeyboardDismissView>
        </KeyboardAvoidingView>
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
  subtitle: {
    fontFamily: 'OpenSans',
    fontSize: 16,
    lineHeight: 16
  },
  contentWrapper: {
    marginTop: 20
  },
  closeWrapper: {
    position: 'absolute',
    right: 0,
    top: 0
  }
});

export default PopupModal;
