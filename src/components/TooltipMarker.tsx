import React from 'react';
import { StyleSheet } from 'react-native';
import { Marker, MarkerAnimated } from 'react-native-maps';

import { theme } from '../constants';
import { TLocationDict } from '../backend/map';
import Block from './Block';
import Text from './Text';
import Ghost from './Ghost';

export const renderStandaloneMarker = (title: string, subtitle: string, children?: React.ReactNode) => {
  return (
    <Ghost style={styles.wrapper}>
      <Ghost style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        {children}
      </Ghost>
      <Ghost style={styles.arrowDown} />
    </Ghost>
  );
};

const TooltipMarker: React.SFC<{
  coordinate: TLocationDict;
  width: number;
  title: string;
  subtitle: string;
  selected?: boolean;
  draggable?: boolean;
  children?: React.ReactNode;
  onPress(): void; // TODO: Marker may have a click event
  onDrag?(coord: TLocationDict): void;
}> = ({
  coordinate,
  width,
  title,
  subtitle,
  selected = false,
  draggable = false,
  onPress,
  onDrag = (coord: TLocationDict) => {},
  children = undefined
}) => {
  // TODO: check if Android needs Block to have { width: width }

  return (
    <Marker
      coordinate={coordinate}
      anchor={{ x: 0.5, y: 0.78 }}
      tracksViewChanges={false}
      draggable={draggable}
      onDragEnd={e => onDrag(e.nativeEvent.coordinate)}
      onPress={onPress}
    >
      <Block style={{ minWidth: width }}>
        <Block style={styles.wrapper}>
          <Block style={[styles.content, selected && styles.contentSelected]}>
            <Text style={[styles.title, selected && styles.textSelected]}>{title}</Text>
            <Text style={[styles.subtitle, selected && styles.textSelected]}>{subtitle}</Text>
            {children}
          </Block>
          <Block style={[styles.arrowDown, selected && styles.arrowDownSelected]} />
        </Block>
      </Block>
    </Marker>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: 'stretch',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.COLORS.ROYALTY,
    shadowOpacity: 0.5,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
    margin: 16
  },
  content: {
    alignSelf: 'stretch',
    backgroundColor: theme.COLORS.ROYALTY,
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 6,
    borderRadius: 4
  },
  contentSelected: {
    backgroundColor: theme.COLORS.WHITE
  },
  title: {
    fontFamily: 'Montserrat-Bold',
    color: 'white',
    fontSize: 12,
    lineHeight: 12
  },
  subtitle: {
    fontFamily: 'Montserrat',
    color: 'white',
    fontSize: 12,
    lineHeight: 12
  },
  textSelected: {
    color: theme.COLORS.ROYALTY
  },
  arrowDown: {
    width: 0,
    height: 0,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 6,
    borderColor: 'transparent',
    borderTopColor: theme.COLORS.ROYALTY,
    fontSize: 0,
    lineHeight: 0
  },
  arrowDownSelected: {
    borderTopColor: theme.COLORS.WHITE
  }
});

export default TooltipMarker;
