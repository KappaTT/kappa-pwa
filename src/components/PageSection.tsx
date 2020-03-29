import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { theme } from '@constants';
import Block from '@components/Block';
import Text from '@components/Text';

const PageSection: React.FC<{
  title: string;
  showViewAll?: boolean;
  count?: number;
  onPressViewAll?(): void;
}> = ({ title, onPressViewAll = () => {}, showViewAll = false, count = -1, children }) => {
  return (
    <Block style={styles.wrapper}>
      <Block style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Block>
          {(showViewAll || count >= 0) && (
            <TouchableOpacity style={styles.rightBlock} onPress={onPressViewAll}>
              {showViewAll && <Text style={styles.viewAllText}>View All</Text>}
              {count >= 0 && (
                <Block style={styles.countBlock}>
                  <Text style={styles.countText}>{count}</Text>
                </Block>
              )}
            </TouchableOpacity>
          )}
        </Block>
      </Block>
      {children}
    </Block>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 20
  },
  header: {
    height: 20,
    marginVertical: 12,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  title: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 12,
    color: theme.COLORS.GRAY
  },
  rightBlock: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  viewAllText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 10,
    color: theme.COLORS.GRAY,
    marginRight: 8
  },
  countBlock: {
    width: 56,
    height: '100%',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: theme.COLORS.GRAY,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  countText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 12,
    color: theme.COLORS.GRAY
  }
});

export default PageSection;
