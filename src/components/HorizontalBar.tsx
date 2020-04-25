import React from 'react';
import { StyleSheet } from 'react-native';

import { theme } from '@constants';
import Block from '@components/Block';
import Text from '@components/Text';
import GradientView from '@components/GradientView';

const HorizontalBar: React.FC<{
  label: string;
  units: number;
  total?: number;
  gradient?: Array<string>;
  rightHandLabel?: string;
}> = ({ label, units, total = 100, gradient = undefined, rightHandLabel = undefined }) => {
  const percent = (units / total) * 100;

  return (
    <Block style={styles.wrapper}>
      <Block style={styles.labelWrapper}>
        <Text style={styles.label}>{label}</Text>
        {rightHandLabel && <Text style={styles.rightHandLabel}>{rightHandLabel}</Text>}
      </Block>
      <Block style={styles.barContainer}>
        {percent > 0 && (
          <Block style={{ width: `${percent}%` }}>
            <Block style={styles.barWrapper}>
              {gradient ? (
                <GradientView style={styles.bar} colors={gradient} />
              ) : percent > 67 ? (
                <GradientView style={styles.bar} colors={theme.GRADIENT.RED} />
              ) : percent > 33 ? (
                <GradientView style={styles.bar} colors={theme.GRADIENT.YELLOW} />
              ) : (
                <GradientView style={styles.bar} colors={theme.GRADIENT.BLUE} />
              )}
            </Block>
          </Block>
        )}
      </Block>
    </Block>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%'
  },
  labelWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  label: {
    fontFamily: 'OpenSans',
    fontSize: 12,
    color: theme.COLORS.GRAY_BLUE
  },
  rightHandLabel: {
    fontFamily: 'OpenSans',
    fontSize: 12,
    color: theme.COLORS.GRAY
  },
  barContainer: {
    width: '100%',
    height: 10,
    borderRadius: 5,
    marginTop: 2,
    marginBottom: 10,
    backgroundColor: theme.COLORS.LIGHT_GRAY
  },
  barWrapper: {
    position: 'absolute',
    top: -3,
    left: 0,
    width: '100%',
    height: 16,
    borderRadius: 8,
    borderColor: theme.COLORS.WHITE,
    borderWidth: 3,
    overflow: 'hidden'
  },
  bar: {
    flex: 1
  }
});

export default HorizontalBar;
