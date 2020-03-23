import React from 'react';
import { StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Placeholder, PlaceholderLine, ShineOverlay } from 'rn-placeholder';
import { useSafeArea } from 'react-native-safe-area-context';

import { theme } from '@constants';
import { Block, Header, Text } from '@components';
import { NavigationTypes } from '@types';
import { TabBarHeight, HeaderHeight } from '@services/utils';

const EventSkeleton: React.FC<{}> = ({}) => {
  return (
    <Block style={styles.skeletonWrapper}>
      <Placeholder Animation={ShineOverlay}>
        <PlaceholderLine width={33} />
        <PlaceholderLine />
        <PlaceholderLine />
        <PlaceholderLine width={67} />
      </Placeholder>
    </Block>
  );
};

const EventsContent: React.FC<{
  navigation: NavigationTypes.ParamType;
}> = ({ navigation }) => {
  const insets = useSafeArea();

  const loading = true;

  return (
    <Block flex>
      <Header title="Upcoming Events" />

      <Block
        style={[
          styles.wrapper,
          {
            top: insets.top + HeaderHeight
          }
        ]}
      >
        {loading ? (
          <Block style={styles.loadingContainer}>
            <EventSkeleton />
            <Block style={styles.eventSeparator} />
            <EventSkeleton />
            <Block style={styles.eventSeparator} />
            <EventSkeleton />
            <Block style={styles.eventSeparator} />
            <EventSkeleton />
            <Block style={styles.eventSeparator} />
            <EventSkeleton />
          </Block>
        ) : (
          <ScrollView refreshControl={<RefreshControl refreshing={false} onRefresh={() => {}} />}>
            <Block style={styles.container}></Block>
          </ScrollView>
        )}
      </Block>
    </Block>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0
  },
  loadingContainer: {},
  skeletonWrapper: {
    marginHorizontal: 8,
    marginVertical: 4,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: theme.COLORS.WHITE
  },
  container: {
    display: 'flex',
    justifyContent: 'center'
  },
  eventSeparator: {
    marginHorizontal: 24,
    borderBottomColor: theme.COLORS.MAIN_GRAY,
    borderBottomWidth: 1
  }
});

export { EventSkeleton };

export default EventsContent;
