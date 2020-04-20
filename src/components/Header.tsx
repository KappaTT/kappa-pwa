import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';

import { theme } from '@constants';
import Block from '@components/Block';
import Text from '@components/Text';
import BackButton from '@components/BackButton';
import { HeaderHeight } from '@services/utils';

const Header: React.FC<{
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  leftButton?: React.ReactElement;
  rightButton?: React.ReactElement;
  onPressBackButton?(): void;
}> = ({ title = '', subtitle = '', showBackButton = false, leftButton, rightButton, onPressBackButton = () => {} }) => {
  const insets = useSafeArea();

  return (
    <Block style={styles.wrapper}>
      <Block
        style={[
          styles.header,
          {
            marginTop: insets.top
          }
        ]}
      >
        {showBackButton && <BackButton onPress={onPressBackButton} />}
        {!showBackButton && leftButton}

        <Block style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          {subtitle !== '' && <Text style={styles.subtitle}>{subtitle}</Text>}
        </Block>

        {rightButton}
      </Block>
    </Block>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: theme.COLORS.WHITE
  },
  header: {
    height: HeaderHeight,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  textContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontFamily: 'OpenSans',
    fontSize: 16
  },
  subtitle: {
    fontFamily: 'OpenSans',
    fontSize: 12,
    color: theme.COLORS.DARK_GRAY
  },
  rightButtonContainer: {}
});

export default Header;
