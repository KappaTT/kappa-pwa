import React from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, RefreshControl, ActivityIndicator, Clipboard } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useSafeArea } from 'react-native-safe-area-context';
import moment from 'moment';

import { TRedux } from '@reducers';
import { TToast } from '@reducers/ui';
import { _kappa, _ui } from '@reducers/actions';
import { prettyPhone, shouldLoad, sortEventsByDateReverse } from '@services/kappaService';
import { theme } from '@constants';
import { isEmpty, HORIZONTAL_PADDING, HeaderHeight } from '@services/utils';
import { TEvent } from '@backend/kappa';
import PartialPageModal from '@components/PartialPageModal';
import Header from '@components/Header';
import Block from '@components/Block';
import Ghost from '@components/Ghost';
import Text from '@components/Text';
import GeneralMeetingChart from '@components/GeneralMeetingChart';

const BrotherDrawer: React.FC = () => {
  const user = useSelector((state: TRedux) => state.auth.user);
  const loadHistory = useSelector((state: TRedux) => state.kappa.loadHistory);
  const events = useSelector((state: TRedux) => state.kappa.events);
  const gmCount = useSelector((state: TRedux) => state.kappa.gmCount);
  const records = useSelector((state: TRedux) => state.kappa.records);
  const missedMandatory = useSelector((state: TRedux) => state.kappa.missedMandatory);
  const points = useSelector((state: TRedux) => state.kappa.points);
  const isGettingPoints = useSelector((state: TRedux) => state.kappa.isGettingPoints);
  const getPointsError = useSelector((state: TRedux) => state.kappa.getPointsError);
  const isGettingAttendance = useSelector((state: TRedux) => state.kappa.isGettingAttendance);
  const getAttendanceError = useSelector((state: TRedux) => state.kappa.getAttendanceError);
  const selectedUserEmail = useSelector((state: TRedux) => state.kappa.selectedUserEmail);
  const selectedUser = useSelector((state: TRedux) => state.kappa.selectedUser);

  const [refreshing, setRefreshing] = React.useState<boolean>(isGettingAttendance);

  const dispatch = useDispatch();
  const dispatchGetAttendance = React.useCallback(
    (overwrite: boolean = false) => dispatch(_kappa.getUserAttendance(user, selectedUserEmail, overwrite)),
    [dispatch, user, selectedUserEmail]
  );
  const dispatchGetPoints = React.useCallback(() => dispatch(_kappa.getPointsByUser(user, selectedUserEmail)), [
    dispatch,
    user,
    selectedUserEmail
  ]);
  const dispatchUnselectUser = React.useCallback(() => dispatch(_kappa.unselectUser()), [dispatch]);
  const dispatchShowToast = React.useCallback((toast: Partial<TToast>) => dispatch(_ui.showToast(toast)), [dispatch]);

  const insets = useSafeArea();

  const scrollRef = React.useRef(undefined);

  const [visible, setVisible] = React.useState<boolean>(false);

  const loadData = React.useCallback(
    (force: boolean) => {
      if (user.privileged) {
        if (
          !isGettingAttendance &&
          (force || (!getAttendanceError && shouldLoad(loadHistory, `user-${selectedUserEmail}`)))
        )
          dispatchGetAttendance(force);
        if (!isGettingPoints && (force || (!getPointsError && shouldLoad(loadHistory, `points-${selectedUserEmail}`))))
          dispatchGetPoints();
      }
    },
    [
      user.privileged,
      isGettingAttendance,
      getAttendanceError,
      loadHistory,
      selectedUserEmail,
      dispatchGetAttendance,
      isGettingPoints,
      getPointsError,
      dispatchGetPoints
    ]
  );

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    loadData(true);
  }, [loadData]);

  const onPressClose = React.useCallback(() => {
    dispatchUnselectUser();
  }, [dispatchUnselectUser]);

  const onPressEmail = React.useCallback(() => {
    Clipboard.setString(selectedUserEmail);

    dispatchShowToast({
      title: 'Copied',
      message: 'The email was saved to your clipboard',
      timer: 1500
    });
  }, [dispatchShowToast, selectedUserEmail]);

  const onPressPhone = React.useCallback(() => {
    Clipboard.setString(selectedUser ? selectedUser.phone : '');

    dispatchShowToast({
      title: 'Copied',
      message: 'The phone number was saved to your clipboard',
      timer: 1500
    });
  }, [dispatchShowToast, selectedUser]);

  const mandatory = React.useMemo(() => {
    if (!user.privileged) return [];

    if (isEmpty(missedMandatory[selectedUserEmail])) return [];

    return Object.values(missedMandatory[selectedUserEmail]).sort(sortEventsByDateReverse);
  }, [user, missedMandatory, selectedUserEmail]);

  const onCloseEnd = React.useCallback(() => {
    dispatchUnselectUser();
  }, [dispatchUnselectUser]);

  React.useEffect(() => {
    if (!isGettingAttendance) {
      setRefreshing(false);
    }
  }, [isGettingAttendance]);

  React.useEffect(() => {
    if (selectedUserEmail === '') {
      setVisible(false);
    } else {
      setVisible(true);

      loadData(false);
    }
  }, [user, loadData, selectedUserEmail]);

  const renderAdmin = () => {
    return (
      <Block style={styles.adminContainer}>
        <Block>
          <Block style={styles.splitPropertyRow}>
            <Block style={styles.splitPropertySevenths}>
              <Text style={styles.propertyHeader}>Prof</Text>
              {isGettingPoints ? (
                <ActivityIndicator style={styles.propertyLoader} color={theme.COLORS.DARK_GRAY} />
              ) : (
                <Text style={styles.propertyValue}>
                  {points.hasOwnProperty(selectedUserEmail) ? points[selectedUserEmail].PROF : '0'}
                </Text>
              )}
            </Block>
            <Block style={styles.splitPropertySevenths}>
              <Text style={styles.propertyHeader}>Phil</Text>
              {isGettingPoints ? (
                <ActivityIndicator style={styles.propertyLoader} color={theme.COLORS.DARK_GRAY} />
              ) : (
                <Text style={styles.propertyValue}>
                  {points.hasOwnProperty(selectedUserEmail) ? points[selectedUserEmail].PHIL : '0'}
                </Text>
              )}
            </Block>
            <Block style={styles.splitPropertySevenths}>
              <Text style={styles.propertyHeader}>Bro</Text>
              {isGettingPoints ? (
                <ActivityIndicator style={styles.propertyLoader} color={theme.COLORS.DARK_GRAY} />
              ) : (
                <Text style={styles.propertyValue}>
                  {points.hasOwnProperty(selectedUserEmail) ? points[selectedUserEmail].BRO : '0'}
                </Text>
              )}
            </Block>
            <Block style={styles.splitPropertySevenths}>
              <Text style={styles.propertyHeader}>Rush</Text>
              {isGettingPoints ? (
                <ActivityIndicator style={styles.propertyLoader} color={theme.COLORS.DARK_GRAY} />
              ) : (
                <Text style={styles.propertyValue}>
                  {points.hasOwnProperty(selectedUserEmail) ? points[selectedUserEmail].RUSH : '0'}
                </Text>
              )}
            </Block>
            <Block style={styles.splitPropertySevenths}>
              <Text style={styles.propertyHeader}>Kappa Chat</Text>
              {isGettingPoints ? (
                <ActivityIndicator style={styles.propertyLoader} color={theme.COLORS.DARK_GRAY} />
              ) : (
                <Text style={styles.propertyValue}>
                  {points.hasOwnProperty(selectedUserEmail) ? points[selectedUserEmail].CHAT : '0'}
                </Text>
              )}
            </Block>
            <Block style={styles.splitPropertySevenths}>
              <Text style={styles.propertyHeader}>Diversity</Text>
              {isGettingPoints ? (
                <ActivityIndicator style={styles.propertyLoader} color={theme.COLORS.DARK_GRAY} />
              ) : (
                <Text style={styles.propertyValue}>
                  {points.hasOwnProperty(selectedUserEmail) ? points[selectedUserEmail].DIV : '0'}
                </Text>
              )}
            </Block>
            <Block style={styles.splitPropertySevenths}>
              <Text style={styles.propertyHeader}>Any</Text>
              {isGettingPoints ? (
                <ActivityIndicator style={styles.propertyLoader} color={theme.COLORS.DARK_GRAY} />
              ) : (
                <Text style={styles.propertyValue}>
                  {points.hasOwnProperty(selectedUserEmail) ? points[selectedUserEmail].ANY : '0'}
                </Text>
              )}
            </Block>
          </Block>
        </Block>

        <GeneralMeetingChart
          isGettingAttendance={isGettingAttendance}
          email={selectedUserEmail}
          records={records}
          events={events}
          gmCount={gmCount}
        />

        <Block style={styles.eventList}>
          {!isGettingAttendance && mandatory.length > 0 && (
            <React.Fragment>
              <Text style={styles.mandatoryLabel}>Missed Mandatory</Text>
              {mandatory.map((event: TEvent) => (
                <Block key={event._id} style={styles.eventContainer}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <Text style={styles.eventDate}>{moment(event.start).format('M/D/Y')}</Text>
                </Block>
              ))}
            </React.Fragment>
          )}

          {/* <Text style={styles.chartPropertyLabel}>Attended</Text>
          {Object.keys(attended)
            .map(attend => events[attend])
            .sort(sortEventByDate)
            .map((event: TEvent) => renderEvent(event))}

          <Text style={styles.chartPropertyLabel}>Excused</Text>
          {Object.keys(excused)
            .map(attend => events[attend])
            .sort(sortEventByDate)
            .map((event: TEvent) => renderEvent(event))} */}
        </Block>
      </Block>
    );
  };

  const renderContent = () => {
    return (
      <Block style={styles.contentWrapper}>
        {selectedUser !== null && (
          <React.Fragment>
            <ScrollView
              ref={(ref) => (scrollRef.current = ref)}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
              scrollIndicatorInsets={{ right: 1 }}
            >
              <Block
                style={[
                  styles.userWrapper,
                  {
                    paddingBottom: insets.bottom
                  }
                ]}
              >
                <Block style={styles.userHeader}>
                  <Text style={styles.userTitle}>
                    {selectedUser.familyName}, {selectedUser.givenName}
                  </Text>
                  {selectedUser.role !== undefined && <Text style={styles.userDate}>{selectedUser.role}</Text>}
                </Block>

                <Block style={styles.userBody}>
                  <Block style={styles.splitPropertyRow}>
                    <Block style={styles.splitPropertyAuto}>
                      <Text style={styles.propertyHeader}>First Year</Text>
                      <Text style={styles.propertyValue}>{selectedUser.firstYear}</Text>
                    </Block>
                    <Block style={styles.splitPropertyAuto}>
                      <Text style={styles.propertyHeader}>Grad Year</Text>
                      <Text style={styles.propertyValue}>{selectedUser.gradYear}</Text>
                    </Block>
                    <Block style={styles.splitPropertyAuto}>
                      <Text style={styles.propertyHeader}>Pledge Class</Text>
                      <Text style={styles.propertyValue}>{selectedUser.semester}</Text>
                    </Block>
                  </Block>
                  <Block style={styles.splitPropertyRow}>
                    <Block style={styles.splitProperty}>
                      <TouchableOpacity activeOpacity={0.6} onPress={onPressEmail}>
                        <Text style={styles.propertyHeader}>Email</Text>
                        <Text style={styles.propertyValue}>{selectedUser.email}</Text>
                      </TouchableOpacity>
                    </Block>
                    <Block style={styles.splitProperty}>
                      <TouchableOpacity activeOpacity={0.6} onPress={onPressPhone}>
                        <Text style={styles.propertyHeader}>Phone</Text>
                        <Text style={styles.propertyValue}>{prettyPhone(selectedUser.phone)}</Text>
                      </TouchableOpacity>
                    </Block>
                  </Block>

                  {user.privileged === true && renderAdmin()}
                </Block>
              </Block>
            </ScrollView>
          </React.Fragment>
        )}
      </Block>
    );
  };

  return (
    <Ghost style={styles.container}>
      <PartialPageModal visible={visible} height={user.privileged ? '80%' : 280} onDoneClosing={onCloseEnd}>
        <Header
          title="Brother Details"
          subtitle={selectedUser && `${selectedUser.familyName}, ${selectedUser.givenName}`}
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
  userWrapper: {
    paddingTop: HORIZONTAL_PADDING,
    paddingHorizontal: HORIZONTAL_PADDING
  },
  userHeader: {},
  userDate: {
    fontFamily: 'OpenSans-Bold',
    color: theme.COLORS.GRAY,
    fontSize: 14,
    textTransform: 'uppercase'
  },
  userTitle: {
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
  userBody: {
    marginTop: 24
  },
  userDescription: {
    marginBottom: 8,
    fontFamily: 'OpenSans',
    fontSize: 17
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
  propertyLoader: {
    alignSelf: 'flex-start'
  },
  splitPropertyRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  splitPropertyAuto: {
    marginRight: 20
  },
  splitProperty: {
    width: '50%'
  },
  splitPropertyThirds: {
    width: '33%'
  },
  splitPropertyFifths: {
    width: '20%'
  },
  splitPropertySixths: {
    width: '16%'
  },
  splitPropertySevenths: {
    width: '14%'
  },
  adminContainer: {},
  mandatoryLabel: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 15,
    color: theme.COLORS.PRIMARY,
    textTransform: 'uppercase'
  },
  eventList: {},
  eventContainer: {
    height: 48,
    borderBottomWidth: 1,
    borderBottomColor: theme.COLORS.LIGHT_BORDER,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  eventTitle: {
    fontFamily: 'OpenSans',
    fontSize: 16
  },
  eventDate: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 13,
    color: theme.COLORS.GRAY,
    textTransform: 'uppercase'
  }
});

export default BrotherDrawer;
