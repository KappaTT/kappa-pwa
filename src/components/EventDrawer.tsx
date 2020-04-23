import React from 'react';
import {
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
import { useSafeArea } from 'react-native-safe-area-context';
import moment from 'moment';
import { ProgressCircle } from 'react-native-svg-charts';

import { TRedux } from '@reducers';
import { _auth, _kappa } from '@reducers/actions';
import { log } from '@services/logService';
import {
  getAttendance,
  getExcuse,
  getEventRecordCounts,
  getMissedMandatoryByEvent,
  sortUserByName,
  prettyPoints,
  shouldLoad
} from '@services/kappaService';
import { theme } from '@constants';
import { TabBarHeight, isEmpty } from '@services/utils';
import { navigate } from '@navigation/NavigationService';
import { TEvent } from '@backend/kappa';
import { TUser } from '@backend/auth';
import Block from '@components/Block';
import Ghost from '@components/Ghost';
import Text from '@components/Text';
import RoundButton from '@components/RoundButton';
import Icon from '@components/Icon';
import Switch from '@components/Switch';

const { width, height } = Dimensions.get('screen');

const EventDrawer: React.FC<{}> = ({}) => {
  const user = useSelector((state: TRedux) => state.auth.user);
  const loadHistory = useSelector((state: TRedux) => state.kappa.loadHistory);
  const directory = useSelector((state: TRedux) => state.kappa.directory);
  const directorySize = useSelector((state: TRedux) => state.kappa.directorySize);
  const records = useSelector((state: TRedux) => state.kappa.records);
  const missedMandatory = useSelector((state: TRedux) => state.kappa.missedMandatory);
  const isGettingAttendance = useSelector((state: TRedux) => state.kappa.isGettingAttendance);
  const selectedEventId = useSelector((state: TRedux) => state.kappa.selectedEventId);
  const selectedEvent = useSelector((state: TRedux) => state.kappa.selectedEvent);
  const isDeletingEvent = useSelector((state: TRedux) => state.kappa.isDeletingEvent);

  const [refreshing, setRefreshing] = React.useState<boolean>(isGettingAttendance);
  const [readyToDelete, setReadyToDelete] = React.useState<boolean>(false);

  const dispatch = useDispatch();
  const dispatchGetAttendance = React.useCallback(
    (overwrite: boolean = false) => dispatch(_kappa.getEventAttendance(user, selectedEventId, overwrite)),
    [dispatch, user, selectedEventId]
  );
  const dispatchGetMyAttendance = React.useCallback(
    (overwrite: boolean = false) => dispatch(_kappa.getMyAttendance(user, overwrite)),
    [dispatch, user]
  );
  const dispatchUnselectEvent = React.useCallback(() => dispatch(_kappa.unselectEvent()), [dispatch]);
  const dispatchEditEvent = React.useCallback(() => dispatch(_kappa.editExistingEvent(selectedEventId)), [
    dispatch,
    selectedEventId
  ]);
  const dispatchDeleteEvent = React.useCallback(() => dispatch(_kappa.deleteEvent(user, selectedEvent)), [
    dispatch,
    user,
    selectedEvent
  ]);
  const dispatchCheckIn = React.useCallback(
    (excuse: boolean) => dispatch(_kappa.setCheckInEvent(selectedEventId, excuse)),
    [dispatch, selectedEventId]
  );

  const insets = useSafeArea();

  const sheetRef = React.useRef(undefined);
  const scrollRef = React.useRef(undefined);

  const sheetHeight = Math.max((height - insets.top) * 0.67 + insets.bottom, 600);

  const [snapPoint, setSnapPoint] = React.useState<number>(1);
  const [callbackNode, setCallbackNode] = React.useState(new Animated.Value(1));

  const backgroundOpacity = callbackNode.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 0]
  });

  const loadData = React.useCallback(
    (force: boolean) => {
      if (user.privileged) {
        if (force || shouldLoad(loadHistory, `event-${selectedEventId}`)) {
          dispatchGetAttendance(force);
        }

        setReadyToDelete(false);
      } else {
        if (force || shouldLoad(loadHistory, `user-${user.email}`)) {
          dispatchGetMyAttendance(force);
        }
      }
    },
    [user, loadHistory, selectedEventId]
  );

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    loadData(true);
  }, [user, selectedEventId, refreshing]);

  const snapTo = React.useCallback(
    newSnap => {
      sheetRef?.current?.snapTo(newSnap);
      sheetRef?.current?.snapTo(newSnap);
    },
    [sheetRef]
  );

  const onPressClose = React.useCallback(() => {
    snapTo(1);
  }, []);

  const onPressExcuse = React.useCallback(() => {
    dispatchCheckIn(true);
    navigate('CheckInStack', {});

    onPressClose();
  }, [selectedEventId]);

  const onPressCheckIn = React.useCallback(() => {
    dispatchCheckIn(false);
    navigate('CheckInStack', {});

    onPressClose();
  }, [selectedEventId]);

  const attended = React.useMemo(() => {
    return getAttendance(records, user.email, selectedEventId);
  }, [records, user, selectedEventId]);

  const excused = React.useMemo(() => {
    return getExcuse(records, user.email, selectedEventId);
  }, [records, user, selectedEventId]);

  const recordCounts = React.useMemo(() => {
    return getEventRecordCounts(records, selectedEventId);
  }, [records, selectedEventId]);

  const recordStats = React.useMemo(() => {
    const fraction = directorySize === 0 ? 0 : recordCounts.sum / directorySize;

    return {
      raw: fraction,
      percent: `${Math.round(fraction * 100)}%`
    };
  }, [recordCounts, directorySize]);

  const mandatory = React.useMemo(() => {
    if (!user.privileged) return [];

    if (selectedEventId === '') return [];

    return Object.values(getMissedMandatoryByEvent(missedMandatory, directory, selectedEventId)).sort(sortUserByName);
  }, [user, missedMandatory, directory, selectedEventId]);

  const onOpenStart = () => {
    setSnapPoint(0);
  };

  const onOpenEnd = () => {
    setSnapPoint(0);
  };

  const onCloseStart = () => {
    setSnapPoint(1);
  };

  const onCloseEnd = () => {
    setSnapPoint(1);

    dispatchUnselectEvent();
  };

  React.useEffect(() => {
    if (!isGettingAttendance) {
      setRefreshing(false);
    }
  }, [isGettingAttendance]);

  React.useEffect(() => {
    if (selectedEventId === '') {
      snapTo(1);
    } else {
      snapTo(0);

      loadData(false);
    }
  }, [selectedEventId]);

  const renderHeader = () => {
    return (
      <Block style={styles.header}>
        <Block style={styles.panelHeader}>
          <Block style={styles.panelHandle} />
        </Block>
      </Block>
    );
  };

  const renderUser = (mandatoryUser: TUser) => {
    return (
      <Block key={mandatoryUser.email} style={styles.userContainer}>
        <Text style={styles.userTitle}>
          {mandatoryUser.familyName}, {mandatoryUser.givenName}
        </Text>
      </Block>
    );
  };

  const renderAdmin = () => {
    return (
      <Block style={styles.adminContainer}>
        <Block style={styles.adminChartsContainer}>
          <Block style={styles.circleChartContainer}>
            <ProgressCircle
              style={styles.circleChart}
              progress={recordStats.raw}
              progressColor={theme.COLORS.PRIMARY}
              startAngle={-Math.PI * 0.8}
              endAngle={Math.PI * 0.8}
            />
            <Block style={styles.circleChartLabels}>
              <Text style={styles.circleChartValue}>{recordStats.percent}</Text>
              <Text style={styles.circleChartTitle}>Headcount</Text>
            </Block>
          </Block>

          <Block style={styles.chartPropertyContainer}>
            <Block style={styles.chartProperty}>
              <Text style={styles.chartPropertyLabel}>Attended</Text>
              <Text style={styles.chartPropertyValue}>{recordCounts.attended}</Text>
            </Block>
            <Block style={styles.chartProperty}>
              <Text style={styles.chartPropertyLabel}>Excused</Text>
              <Text style={styles.chartPropertyValue}>{recordCounts.excused}</Text>
            </Block>
            <Block style={styles.chartProperty}>
              <Text style={styles.chartPropertyLabel}>Pending</Text>
              <Text style={styles.chartPropertyValue}>{recordCounts.pending}</Text>
            </Block>
          </Block>
        </Block>

        <Block style={styles.dangerZone}>
          <Block style={styles.editZone}>
            <Block style={styles.warning}>
              <Text style={styles.zoneLabel}>Edit this event</Text>
              <Text style={styles.description}>
                Edits to events will only show up when users refresh. Please make sure you have refreshed the latest
                event details before editing.
              </Text>
            </Block>

            <TouchableOpacity onPress={dispatchEditEvent}>
              <Icon style={styles.zoneIcon} family="Feather" name="edit" size={32} color={theme.COLORS.PRIMARY} />
            </TouchableOpacity>
          </Block>
          <Block style={styles.deleteZone}>
            <Block style={styles.warning}>
              <Text style={styles.zoneLabel}>Delete this event</Text>
              <Text style={styles.description}>
                Deleting an event will delete all associated points, attendance and excuse records. Please double check
                and be certain this is the event you want to delete.
              </Text>
            </Block>

            {isDeletingEvent ? (
              <ActivityIndicator style={styles.zoneIcon} />
            ) : (
              <TouchableOpacity
                style={!readyToDelete && styles.disabledButton}
                disabled={!readyToDelete}
                onPress={dispatchDeleteEvent}
              >
                <Icon style={styles.zoneIcon} family="Feather" name="trash-2" size={32} color={theme.COLORS.PRIMARY} />
              </TouchableOpacity>
            )}
          </Block>
          <Block style={styles.enableDeleteContainer}>
            <Switch value={readyToDelete} onValueChange={(newValue: boolean) => setReadyToDelete(newValue)} />
            <Text style={styles.readyToDelete}>I am ready to delete this event</Text>
          </Block>
        </Block>

        <Block style={styles.userList}>
          {mandatory.length > 0 && (
            <React.Fragment>
              <Text
                style={[
                  styles.chartPropertyLabel,
                  {
                    marginTop: 8,
                    color: theme.COLORS.PRIMARY
                  }
                ]}
              >
                Missed Mandatory
              </Text>
              {mandatory.map((mandatoryUser: TUser) => renderUser(mandatoryUser))}
            </React.Fragment>
          )}
        </Block>
      </Block>
    );
  };

  const renderContent = () => {
    return (
      <Block
        style={[
          styles.contentWrapper,
          {
            height: sheetHeight - 48
          }
        ]}
      >
        {selectedEvent !== null && (
          <React.Fragment>
            <ScrollView
              ref={ref => (scrollRef.current = ref)}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
              scrollIndicatorInsets={{ right: 1 }}
            >
              <Block style={styles.eventWrapper}>
                <Block style={styles.eventHeader}>
                  <Text style={styles.eventDate}>{moment(selectedEvent.start).format('ddd LL h:mm A')}</Text>
                  <Text style={styles.eventTitle}>{selectedEvent.title}</Text>

                  {selectedEvent.mandatory === 1 && (
                    <Block style={styles.propertyWrapper}>
                      <Icon
                        style={styles.propertyIcon}
                        family="Feather"
                        name="alert-circle"
                        size={14}
                        color={theme.COLORS.PRIMARY}
                      />

                      <Text style={[styles.propertyText, { color: theme.COLORS.PRIMARY }]}>Mandatory</Text>
                    </Block>
                  )}
                  {attended !== undefined && (
                    <Block style={styles.propertyWrapper}>
                      <Icon
                        style={styles.propertyIcon}
                        family="Feather"
                        name="check"
                        size={14}
                        color={theme.COLORS.PRIMARY_GREEN}
                      />

                      <Text style={[styles.propertyText, { color: theme.COLORS.PRIMARY_GREEN }]}>Checked In</Text>
                    </Block>
                  )}
                  {excused !== undefined && excused.approved === 1 && (
                    <Block style={styles.propertyWrapper}>
                      <Icon
                        style={styles.propertyIcon}
                        family="Feather"
                        name="check"
                        size={14}
                        color={theme.COLORS.PRIMARY_GREEN}
                      />

                      <Text style={[styles.propertyText, { color: theme.COLORS.PRIMARY_GREEN }]}>Excused</Text>
                    </Block>
                  )}
                  {excused !== undefined && excused.approved === 0 && (
                    <Block style={styles.propertyWrapper}>
                      <Icon
                        style={styles.propertyIcon}
                        family="Feather"
                        name="clock"
                        size={14}
                        color={theme.COLORS.YELLOW_GRADIENT_END}
                      />

                      <Text style={[styles.propertyText, { color: theme.COLORS.YELLOW_GRADIENT_END }]}>
                        Excuse under review
                      </Text>
                    </Block>
                  )}
                </Block>

                <Block style={styles.eventBody}>
                  <Text style={styles.eventDescription}>{selectedEvent.description}</Text>

                  <Block style={styles.splitPropertyRow}>
                    <Block style={styles.splitProperty}>
                      <Text style={styles.propertyHeader}>Location</Text>
                      <Text style={styles.propertyValue}>{selectedEvent.location}</Text>
                    </Block>
                    {user.privileged === true && (
                      <Block style={styles.splitProperty}>
                        <Text style={styles.propertyHeader}>Check-In Code</Text>
                        <Text style={styles.propertyValue}>{selectedEvent.event_code}</Text>
                      </Block>
                    )}
                  </Block>

                  <Block style={styles.splitPropertyRow}>
                    <Block style={styles.splitProperty}>
                      <Text style={styles.propertyHeader}>Duration</Text>
                      <Text style={styles.propertyValue}>
                        {selectedEvent.duration < 60
                          ? `${selectedEvent.duration} minutes`
                          : moment.duration(selectedEvent.duration, 'minutes').humanize()}
                      </Text>
                    </Block>
                    <Block style={styles.splitProperty}>
                      <Text style={styles.propertyHeader}>Points</Text>
                      <Text style={styles.propertyValue}>{prettyPoints(selectedEvent.points)}</Text>
                    </Block>
                  </Block>

                  {user.privileged === true && renderAdmin()}
                </Block>
              </Block>
            </ScrollView>

            <Block
              style={[
                styles.bottomBar,
                {
                  marginBottom: insets.bottom
                }
              ]}
            >
              {selectedEvent.excusable === 1 && (
                <React.Fragment>
                  <Block style={styles.excuseButton}>
                    <RoundButton
                      alt={true}
                      label="Request Excuse"
                      disabled={excused !== undefined || attended !== undefined}
                      onPress={onPressExcuse}
                    />
                  </Block>
                  <Block style={styles.bottomDivider} />
                </React.Fragment>
              )}

              <Block style={styles.attendButton}>
                <RoundButton
                  disabled={attended !== undefined || !moment(selectedEvent.start).isSame(moment(), 'day')}
                  label="Check In"
                  onPress={onPressCheckIn}
                />
              </Block>
            </Block>
          </React.Fragment>
        )}
      </Block>
    );
  };

  return (
    <Ghost style={styles.container}>
      <TouchableWithoutFeedback onPress={onPressClose}>
        <Animated.View
          pointerEvents={selectedEventId === '' ? 'none' : 'auto'}
          style={[
            styles.background,
            {
              opacity: backgroundOpacity
            }
          ]}
        />
      </TouchableWithoutFeedback>

      <BottomSheet
        ref={ref => (sheetRef.current = ref)}
        snapPoints={[sheetHeight, 0]}
        initialSnap={1}
        callbackNode={callbackNode}
        overdragResistanceFactor={1.5}
        enabledBottomClamp={true}
        renderHeader={renderHeader}
        renderContent={renderContent}
        onOpenStart={onOpenStart}
        onOpenEnd={onOpenEnd}
        onCloseStart={onCloseStart}
        onCloseEnd={onCloseEnd}
      />
    </Ghost>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  background: {
    flex: 1,
    backgroundColor: theme.COLORS.BLACK
  },
  header: {
    height: 48,
    paddingTop: 8,
    paddingBottom: 8,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: theme.COLORS.WHITE
  },
  panelHeader: {
    alignItems: 'center'
  },
  panelHandle: {
    width: 40,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00000040'
  },
  headerControls: {
    flex: 1,
    marginHorizontal: 16,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  contentWrapper: {
    backgroundColor: theme.COLORS.WHITE
  },
  eventWrapper: {
    paddingHorizontal: 24
  },
  eventHeader: {},
  eventDate: {
    fontFamily: 'OpenSans-Bold',
    color: theme.COLORS.GRAY,
    fontSize: 14,
    textTransform: 'uppercase'
  },
  eventTitle: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 20
  },
  propertyWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  propertyIcon: {},
  propertyText: {
    marginLeft: 4,
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 13
  },
  eventBody: {
    marginTop: 24
  },
  eventDescription: {
    marginBottom: 8,
    fontFamily: 'OpenSans',
    fontSize: 15
  },
  propertyHeader: {
    marginTop: 16,
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 13,
    textTransform: 'uppercase',
    color: theme.COLORS.GRAY
  },
  propertyValue: {
    marginTop: 4,
    fontFamily: 'OpenSans',
    fontSize: 15
  },
  splitPropertyRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  splitProperty: {
    width: '50%'
  },
  adminContainer: {},
  adminChartsContainer: {
    marginTop: 24,
    marginBottom: 24,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  circleChartContainer: {
    width: 144,
    height: 144
  },
  circleChart: {
    height: '100%'
  },
  circleChartLabels: {
    position: 'absolute',
    width: 144,
    height: 144,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  circleChartValue: {
    fontFamily: 'OpenSans',
    fontSize: 17
  },
  circleChartTitle: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 13,
    textTransform: 'uppercase',
    color: theme.COLORS.GRAY
  },
  chartPropertyContainer: {
    flexGrow: 1,
    paddingLeft: 24,
    justifyContent: 'center'
  },
  chartProperty: {
    height: 42,
    borderBottomWidth: 1,
    borderBottomColor: theme.COLORS.LIGHT_BORDER,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  chartPropertyLabel: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 15,
    color: theme.COLORS.GRAY,
    textTransform: 'uppercase'
  },
  chartPropertyValue: {
    fontFamily: 'OpenSans',
    fontSize: 15
  },
  bottomBar: {
    width: '100%',
    height: 64,
    backgroundColor: theme.COLORS.WHITE,
    paddingHorizontal: 24,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  excuseButton: {
    flex: 1
  },
  bottomDivider: {
    width: 8
  },
  attendButton: {
    flex: 1
  },
  userList: {},
  userContainer: {
    height: 48,
    borderBottomWidth: 1,
    borderBottomColor: theme.COLORS.LIGHT_BORDER,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  userTitle: {
    fontFamily: 'OpenSans',
    fontSize: 16
  },
  userDate: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 13,
    color: theme.COLORS.GRAY,
    textTransform: 'uppercase'
  },
  dangerZone: {
    padding: 20,
    borderRadius: 20,
    backgroundColor: theme.COLORS.INPUT_ERROR_LIGHT
  },
  editZone: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  deleteZone: {
    marginTop: 16,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  warning: {
    flex: 1,
    marginRight: 8
  },
  zoneLabel: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 14
  },
  description: {
    marginTop: 2,
    fontFamily: 'OpenSans',
    fontSize: 12
  },
  zoneIcon: {
    width: 32
  },
  enableDeleteContainer: {
    marginTop: 8,
    marginLeft: 16,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  readyToDelete: {
    marginLeft: 8,
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 13
  },
  disabledButton: {
    opacity: 0.4
  }
});

export default EventDrawer;
