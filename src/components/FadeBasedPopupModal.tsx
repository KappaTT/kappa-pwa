import React from 'react';
import { StyleSheet, TouchableOpacity, Animated, Easing, Dimensions, Text } from 'react-native';

import { theme } from '@constants';
import Block from '@components/Block';
import FadeModal from '@components/FadeModal';
import Interceptor from '@components/Interceptor';
import Icon from '@components/Icon';
import KeyboardDismissView from '@components/KeyboardDismissView';

const { width, height } = Dimensions.get('screen');

const FadeBasedPopupModal: React.FC<{
  title: string;
  subtitle?: string;
  allowClose?: boolean;
  shouldClose?: boolean;
  onRequestClose(): void;
  children?: React.ReactNode;
}> = ({ title, subtitle, allowClose = true, shouldClose = false, onRequestClose, children }) => {
  const heightBase = new Animated.Value(height * 0.05);
  const [progress, setProgress] = React.useState<Animated.Value>(new Animated.Value(1));

  const handleClose = () => {
    if (allowClose) {
      Animated.timing(progress, {
        toValue: 1,
        easing: Easing.out(Easing.poly(4)),
        duration: 400
      }).start(() => {
        onRequestClose();
      });
    }
  };

  React.useEffect(() => {
    Animated.timing(progress, {
      toValue: 0,
      easing: Easing.out(Easing.poly(4)),
      duration: 400
    }).start();
  }, []);

  React.useEffect(() => {
    if (shouldClose) {
      handleClose();
    }
  }, [shouldClose]);

  return (
    <FadeModal transparent={true} visible={true} onRequestClose={handleClose}>
      <Interceptor onPress={handleClose}>
        <Block style={styles.bg} />
      </Interceptor>

      <Animated.View
        style={{
          position: 'absolute',
          top: Animated.multiply(heightBase, progress),
          width: width,
          height: height,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
        pointerEvents="none"
      >
        <KeyboardDismissView>
          <Block style={styles.wrapper}>
            <Block style={styles.container}>
              <Text style={styles.title}>{title}</Text>
              {typeof subtitle === 'string' && <Text style={styles.subtitle}>{subtitle}</Text>}
              <Block style={styles.contentWrapper}>{children}</Block>
            </Block>
          </Block>
        </KeyboardDismissView>
      </Animated.View>
    </FadeModal>
  );
};

const styles = StyleSheet.create({
  bg: {
    width: width,
    height: height,
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
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
    backgroundColor: 'white',
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
  }
});

export default FadeBasedPopupModal;
