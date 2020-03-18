import React from 'react';
import { StyleSheet } from 'react-native';

import { theme } from '@constants';
import Block from '@components/Block';

const Badge: React.FC<{
  active: boolean;
  fab?: boolean;
  children?: React.ReactNode;
}> = ({ active, fab = false, children }) => {
  if (!active) return <React.Fragment />;

  const renderBasic = () => <Block style={styles.badge} />;

  const renderChildren = () => {
    return children ? children : renderBasic();
  };

  if (fab) {
    return <Block style={styles.fabWrapper}>{renderChildren()}</Block>;
  }

  return <Block style={styles.wrapper}>{renderChildren()}</Block>;
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: -2,
    right: -2
  },
  fabWrapper: {
    position: 'absolute',
    top: 2,
    right: 2
  },
  badge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.COLORS.ROYALTY
  }
});

export default Badge;
