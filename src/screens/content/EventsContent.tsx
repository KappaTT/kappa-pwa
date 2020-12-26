import React from 'react';
import { StyleSheet, SectionList, RefreshControl, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Placeholder, PlaceholderLine, Fade } from 'rn-placeholder';
import { useSafeArea } from 'react-native-safe-area-context';
import moment from 'moment';
import { useIsFocused, NavigationProp } from '@react-navigation/native';

import { theme } from '@constants';
import { TRedux } from '@reducers';
import { _kappa } from '@reducers/actions';
import { Block, Header, EndCapButton, EndCapIconButton, Text, Icon } from '@components';
import { HeaderHeight, isEmpty, HORIZONTAL_PADDING } from '@services/utils';
import { log } from '@services/logService';
import { TEvent } from '@backend/kappa';
import { hasValidCheckIn, getEventById, shouldLoad } from '@services/kappaService';

const EventSkeleton: React.FC = () => {
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
  navigation: NavigationProp<any, 'Events'>;
}> = ({ navigation }) => {
  const isFocused = useIsFocused();

  const user = useSelector((state: TRedux) => state.auth.user);
  const loadHistory = useSelector((state: TRedux) => state.kappa.loadHistory);
  const records = useSelector((state: TRedux) => state.kappa.records);
  const isGettingEvents = useSelector((state: TRedux) => state.kappa.isGettingEvents);
  const getEventsError = useSelector((state: TRedux) => state.kappa.getEventsError);
  const isGettingDirectory = useSelector((state: TRedux) => state.kappa.isGettingDirectory);
  const getDirectoryError = useSelector((state: TRedux) => state.kappa.getDirectoryError);
  const isGettingAttendance = useSelector((state: TRedux) => state.kappa.isGettingAttendance);
  const getAttendanceError = useSelector((state: TRedux) => state.kappa.getAttendanceError);
  const isGettingExcuses = useSelector((state: TRedux) => state.kappa.isGettingExcuses);
  const getExcusesError = useSelector((state: TRedux) => state.kappa.getExcusesError);
  const events = useSelector((state: TRedux) => state.kappa.events);
  const eventSections = useSelector((state: TRedux) => state.kappa.eventSections);
  const upcomingSections = useSelector((state: TRedux) => state.kappa.upcomingSections);
  const editingEventId = useSelector((state: TRedux) => state.kappa.editingEventId);
  const getEventsErrorMessage = useSelector((state: TRedux) => state.kappa.getEventsErrorMessage);

  const [refreshing, setRefreshing] = React.useState<boolean>(
    isGettingEvents || isGettingDirectory || isGettingAttendance
  );
  const [showing, setShowing] = React.useState<'Full Year' | 'Upcoming'>('Upcoming');
  const [isShowingEventSearch, setIsShowingEventSearch] = React.useState<boolean>(false);

  const dispatch = useDispatch();
  const dispatchGetEvents = React.useCallback(() => dispatch(_kappa.getEvents(user)), [dispatch, user]);
  const dispatchGetMyAttendance = React.useCallback(
    (overwrite: boolean = false) => dispatch(_kappa.getMyAttendance(user, overwrite)),
    [dispatch, user]
  );
  const dispatchGetDirectory = React.useCallback(() => dispatch(_kappa.getDirectory(user)), [dispatch, user]);
  const dispatchGetExcuses = React.useCallback(() => dispatch(_kappa.getExcuses(user)), [dispatch, user]);
  const dispatchSelectEvent = React.useCallback((eventId: string) => dispatch(_kappa.selectEvent(eventId)), [dispatch]);
  const dispatchEditNewEvent = React.useCallback(() => dispatch(_kappa.editNewEvent()), [dispatch]);
  const dispatchSaveEditEvent = React.useCallback(
    (event: Partial<TEvent>, eventId?: string) => dispatch(_kappa.saveEditEvent(user, event, eventId)),
    [dispatch, user]
  );
  const dispatchCancelEditEvent = React.useCallback(() => dispatch(_kappa.cancelEditEvent()), [dispatch]);

  const insets = useSafeArea();

  const scrollRef = React.useRef(undefined);

  const loadData = React.useCallback(
    (force: boolean) => {
      if (!isGettingEvents && (force || (!getEventsError && shouldLoad(loadHistory, 'events')))) dispatchGetEvents();
      if (!isGettingDirectory && (force || (!getDirectoryError && shouldLoad(loadHistory, 'directory'))))
        dispatchGetDirectory();
      if (!isGettingAttendance && (force || (!getAttendanceError && shouldLoad(loadHistory, `user-${user.email}`))))
        dispatchGetMyAttendance(force);
      if (!isGettingExcuses && (force || (!getExcusesError && shouldLoad(loadHistory, 'excuses'))))
        dispatchGetExcuses();
    },
    [
      isGettingEvents,
      getEventsError,
      loadHistory,
      dispatchGetEvents,
      isGettingDirectory,
      getDirectoryError,
      dispatchGetDirectory,
      isGettingAttendance,
      getAttendanceError,
      user.email,
      dispatchGetMyAttendance,
      isGettingExcuses,
      getExcusesError,
      dispatchGetExcuses
    ]
  );

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    loadData(true);
  }, [loadData]);

  const toggleShowing = React.useCallback(() => {
    if (
      (showing === 'Upcoming' && upcomingSections.length > 0) ||
      (showing === 'Full Year' && eventSections.length > 0)
    ) {
      scrollRef?.current?.scrollToLocation({
        animated: false,
        sectionIndex: 0,
        itemIndex: 0
      });
    }

    setShowing(showing === 'Upcoming' ? 'Full Year' : 'Upcoming');
  }, [showing, eventSections, upcomingSections]);

  React.useEffect(() => {
    if (!isGettingEvents && !isGettingDirectory && !isGettingAttendance) {
      setRefreshing(false);
    }
  }, [isGettingEvents, isGettingDirectory, isGettingAttendance]);

  React.useEffect(() => {
    if (isFocused && user.sessionToken) {
      loadData(false);
    }
  }, [isFocused, loadData, user.sessionToken]);

  const keyExtractor = React.useCallback((item: TEvent) => item._id, []);

  const renderSectionHeader = ({ section: { title, data } }) => {
    return (
      <Block style={styles.sectionHeaderContainer}>
        <Text style={styles.sectionHeaderText}>{moment(title).format('ddd LL')}</Text>
      </Block>
    );
  };

  const renderItem = ({ item }: { item: TEvent }) => {
    return (
      <React.Fragment>
        <TouchableOpacity onPress={() => dispatchSelectEvent(item._id)}>
          <Block style={styles.eventContainer}>
            <Block style={styles.eventHeader}>
              <Text style={styles.eventTitle}>{item.title}</Text>
              <Text style={styles.eventDate}>{moment(item.start).format('h:mm A')}</Text>

              {item.mandatory && (
                <Icon
                  style={styles.mandatoryIcon}
                  family="Feather"
                  name="alert-circle"
                  size={16}
                  color={theme.COLORS.PRIMARY}
                />
              )}

              {hasValidCheckIn(records, user.email, item._id) && (
                <Icon
                  style={styles.checkIcon}
                  family="Feather"
                  name="check"
                  size={16}
                  color={theme.COLORS.PRIMARY_GREEN}
                />
              )}
            </Block>

            <Block style={styles.eventDescriptionWrapper}>
              <Text style={styles.eventDescription}>{item.description}</Text>
            </Block>
          </Block>
        </TouchableOpacity>

        <Block style={styles.separator} />
      </React.Fragment>
    );
  };

  return (
    <Block flex>
      <Header title="Events" leftButton={<EndCapButton direction="left" label={showing} onPress={toggleShowing} />} />

      <Block
        style={[
          styles.wrapper,
          {
            top: insets.top + HeaderHeight
          }
        ]}
      >
        {isGettingEvents && eventSections.length === 0 ? (
          <Block style={styles.loadingContainer}>
            <EventSkeleton />
            <Block style={styles.separator} />
            <EventSkeleton />
            <Block style={styles.separator} />
            <EventSkeleton />
            <Block style={styles.separator} />
            <EventSkeleton />
            <Block style={styles.separator} />
            <EventSkeleton />
          </Block>
        ) : (
          <SectionList
            ref={(ref) => (scrollRef.current = ref)}
            sections={showing === 'Upcoming' ? upcomingSections : eventSections}
            keyExtractor={keyExtractor}
            renderSectionHeader={renderSectionHeader}
            renderItem={renderItem}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            ListEmptyComponent={
              <React.Fragment>
                <Text style={styles.pullToRefresh}>Pull to refresh</Text>
                <Text style={styles.errorMessage}>{getEventsErrorMessage || 'No upcoming events'}</Text>
              </React.Fragment>
            }
            onScrollToIndexFailed={() => {}}
          />
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
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingVertical: 16,
    backgroundColor: theme.COLORS.WHITE
  },
  container: {
    display: 'flex',
    justifyContent: 'center'
  },
  sectionHeaderContainer: {
    backgroundColor: theme.COLORS.WHITE
  },
  sectionHeaderText: {
    marginTop: 4,
    marginBottom: 8,
    marginLeft: HORIZONTAL_PADDING,
    fontFamily: 'OpenSans-Bold',
    fontSize: 17
  },
  separator: {
    marginHorizontal: HORIZONTAL_PADDING,
    marginBottom: 16,
    borderBottomColor: theme.COLORS.LIGHT_BORDER,
    borderBottomWidth: 1
  },
  eventContainer: {
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingTop: 8,
    paddingBottom: 16
  },
  eventHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap'
  },
  eventTitle: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 13
  },
  eventDate: {
    marginLeft: 8,
    fontFamily: 'OpenSans',
    fontSize: 13,
    color: theme.COLORS.DARK_GRAY
  },
  mandatoryIcon: {
    marginLeft: 8
  },
  checkIcon: {
    marginLeft: 8
  },
  eventDescriptionWrapper: {
    marginTop: 8,
    marginBottom: 12
  },
  eventDescription: {
    fontFamily: 'OpenSans',
    fontSize: 15
  },
  pullToRefresh: {
    marginTop: '50%',
    textAlign: 'center',
    fontFamily: 'OpenSans-SemiBold'
  },
  errorMessage: {
    textAlign: 'center',
    fontFamily: 'OpenSans'
  }
});

export { EventSkeleton };

export default EventsContent;
