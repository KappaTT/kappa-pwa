import React from 'react';
import { StyleSheet, Dimensions, TouchableWithoutFeedback, ScrollView, RefreshControl } from 'react-native';
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
  getAttendedEvents,
  getExcusedEvents,
  getUserRecordCounts,
  getTypeCount,
  prettyPhone,
  sortEventByDate
} from '@services/kappaService';
import { theme } from '@constants';
import { TabBarHeight, isEmpty } from '@services/utils';
import { TEvent } from '@backend/kappa';
import Block from '@components/Block';
import Ghost from '@components/Ghost';
import Text from '@components/Text';
import RoundButton from '@components/RoundButton';
import Icon from '@components/Icon';

const { width, height } = Dimensions.get('screen');

const BrotherDrawer: React.FC<{}> = ({}) => {
  const user = useSelector((state: TRedux) => state.auth.user);
  const events = useSelector((state: TRedux) => state.kappa.events);
  const gmCount = useSelector((state: TRedux) => state.kappa.gmCount);
  const records = useSelector((state: TRedux) => state.kappa.records);
  const missedMandatory = useSelector((state: TRedux) => state.kappa.missedMandatory);
  const gettingAttendance = useSelector((state: TRedux) => state.kappa.gettingAttendance);
  const selectedUserEmail = useSelector((state: TRedux) => state.kappa.selectedUserEmail);
  const selectedUser = useSelector((state: TRedux) => state.kappa.selectedUser);

  const [refreshing, setRefreshing] = React.useState<boolean>(gettingAttendance);

  const dispatch = useDispatch();
  const dispatchGetAttendance = React.useCallback(() => dispatch(_kappa.getUserAttendance(user, selectedUserEmail)), [
    dispatch,
    user,
    selectedUserEmail
  ]);
  const dispatchUnselectUser = React.useCallback(() => dispatch(_kappa.unselectUser()), [dispatch]);

  const insets = useSafeArea();

  const sheetRef = React.useRef(undefined);
  const scrollRef = React.useRef(undefined);

  const sheetHeight = Math.max((height - insets.top) * 0.67 + insets.bottom, 600);

  const [snapPoint, setSnapPoint] = React.useState<number>(1);
  const [callbackNode, setCallbackNode] = React.useState(new Animated.Value(0));

  const backgroundOpacity = callbackNode.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 0]
  });

  const loadData = () => {
    if (user.privileged) {
      dispatchGetAttendance();
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    setTimeout(loadData, 500);
  }, [refreshing]);

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

  const attended = React.useMemo(() => {
    if (!user.privileged) return [];

    return getAttendedEvents(records, selectedUserEmail);
  }, [user, records, selectedUserEmail]);

  const excused = React.useMemo(() => {
    if (!user.privileged) return [];

    return getExcusedEvents(records, selectedUserEmail);
  }, [user, records, selectedUserEmail]);

  const gmCounts = React.useMemo(() => {
    return getTypeCount(events, attended, excused, 'GM');
  }, [events, attended, excused]);

  const gmStats = React.useMemo(() => {
    if (!user.privileged)
      return {
        raw: 0,
        percent: '0%'
      };

    const fraction = gmCount === 0 ? 0 : gmCounts.sum / gmCount;

    return {
      raw: fraction,
      percent: `${Math.round(fraction * 100)}%`
    };
  }, [user, gmCount, gmCounts]);

  const recordCounts = React.useMemo(() => {
    return getUserRecordCounts(records, selectedUserEmail);
  }, [records, selectedUserEmail]);

  const mandatory = React.useMemo(() => {
    if (!user.privileged) return [];

    if (isEmpty(missedMandatory[user.email])) return [];

    return Object.values(missedMandatory[user.email]).sort(sortEventByDate);
  }, [user, missedMandatory]);

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

    dispatchUnselectUser();
  };

  React.useEffect(() => {
    if (!gettingAttendance) {
      setRefreshing(false);
    }
  }, [gettingAttendance]);

  React.useEffect(() => {
    if (selectedUserEmail === '') {
      snapTo(1);
    } else {
      snapTo(0);

      loadData();
    }
  }, [selectedUserEmail]);

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
        <Block style={styles.adminChartsContainer}>
          <Block style={styles.circleChartContainer}>
            <ProgressCircle
              style={styles.circleChart}
              progress={gmStats.raw}
              progressColor={theme.COLORS.PRIMARY}
              startAngle={-Math.PI * 0.8}
              endAngle={Math.PI * 0.8}
            />
            <Block style={styles.circleChartLabels}>
              <Text style={styles.circleChartValue}>{gmStats.percent}</Text>
              <Text style={styles.circleChartTitle}>GM</Text>
            </Block>
          </Block>

          <Block style={styles.chartPropertyContainer}>
            <Block style={styles.chartProperty}>
              <Text style={styles.chartPropertyLabel}>Attended</Text>
              <Text style={styles.chartPropertyValue}>{gmCounts.attended}</Text>
            </Block>
            <Block style={styles.chartProperty}>
              <Text style={styles.chartPropertyLabel}>Excused</Text>
              <Text style={styles.chartPropertyValue}>{gmCounts.excused}</Text>
            </Block>
            <Block style={styles.chartProperty}>
              <Text style={styles.chartPropertyLabel}>Pending</Text>
              <Text style={styles.chartPropertyValue}>{gmCounts.pending}</Text>
            </Block>
          </Block>
        </Block>

        <Block style={styles.eventList}>
          {mandatory.length > 0 && (
            <React.Fragment>
              <Text
                style={[
                  styles.chartPropertyLabel,
                  {
                    color: theme.COLORS.PRIMARY
                  }
                ]}
              >
                Missed Mandatory
              </Text>
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
            height: sheetHeight - 48
          }
        ]}
      >
        {selectedUser !== null && (
          <React.Fragment>
            <ScrollView
              ref={ref => (scrollRef.current = ref)}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
              scrollIndicatorInsets={{ right: 1 }}
            >
              <Block style={styles.userWrapper}>
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
                      <Text style={styles.propertyHeader}>Email</Text>
                      <Text style={styles.propertyValue}>{selectedUser.email}</Text>
                    </Block>
                    <Block style={styles.splitProperty}>
                      <Text style={styles.propertyHeader}>Phone</Text>
                      <Text style={styles.propertyValue}>
                        {selectedUser.phone ? prettyPhone(selectedUser.phone) : ''}
                      </Text>
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
  userWrapper: {
    paddingHorizontal: 24
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
    fontSize: 24
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
    fontSize: 17
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
