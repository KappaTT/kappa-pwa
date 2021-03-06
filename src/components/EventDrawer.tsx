import React from 'react';
import {
  StyleSheet,
  TouchableWithoutFeedback,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  Clipboard
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useSafeArea } from 'react-native-safe-area-context';
import moment from 'moment';
import { ProgressCircle } from 'react-native-svg-charts';

import { TRedux } from '@reducers';
import { TToast } from '@reducers/ui';
import { _kappa, _ui } from '@reducers/actions';
import {
  getAttendance,
  getExcuse,
  getEventRecords,
  getMissedMandatoryByEvent,
  sortUserByName,
  prettyPoints,
  shouldLoad,
  canCheckIn
} from '@services/kappaService';
import { theme } from '@constants';
import { HeaderHeight, HORIZONTAL_PADDING } from '@services/utils';
import { navigate } from '@navigation/NavigationService';
import { TUser } from '@backend/auth';
import PartialPageModal from '@components/PartialPageModal';
import Header from '@components/Header';
import Block from '@components/Block';
import Ghost from '@components/Ghost';
import Text from '@components/Text';
import RoundButton from '@components/RoundButton';
import Icon from '@components/Icon';
import LinkContainer from '@components/LinkContainer';

const EventDrawer: React.FC = () => {
  const user = useSelector((state: TRedux) => state.auth.user);
  const loadHistory = useSelector((state: TRedux) => state.kappa.loadHistory);
  const directory = useSelector((state: TRedux) => state.kappa.directory);
  const directorySize = useSelector((state: TRedux) => state.kappa.directorySize);
  const records = useSelector((state: TRedux) => state.kappa.records);
  const missedMandatory = useSelector((state: TRedux) => state.kappa.missedMandatory);
  const isGettingAttendance = useSelector((state: TRedux) => state.kappa.isGettingAttendance);
  const getAttendanceError = useSelector((state: TRedux) => state.kappa.getAttendanceError);
  const selectedEventId = useSelector((state: TRedux) => state.kappa.selectedEventId);
  const selectedEvent = useSelector((state: TRedux) => state.kappa.selectedEvent);

  const [refreshing, setRefreshing] = React.useState<boolean>(isGettingAttendance);

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
  const dispatchCheckIn = React.useCallback(
    (excuse: boolean) => dispatch(_kappa.setCheckInEvent(selectedEventId, excuse)),
    [dispatch, selectedEventId]
  );
  const dispatchShowToast = React.useCallback((toast: Partial<TToast>) => dispatch(_ui.showToast(toast)), [dispatch]);

  const insets = useSafeArea();

  const scrollRef = React.useRef(undefined);

  const [visible, setVisible] = React.useState<boolean>(false);

  const loadData = React.useCallback(
    (force: boolean) => {
      if (user.privileged) {
        if (
          !isGettingAttendance &&
          (force || (!getAttendanceError && shouldLoad(loadHistory, `event-${selectedEventId}`)))
        ) {
          dispatchGetAttendance(force);
        }
      } else {
        if (!isGettingAttendance && (force || (!getAttendanceError && shouldLoad(loadHistory, `user-${user.email}`)))) {
          dispatchGetMyAttendance(force);
        }
      }
    },
    [
      user.privileged,
      user.email,
      isGettingAttendance,
      getAttendanceError,
      loadHistory,
      selectedEventId,
      dispatchGetAttendance,
      dispatchGetMyAttendance
    ]
  );

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    loadData(true);
  }, [loadData]);

  const onPressClose = React.useCallback(() => {
    dispatchUnselectEvent();
  }, [dispatchUnselectEvent]);

  const onPressExcuse = React.useCallback(() => {
    dispatchCheckIn(true);

    if (selectedEvent !== null && moment(selectedEvent.start).isBefore(moment(), 'day')) {
      navigate('Messages', {});
    } else {
      navigate('Check In', {});
    }

    onPressClose();
  }, [dispatchCheckIn, onPressClose, selectedEvent]);

  const onPressCheckIn = React.useCallback(() => {
    dispatchCheckIn(false);
    navigate('Check In', {});

    onPressClose();
  }, [dispatchCheckIn, onPressClose]);

  const onPressCheckInCode = React.useCallback(() => {
    Clipboard.setString(selectedEvent.eventCode);

    dispatchShowToast({
      title: 'Copied',
      message: 'The code was saved to your clipboard',
      timer: 1500
    });
  }, [dispatchShowToast, selectedEvent]);

  const attended = React.useMemo(() => {
    return getAttendance(records, user.email, selectedEventId);
  }, [records, user, selectedEventId]);

  const excused = React.useMemo(() => {
    return getExcuse(records, user.email, selectedEventId);
  }, [records, user, selectedEventId]);

  const recordCounts = getEventRecords(directory, records, selectedEventId);

  const recordStats = React.useMemo(() => {
    const fraction = directorySize === 0 ? 0 : (directorySize - recordCounts.absent.length) / directorySize;

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

  const onCloseEnd = React.useCallback(() => {
    dispatchUnselectEvent();
  }, [dispatchUnselectEvent]);

  React.useEffect(() => {
    if (!isGettingAttendance) {
      setRefreshing(false);
    }
  }, [isGettingAttendance]);

  React.useEffect(() => {
    if (selectedEventId === '') {
      setVisible(false);
    } else {
      setVisible(true);

      loadData(false);
    }
  }, [user, loadData, selectedEventId]);

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
              {isGettingAttendance ? (
                <ActivityIndicator color={theme.COLORS.PRIMARY} />
              ) : (
                <React.Fragment>
                  <Text style={styles.circleChartValue}>{recordStats.percent}</Text>
                  <Text style={styles.circleChartTitle}>Headcount</Text>
                </React.Fragment>
              )}
            </Block>
          </Block>

          <Block style={styles.chartPropertyContainer}>
            <Block style={styles.chartProperty}>
              <Text style={styles.chartPropertyLabel}>Attended</Text>
              <Text style={styles.chartPropertyValue}>{recordCounts.attended.length}</Text>
            </Block>
            <Block style={styles.chartProperty}>
              <Text style={styles.chartPropertyLabel}>Excused</Text>
              <Text style={styles.chartPropertyValue}>{recordCounts.excused.length}</Text>
            </Block>
            <Block style={styles.chartProperty}>
              <Text style={styles.chartPropertyLabel}>Pending</Text>
              <Text style={styles.chartPropertyValue}>{recordCounts.pending.length}</Text>
            </Block>
          </Block>
        </Block>

        <Block style={styles.userList}>
          {!isGettingAttendance && mandatory.length > 0 && (
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
      <Block style={styles.contentWrapper}>
        {selectedEvent !== null && (
          <React.Fragment>
            <ScrollView
              ref={(ref) => (scrollRef.current = ref)}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
              scrollIndicatorInsets={{ right: 1 }}
            >
              <TouchableWithoutFeedback>
                <Block style={styles.eventWrapper}>
                  <Block style={styles.eventHeader}>
                    <Text style={styles.eventDate}>{moment(selectedEvent.start).format('ddd LL h:mm A')}</Text>
                    <Text style={styles.eventTitle}>{selectedEvent.title}</Text>

                    {selectedEvent.mandatory && (
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
                    {excused !== undefined && excused.approved && (
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
                    {excused !== undefined && !excused.approved && (
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
                      <Block style={styles.splitProperty}>
                        <LinkContainer link={selectedEvent.link}>
                          <Text style={styles.propertyHeader}>Link</Text>
                          <Text
                            style={[styles.propertyValue, selectedEvent.link && { color: theme.COLORS.PRIMARY }]}
                            numberOfLines={1}
                          >
                            {selectedEvent.link || 'N/A'}
                          </Text>
                        </LinkContainer>
                      </Block>
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

                    <Block style={styles.splitPropertyRow}>
                      {user.privileged === true && (
                        <Block style={styles.splitProperty}>
                          <TouchableOpacity activeOpacity={0.6} onPress={onPressCheckInCode}>
                            <Text style={styles.propertyHeader}>Check-In Code</Text>
                            <Text style={styles.propertyValue}>{selectedEvent.eventCode}</Text>
                          </TouchableOpacity>
                        </Block>
                      )}
                    </Block>

                    {user.privileged === true && renderAdmin()}
                  </Block>
                </Block>
              </TouchableWithoutFeedback>
            </ScrollView>

            <Block
              style={[
                styles.bottomBar,
                {
                  marginBottom: insets.bottom
                }
              ]}
            >
              {selectedEvent.excusable && (
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
                  disabled={attended !== undefined || !canCheckIn(selectedEvent)}
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
      <PartialPageModal visible={visible} height={user.privileged ? '75%' : 460} onDoneClosing={onCloseEnd}>
        <Header
          title="Event Details"
          subtitle={selectedEvent?.title}
          showBackButton={true}
          onPressBackButton={onPressClose}
        />

        <Block
          style={[
            styles.wrapper,
            {
              top: insets.top + HeaderHeight
            }
          ]}
        >
          {renderContent()}
        </Block>
      </PartialPageModal>
    </Ghost>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0
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
    marginHorizontal: HORIZONTAL_PADDING,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  contentWrapper: {
    flex: 1,
    backgroundColor: theme.COLORS.WHITE
  },
  eventWrapper: {
    paddingTop: HORIZONTAL_PADDING,
    paddingHorizontal: HORIZONTAL_PADDING
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
    paddingHorizontal: HORIZONTAL_PADDING,
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
    padding: HORIZONTAL_PADDING,
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
    marginTop: HORIZONTAL_PADDING,
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
    marginLeft: HORIZONTAL_PADDING,
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
