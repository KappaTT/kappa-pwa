import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { theme } from '@constants';
import Block from '@components/Block';
import Text from '@components/Text';
import Icon from '@components/Icon';
import GradientView from '@components/GradientView';

const GradientBlobButton: React.FC<{
  alarmCount: number;
  title: string;
  subtitle: string;
  gradient: string[];
  onPress(): void;
}> = ({ alarmCount, title, subtitle, gradient, onPress }) => {
  return (
    <Block style={styles.wrapper}>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <GradientView style={styles.blob} colors={gradient}>
          <Block style={styles.alarmOverlay}>
            <Icon
              style={styles.alarmIcon}
              family="Ionicons"
              name="md-notifications"
              color={theme.COLORS.WHITE}
              size={11}
            />
            <Text style={styles.alarmCount}>{alarmCount}</Text>
          </Block>
          <Block style={styles.textArea}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </Block>
        </GradientView>
      </TouchableOpacity>
    </Block>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 5,
    marginVertical: 5
  },
  button: {
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 16,
    shadowColor: theme.COLORS.BLACK,
    shadowOpacity: 0.2,
    elevation: 2
  },
  blob: {
    width: 100,
    height: 140,
    borderRadius: 16,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  alarmIcon: {
    marginLeft: 7,
    marginRight: 4
  },
  alarmOverlay: {
    marginTop: 10,
    marginLeft: 10,
    width: 40,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  alarmCount: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 11,
    color: theme.COLORS.WHITE
  },
  textArea: {
    marginLeft: 8,
    marginBottom: 16
  },
  title: {
    marginRight: 4,
    fontFamily: 'OpenSans-Bold',
    fontSize: 20,
    color: theme.COLORS.WHITE
  },
  subtitle: {
    fontFamily: 'OpenSans',
    fontSize: 13,
    color: theme.COLORS.WHITE
  }
});

export default GradientBlobButton;
