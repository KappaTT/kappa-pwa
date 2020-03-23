import React from 'react';
import { StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Placeholder, PlaceholderLine, Fade } from 'rn-placeholder';
import { useSafeArea } from 'react-native-safe-area-context';

import { theme } from '@constants';
import { Block, Text } from '@components';
import { NavigationTypes } from '@types';
import { TabBarHeight } from '@services/utils';

const EventSkeleton: React.FC<{}> = ({}) => {
  return (
    <Block style={styles.skeletonWrapper}>
      <Placeholder Animation={Fade}>
        <PlaceholderLine />
        <PlaceholderLine />
        <PlaceholderLine />
        <PlaceholderLine width={30} />
      </Placeholder>
    </Block>
  );
};

const EventsContent: React.FC<{
  navigation: NavigationTypes.ParamType;
}> = ({ navigation }) => {
  const insets = useSafeArea();

  return (
    <Block flex>
      <Block
        style={{
          top: insets.top,
          bottom: TabBarHeight + insets.bottom
        }}
      >
        <ScrollView refreshControl={<RefreshControl refreshing={false} onRefresh={() => {}} />}>
          <Block style={styles.container}>
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
        </ScrollView>
      </Block>
    </Block>
  );
};

const styles = StyleSheet.create({
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
