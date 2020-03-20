import React from 'react';
import { StyleSheet, Dimensions, KeyboardAvoidingView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import { TRedux } from '@reducers';
import { _auth } from '@reducers/actions';
import { theme } from '@constants';
import { Block, Text } from '@components';

const { width, height } = Dimensions.get('screen');

const OnboardingPage: React.FC<{
  onRequestClose(): void;
}> = ({ onRequestClose }) => {
  const dispatch = useDispatch();

  const renderBackground = () => {
    return <Block style={styles.bg} />;
  };

  const renderContent = () => {
    return (
      <KeyboardAvoidingView behavior="position" enabled>
        <Block style={styles.fg}>
          <Text>Let's finish setting up</Text>
        </Block>
      </KeyboardAvoidingView>
    );
  };

  return (
    <Block flex>
      {renderBackground()}
      {renderContent()}
    </Block>
  );
};

const styles = StyleSheet.create({
  bg: {
    width: width,
    height: height,
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  fg: {
    position: 'absolute',
    height: height * 0.67,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.COLORS.WHITE,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20
  }
});

export default OnboardingPage;
