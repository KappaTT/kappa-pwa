import React from 'react';
import { StyleSheet, SectionList, RefreshControl, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Placeholder, PlaceholderLine, Fade } from 'rn-placeholder';
import { useSafeArea } from 'react-native-safe-area-context';
import moment from 'moment';

import { theme } from '@constants';
import { TRedux } from '@reducers';
import { _kappa } from '@reducers/actions';
import { Block, Header, EndCapButton, Text, Icon, SlideModal } from '@components';
import { EditEventPage } from '@pages';
import { NavigationTypes } from '@types';
import { HeaderHeight, isEmpty } from '@services/utils';
import { log } from '@services/logService';
import { TEvent, TPoint } from '@backend/kappa';
import { hasValidCheckIn, getEventById, shouldLoad } from '@services/kappaService';

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
  const loadHistory = useSelector((state: TRedux) => state.kappa.loadHistory);
  const records = useSelector((state: TRedux) => state.kappa.records);
  const gettingEvents = useSelector((state: TRedux) => state.kappa.gettingEvents);
  const gettingDirectory = useSelector((state: TRedux) => state.kappa.gettingDirectory);
  const gettingAttendance = useSelector((state: TRedux) => state.kappa.gettingAttendance);
  const events = useSelector((state: TRedux) => state.kappa.events);
  const eventsByDate = useSelector((state: TRedux) => state.kappa.eventsByDate);
  const editingEventId = useSelector((state: TRedux) => state.kappa.editingEventId);

  const [refreshing, setRefreshing] = React.useState<boolean>(gettingEvents || gettingDirectory || gettingAttendance);

  const dispatch = useDispatch();
  const dispatchGetEvents = React.useCallback(() => dispatch(_kappa.getEvents(user)), [dispatch, user]);
  const dispatchGetMyAttendance = React.useCallback(
    (overwrite: boolean = false) => dispatch(_kappa.getMyAttendance(user, overwrite)),
    [dispatch, user]
  );
  const dispatchGetDirectory = React.useCallback(() => dispatch(_kappa.getDirectory(user)), [dispatch, user]);
  const dispatchSelectEvent = React.useCallback((eventId: string) => dispatch(_kappa.selectEvent(eventId)), [dispatch]);
  const dispatchEditNewEvent = React.useCallback(() => dispatch(_kappa.editNewEvent()), [dispatch]);
  const dispatchSaveEditEvent = React.useCallback(
    (event: Partial<TEvent>, points: Array<Partial<TPoint>>) => dispatch(_kappa.saveEditEvent(user, event, points)),
    [dispatch, user]
  );
  const dispatchCancelEditEvent = React.useCallback(() => dispatch(_kappa.cancelEditEvent()), [dispatch]);

  const insets = useSafeArea();

  const scrollRef = React.useRef(undefined);

  const loadData = React.useCallback(
    (force: boolean) => {
      if (user.sessionToken) {
        if (force || shouldLoad(loadHistory, 'events')) dispatchGetEvents();
        if (force || shouldLoad(loadHistory, 'directory')) dispatchGetDirectory();
        if (force || shouldLoad(loadHistory, `user-${user.email}`)) dispatchGetMyAttendance(force);
      } else {
        log('Bad user request');
      }
    },
    [user, loadHistory]
  );

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    setTimeout(() => loadData(true), 500);
  }, [user, refreshing]);

  React.useEffect(() => {
    if (!gettingEvents && !gettingDirectory && !gettingAttendance) {
      setRefreshing(false);
    }
  }, [gettingEvents, gettingDirectory, gettingAttendance]);

  React.useEffect(() => {
    if (user?.sessionToken) {
      loadData(false);
    }
  }, [user]);

  const keyExtractor = (item: TEvent, index) => {
    return `${item.id}-${index}`;
  };

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
        <TouchableOpacity onPress={() => dispatchSelectEvent(item.id)}>
          <Block style={styles.eventContainer}>
            <Block style={styles.eventHeader}>
              <Text style={styles.eventTitle}>{item.title}</Text>
              <Text style={styles.eventDate}>{moment(item.start).format('h:mm A')}</Text>

              {item.mandatory === 1 && (
                <Icon
                  style={styles.mandatoryIcon}
                  family="Feather"
                  name="alert-circle"
                  size={16}
                  color={theme.COLORS.PRIMARY}
                />
              )}

              {hasValidCheckIn(records, user.email, item.id) && (
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
      <Header
        title="Upcoming Events"
        rightButton={user.privileged === true && <EndCapButton label="New Event" onPress={dispatchEditNewEvent} />}
      />

      <Block
        style={[
          styles.wrapper,
          {
            top: insets.top + HeaderHeight
          }
        ]}
      >
        {gettingEvents && isEmpty(eventsByDate) ? (
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
            ref={ref => (scrollRef.current = ref)}
            sections={Object.entries(eventsByDate)
              .sort((a, b) => (moment(a[0]).isBefore(moment(b[0])) ? -1 : 1))
              .map(entry => ({ title: entry[0], data: entry[1] }))}
            keyExtractor={keyExtractor}
            renderSectionHeader={renderSectionHeader}
            renderItem={renderItem}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          />
        )}
      </Block>

      <SlideModal visible={editingEventId !== ''}>
        <EditEventPage
          initialEvent={editingEventId === 'NEW' ? null : getEventById(events, editingEventId)}
          onPressBack={dispatchCancelEditEvent}
          onPressSave={dispatchSaveEditEvent}
        />
      </SlideModal>
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
  sectionHeaderContainer: {
    backgroundColor: theme.COLORS.WHITE
  },
  sectionHeaderText: {
    marginTop: 4,
    marginBottom: 8,
    marginLeft: 24,
    fontFamily: 'OpenSans-Bold',
    fontSize: 17
  },
  separator: {
    marginHorizontal: 24,
    marginBottom: 16,
    borderBottomColor: theme.COLORS.LIGHT_BORDER,
    borderBottomWidth: 1
  },
  eventContainer: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 16
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
  }
});

export { EventSkeleton };

export default EventsContent;
