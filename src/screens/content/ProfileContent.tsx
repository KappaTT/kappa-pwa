import React from 'react';
import { StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useSafeArea } from 'react-native-safe-area-context';
import { ProgressCircle } from 'react-native-svg-charts';
import moment from 'moment';

import { TRedux } from '@reducers';
import { _auth, _kappa } from '@reducers/actions';
import { theme } from '@constants';
import { Block, Text, Icon } from '@components';
import { NavigationTypes } from '@types';
import {
  getAttendedEvents,
  getExcusedEvents,
  getTypeCounts,
  prettyPhone,
  sortEventByDate,
  shouldLoad
} from '@services/kappaService';
import { isEmpty } from '@services/utils';
import { log } from '@services/logService';
import { TEvent } from '@backend/kappa';

const ProfileContent: React.FC<{
  navigation: NavigationTypes.ParamType;
}> = ({ navigation }) => {
  const user = useSelector((state: TRedux) => state.auth.user);
  const loadHistory = useSelector((state: TRedux) => state.kappa.loadHistory);
  const events = useSelector((state: TRedux) => state.kappa.events);
  const gmCount = useSelector((state: TRedux) => state.kappa.gmCount);
  const records = useSelector((state: TRedux) => state.kappa.records);
  const missedMandatory = useSelector((state: TRedux) => state.kappa.missedMandatory);

  const [refreshing, setRefreshing] = React.useState<boolean>(false);

  const dispatch = useDispatch();
  const dispatchEdit = React.useCallback(() => dispatch(_auth.showOnboarding(true)), [dispatch]);
  const dispatchSignOut = React.useCallback(() => dispatch(_auth.signOut()), [dispatch]);
  const dispatchGetEvents = React.useCallback(() => dispatch(_kappa.getEvents(user)), [dispatch, user]);
  const dispatchGetMyAttendance = React.useCallback(() => dispatch(_kappa.getMyAttendance(user)), [dispatch, user]);

  const insets = useSafeArea();

  const loadData = React.useCallback(
    (force: boolean) => {
      if (force || shouldLoad(loadHistory, 'events')) dispatchGetEvents();
      if (force || shouldLoad(loadHistory, user.email)) dispatchGetMyAttendance();
    },
    [user, loadHistory]
  );

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    setTimeout(() => loadData(true), 500);
  }, [user, refreshing]);

  const attended = React.useMemo(() => {
    if (!user.privileged) return {};

    return getAttendedEvents(records, user.email);
  }, [user, records]);

  const excused = React.useMemo(() => {
    if (!user.privileged) return {};

    return getExcusedEvents(records, user.email);
  }, [user, records]);

  const gmCounts = React.useMemo(() => {
    return getTypeCounts(events, attended, excused, 'GM');
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

  const mandatory = React.useMemo(() => {
    if (!user.privileged) return [];

    if (isEmpty(missedMandatory[user.email])) return [];

    return Object.values(missedMandatory[user.email]).sort(sortEventByDate);
  }, [user, missedMandatory]);

  React.useEffect(() => {
    if (user?.sessionToken) {
      loadData(false);
    }
  }, [user]);

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
        </Block>
      </Block>
    );
  };

  return (
    <Block flex>
      <ScrollView>
        <Block
          style={[
            styles.content,
            {
              paddingTop: insets.top + 20
            }
          ]}
        >
          <Block style={styles.header}>
            <Block style={styles.headerTextWrapper}>
              <Text style={styles.title}>Hi {user.givenName}</Text>
              <Text style={styles.subtitle}>{user.role}</Text>
            </Block>

            <TouchableOpacity onPress={dispatchEdit}>
              <Icon style={styles.editButton} family="MaterialIcons" name="edit" size={24} />
            </TouchableOpacity>
          </Block>

          <Block>
            <Block style={styles.splitPropertyRow}>
              <Block style={styles.splitProperty}>
                <Text style={styles.propertyHeader}>Grad Year</Text>
                <Text style={styles.propertyValue}>{user.gradYear}</Text>
              </Block>
              <Block style={styles.splitProperty}>
                <Text style={styles.propertyHeader}>Pledge Class</Text>
                <Text style={styles.propertyValue}>{user.semester}</Text>
              </Block>
            </Block>
            <Block style={styles.splitPropertyRow}>
              <Block style={styles.splitProperty}>
                <Text style={styles.propertyHeader}>Email</Text>
                <Text style={styles.propertyValue}>{user.email}</Text>
              </Block>
              <Block style={styles.splitProperty}>
                <Text style={styles.propertyHeader}>Phone</Text>
                <Text style={styles.propertyValue}>{user.phone ? prettyPhone(user.phone) : ''}</Text>
              </Block>
            </Block>
          </Block>

          <Block>{renderAdmin()}</Block>
        </Block>
      </ScrollView>
    </Block>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  headerTextWrapper: {},
  title: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 24
  },
  subtitle: {
    fontFamily: 'OpenSans',
    fontSize: 13,
    color: theme.COLORS.GRAY
  },
  editButton: {
    paddingTop: 6
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

export default ProfileContent;
