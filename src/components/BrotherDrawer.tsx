import React from 'react';
import {
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Clipboard
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
import { useSafeArea } from 'react-native-safe-area-context';
import moment from 'moment';

import { TRedux } from '@reducers';
import { TToast } from '@reducers/ui';
import { _kappa, _ui } from '@reducers/actions';
import { log } from '@services/logService';
import { prettyPhone, sortEventByDate, shouldLoad, sortEventsByDateReverse } from '@services/kappaService';
import { hapticImpact } from '@services/hapticService';
import { theme } from '@constants';
import { TabBarHeight, isEmpty, HORIZONTAL_PADDING } from '@services/utils';
import { TEvent } from '@backend/kappa';
import Block from '@components/Block';
import Ghost from '@components/Ghost';
import Text from '@components/Text';
import GeneralMeetingChart from '@components/GeneralMeetingChart';

const { width, height } = Dimensions.get('window');

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

  const sheetRef = React.useRef(undefined);
  const scrollRef = React.useRef(undefined);

  const maxSheetHeight = (height - insets.top) * 0.75 + insets.bottom;
  const intermediateSheetHeight = 256 + insets.bottom;

  const [snapPoint, setSnapPoint] = React.useState<number>(1);
  const [callbackNode, setCallbackNode] = React.useState(new Animated.Value(1));

  const backgroundOpacity = callbackNode.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 0]
  });

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

  const snapTo = React.useCallback(
    (newSnap) => {
      sheetRef?.current?.snapTo(newSnap);
      sheetRef?.current?.snapTo(newSnap);
    },
    [sheetRef]
  );

  const onPressClose = React.useCallback(() => {
    snapTo(2);
  }, [snapTo]);

  const onPressEmail = React.useCallback(() => {
    Clipboard.setString(selectedUserEmail);

    dispatchShowToast({
      toastTitle: 'Copied',
      toastMessage: 'The email was saved to your clipboard',
      toastTimer: 1500
    });
  }, [dispatchShowToast, selectedUserEmail]);

  const onPressPhone = React.useCallback(() => {
    Clipboard.setString(selectedUser ? selectedUser.phone : '');

    dispatchShowToast({
      toastTitle: 'Copied',
      toastMessage: 'The phone number was saved to your clipboard',
      toastTimer: 1500
    });
  }, [dispatchShowToast, selectedUser]);

  const mandatory = React.useMemo(() => {
    if (!user.privileged) return [];

    if (isEmpty(missedMandatory[selectedUserEmail])) return [];

    return Object.values(missedMandatory[selectedUserEmail]).sort(sortEventsByDateReverse);
  }, [user, missedMandatory, selectedUserEmail]);

  const onOpenStart = React.useCallback(() => {
    setSnapPoint(1);
  }, []);

  const onOpenEnd = React.useCallback(() => {
    setSnapPoint(0);
  }, []);

  const onCloseStart = React.useCallback(() => {
    setSnapPoint(1);
  }, []);

  const onCloseEnd = React.useCallback(() => {
    setSnapPoint(2);

    dispatchUnselectUser();
  }, [dispatchUnselectUser]);

  React.useEffect(() => {
    if (!isGettingAttendance) {
      setRefreshing(false);
    }
  }, [isGettingAttendance]);

  React.useEffect(() => {
    if (selectedUserEmail === '') {
      snapTo(2);
    } else {
      snapTo(user.privileged ? 0 : 1);

      loadData(false);
    }
  }, [user, loadData, selectedUserEmail, snapTo]);

  const renderHeader = () => {
    return (
      <Block style={styles.header}>
        <Block style={styles.panelHeader}>
          <Block style={styles.panelHandle} />
        </Block>
      </Block>
    );
  };

  const renderEvent = (event: TEvent) => {
    return (
      <Block key={event.id} style={styles.eventContainer}>
        <Text style={styles.eventTitle}>{event.title}</Text>
        <Text style={styles.eventDate}>{moment(event.start).format('M/D/Y')}</Text>
      </Block>
    );
  };

  const renderAdmin = () => {
    return (
      <Block style={styles.adminContainer}>
        <Block>
          <Block style={styles.splitPropertyRow}>
            <Block style={styles.splitPropertyFifths}>
              <Text style={styles.propertyHeader}>Prof</Text>
              {isGettingPoints ? (
                <ActivityIndicator style={styles.propertyLoader} />
              ) : (
                <Text style={styles.propertyValue}>
                  {points.hasOwnProperty(selectedUserEmail) ? points[selectedUserEmail].PROF : '0'}
                </Text>
              )}
            </Block>
            <Block style={styles.splitPropertyFifths}>
              <Text style={styles.propertyHeader}>Phil</Text>
              {isGettingPoints ? (
                <ActivityIndicator style={styles.propertyLoader} />
              ) : (
                <Text style={styles.propertyValue}>
                  {points.hasOwnProperty(selectedUserEmail) ? points[selectedUserEmail].PHIL : '0'}
                </Text>
              )}
            </Block>
            <Block style={styles.splitPropertyFifths}>
              <Text style={styles.propertyHeader}>Bro</Text>
              {isGettingPoints ? (
                <ActivityIndicator style={styles.propertyLoader} />
              ) : (
                <Text style={styles.propertyValue}>
                  {points.hasOwnProperty(selectedUserEmail) ? points[selectedUserEmail].BRO : '0'}
                </Text>
              )}
            </Block>
            <Block style={styles.splitPropertyFifths}>
              <Text style={styles.propertyHeader}>Rush</Text>
              {isGettingPoints ? (
                <ActivityIndicator style={styles.propertyLoader} />
              ) : (
                <Text style={styles.propertyValue}>
                  {points.hasOwnProperty(selectedUserEmail) ? points[selectedUserEmail].RUSH : '0'}
                </Text>
              )}
            </Block>
            <Block style={styles.splitPropertyFifths}>
              <Text style={styles.propertyHeader}>Any</Text>
              {isGettingPoints ? (
                <ActivityIndicator style={styles.propertyLoader} />
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
              {mandatory.map((event: TEvent) => renderEvent(event))}
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
      <Block
        style={[
          styles.contentWrapper,
          {
            height: (user.privileged ? maxSheetHeight : intermediateSheetHeight) - 48
          }
        ]}
      >
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
                  {selectedUser.role !== undefined && <Text style={styles.userDate}>{selectedUser.role}</Text>}
                  <Text style={styles.userTitle}>
                    {selectedUser.familyName}, {selectedUser.givenName}
                  </Text>
                </Block>

                <Block style={styles.userBody}>
                  <Block style={styles.splitPropertyRow}>
                    <Block style={styles.splitProperty}>
                      <Text style={styles.propertyHeader}>Grad Year</Text>
                      <Text style={styles.propertyValue}>{selectedUser.gradYear}</Text>
                    </Block>
                    <Block style={styles.splitProperty}>
                      <Text style={styles.propertyHeader}>Pledge Class</Text>
                      <Text style={styles.propertyValue}>{selectedUser.semester}</Text>
                    </Block>
                  </Block>
                  <Block style={styles.splitPropertyRow}>
                    <Block style={styles.splitProperty}>
                      <TouchableOpacity onPress={onPressEmail}>
                        <Text style={styles.propertyHeader}>Email</Text>
                        <Text style={styles.propertyValue}>{selectedUser.email}</Text>
                      </TouchableOpacity>
                    </Block>
                    <Block style={styles.splitProperty}>
                      <TouchableOpacity onPress={onPressPhone}>
                        <Text style={styles.propertyHeader}>Phone</Text>
                        <Text style={styles.propertyValue}>
                          {selectedUser.phone ? prettyPhone(selectedUser.phone) : ''}
                        </Text>
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
      <TouchableWithoutFeedback onPress={onPressClose}>
        <Animated.View
          pointerEvents={selectedUserEmail === '' ? 'none' : 'auto'}
          style={[
            styles.background,
            {
              opacity: backgroundOpacity
            }
          ]}
        />
      </TouchableWithoutFeedback>

      <BottomSheet
        ref={(ref) => (sheetRef.current = ref)}
        snapPoints={[maxSheetHeight, intermediateSheetHeight, 0]}
        initialSnap={2}
        callbackNode={callbackNode}
        overdragResistanceFactor={1.5}
        enabledBottomClamp={true}
        enabledContentGestureInteraction={false}
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
    marginHorizontal: HORIZONTAL_PADDING,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  contentWrapper: {
    backgroundColor: theme.COLORS.WHITE
  },
  userWrapper: {
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
  splitProperty: {
    width: '50%'
  },
  splitPropertyFifths: {
    width: '20%'
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
