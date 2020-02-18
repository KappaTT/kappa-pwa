import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';

import { theme } from '../constants';
import Block from './Block';
import Text from './Text';
import GradientView from './GradientView';

const HorizontalLabel: React.SFC<{
  index: number;
  total: number;
  units: number;
  label: string;
}> = ({ index, total, units, label }) => {
  let labelStyle: any = styles.middleLabel;

  if (index === 0) {
    labelStyle = styles.leftLabel;
  } else if (index === total - 1) {
    labelStyle = styles.rightLabel;
  }

  return (
    <Block style={styles.labelWrapper}>
      <Text style={labelStyle}>
        {units} {label}
      </Text>
    </Block>
  );
};

const HorizontalBar: React.SFC<{
  percent: number;
  gradient: Array<string>;
  wrapperStyle: ViewStyle;
}> = ({ percent, gradient, wrapperStyle }) => {
  return (
    <Block style={{ width: `${percent}%`, borderColor: theme.COLORS.WHITE, borderWidth: 1.5 }}>
      <Block style={wrapperStyle}>
        <GradientView style={styles.bar} colors={gradient} />
      </Block>
    </Block>
  );
};

const HorizontalStackedBar: React.SFC<{
  data: Array<{
    units: number;
    label: string;
    gradient: Array<string>;
  }>;
}> = ({ data }) => {
  let totalUnits = 0;
  data.map((section: any) => {
    totalUnits += section.units;
  });

  const renderLabels = () => {
    return data.map((section: any, sectionIndex: number) => {
      return (
        <HorizontalLabel
          key={sectionIndex}
          index={sectionIndex}
          total={data.length}
          units={section.units}
          label={section.label}
        />
      );
    });
  };

  const renderBars = () => {
    let units = 0;

    return data.map((section: any, sectionIndex: number) => {
      units += section.units;

      let leftSide = false;
      let rightSide = false;

      if (sectionIndex === 0 || units === section.units) {
        leftSide = true;
      }

      if (units === totalUnits) {
        rightSide = true;
      }

      let wrapperStyle = styles.middleBarWrapper;

      if (leftSide && rightSide) {
        wrapperStyle = styles.fullBarWrapper;
      } else if (leftSide) {
        wrapperStyle = styles.leftBarWrapper;
      } else if (rightSide) {
        wrapperStyle = styles.rightBarWrapper;
      }

      return (
        <HorizontalBar
          key={sectionIndex}
          percent={(section.units / totalUnits) * 100}
          gradient={section.gradient}
          wrapperStyle={wrapperStyle}
        />
      );
    });
  };

  return (
    <Block style={styles.wrapper}>
      <Block style={styles.labelsWrapper}>{renderLabels()}</Block>
      <Block style={styles.barsWrapper}>{renderBars()}</Block>
    </Block>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%'
  },
  labelsWrapper: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  labelWrapper: {
    flexBasis: 0,
    flexGrow: 1
  },
  leftLabel: {
    fontFamily: 'Montserrat',
    fontSize: 10,
    color: theme.COLORS.DARK_GRAY,
    textAlign: 'left'
  },
  middleLabel: {
    fontFamily: 'Montserrat',
    fontSize: 10,
    color: theme.COLORS.DARK_GRAY,
    textAlign: 'center'
  },
  rightLabel: {
    fontFamily: 'Montserrat',
    fontSize: 10,
    color: theme.COLORS.DARK_GRAY,
    textAlign: 'right'
  },
  barsWrapper: {
    display: 'flex',
    flexDirection: 'row'
  },
  leftBarWrapper: {
    width: '100%',
    height: 10,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    overflow: 'hidden'
  },
  middleBarWrapper: {
    width: '100%',
    height: 10,
    overflow: 'hidden'
  },
  rightBarWrapper: {
    width: '100%',
    height: 10,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    overflow: 'hidden'
  },
  fullBarWrapper: {
    width: '100%',
    height: 10,
    borderRadius: 5,
    overflow: 'hidden'
  },
  bar: {
    flex: 1
  }
});

export default HorizontalStackedBar;
