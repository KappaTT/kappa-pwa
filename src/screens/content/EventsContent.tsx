import React from 'react';
import { StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Placeholder, PlaceholderLine, Fade } from 'rn-placeholder';
import { useSafeArea } from 'react-native-safe-area-context';
import moment from 'moment';

import { theme } from '@constants';
import { TRedux } from '@reducers';
import { Block, Header, Text } from '@components';
import { NavigationTypes } from '@types';
import { TabBarHeight, HeaderHeight } from '@services/utils';
import { getEvents } from '@reducers/actions/kappa';
import { log } from '@services/logService';

const EventSkeleton: React.FC<{}> = ({}) => {
  return (
    <Block style={styles.skeletonWrapper}>
      <Placeholder Animation={Fade}>
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
  const user = useSelector((state: TRedux) => state.auth.user);
  const gettingEvents = useSelector((state: TRedux) => state.kappa.gettingEvents);
  const getEventsError = useSelector((state: TRedux) => state.kappa.getEventsError);
  const events = useSelector((state: TRedux) => state.kappa.events);

  const [refreshing, setRefreshing] = React.useState<boolean>(gettingEvents);

  const dispatch = useDispatch();
  const dispatchGetEvents = React.useCallback(() => dispatch(getEvents(user)), [user]);

  const insets = useSafeArea();

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    setTimeout(dispatchGetEvents, 500);
  }, [refreshing]);

  React.useEffect(() => {
    if (!gettingEvents) {
      setRefreshing(false);
    }
  }, [gettingEvents]);

  React.useEffect(() => {
    if (user?.sessionToken) {
      dispatchGetEvents();
    }
  }, [user]);

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
        {gettingEvents && events.length === 0 ? (
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
          <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
            <Block style={styles.container}>
              {events.map(event => (
                <React.Fragment key={event.id}>
                  <TouchableOpacity onPress={() => log(event)}>
                    <Block style={styles.eventContainer}>
                      <Block style={styles.eventHeader}>
                        <Text style={styles.eventTitle}>{event.title}</Text>
                        <Text style={styles.eventDate}>{moment(event.start).format('MM/DD hh:mm A')}</Text>
                      </Block>

                      <Block style={styles.eventDescriptionWrapper}>
                        <Text style={styles.eventDescription}>{event.description}</Text>
                      </Block>
                    </Block>
                  </TouchableOpacity>

                  <Block style={styles.eventSeparator} />
                </React.Fragment>
              ))}
            </Block>
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
  },
  eventContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16
  },
  eventHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 8
  },
  eventTitle: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 14
  },
  eventDate: {
    marginLeft: 8,
    fontFamily: 'OpenSans',
    fontSize: 14,
    color: theme.COLORS.DARK_GRAY
  },
  eventDescriptionWrapper: {
    marginTop: 8,
    marginBottom: 12
  },
  eventDescription: {
    fontFamily: 'OpenSans',
    fontSize: 17
  }
});

export { EventSkeleton };

export default EventsContent;
