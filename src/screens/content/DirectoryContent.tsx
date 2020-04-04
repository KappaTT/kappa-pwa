import React from 'react';
import { StyleSheet, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Placeholder, PlaceholderLine, Fade } from 'rn-placeholder';
import { useSafeArea } from 'react-native-safe-area-context';
import moment from 'moment';

import { theme } from '@constants';
import { TRedux } from '@reducers';
import { _kappa } from '@reducers/actions';
import { Block, Header, EndCapButton, Text, Icon } from '@components';
import { NavigationTypes } from '@types';
import { HeaderHeight, isEmpty } from '@services/utils';
import { log } from '@services/logService';
import { TUser } from '@backend/auth';
import { hasValidCheckIn } from '@services/kappaService';

const UserSkeleton: React.FC<{}> = ({}) => {
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

const DirectoryContent: React.FC<{
  navigation: NavigationTypes.ParamType;
}> = ({ navigation }) => {
  const user = useSelector((state: TRedux) => state.auth.user);
  const directory = useSelector((state: TRedux) => state.kappa.directory);
  const missedMandatory = useSelector((state: TRedux) => state.kappa.missedMandatory);
  const gettingEvents = useSelector((state: TRedux) => state.kappa.gettingEvents);
  const gettingDirectory = useSelector((state: TRedux) => state.kappa.gettingDirectory);
  const gettingAttendance = useSelector((state: TRedux) => state.kappa.gettingAttendance);
  const getEventsError = useSelector((state: TRedux) => state.kappa.getEventsError);
  const events = useSelector((state: TRedux) => state.kappa.events);

  const [refreshing, setRefreshing] = React.useState<boolean>(gettingEvents || gettingDirectory || gettingAttendance);

  const dispatch = useDispatch();
  const dispatchGetEvents = React.useCallback(() => dispatch(_kappa.getEvents(user)), [dispatch, user]);
  const dispatchGetMyAttendance = React.useCallback(() => dispatch(_kappa.getMyAttendance(user)), [dispatch, user]);
  const dispatchGetDirectory = React.useCallback(() => dispatch(_kappa.getDirectory(user)), [dispatch, user]);
  const dispatchSelectUser = React.useCallback((email: string) => dispatch(_kappa.selectUser(email)), [dispatch]);

  const insets = useSafeArea();

  const scrollRef = React.useRef(undefined);

  const loadData = () => {
    dispatchGetEvents();
    dispatchGetMyAttendance();
    dispatchGetDirectory();
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    setTimeout(loadData, 500);
  }, [refreshing]);

  React.useEffect(() => {
    if (!gettingEvents && !gettingDirectory && !gettingAttendance) {
      setRefreshing(false);
    }
  }, [gettingEvents, gettingDirectory, gettingAttendance]);

  React.useEffect(() => {
    if (user?.sessionToken) {
      loadData();
    }
  }, [user]);

  const keyExtractor = (item: TUser) => item._id;

  const renderItem = ({ item }: { item: TUser }) => {
    return (
      <React.Fragment>
        <TouchableOpacity onPress={() => dispatchSelectUser(item.email)}>
          <Block style={styles.userContainer}>
            <Block style={styles.userHeader}>
              <Block style={styles.userNameContainer}>
                <Text style={styles.userName}>
                  {item.familyName}, {item.givenName}
                </Text>

                {user.privileged === true && !isEmpty(missedMandatory[item.email]) && (
                  <Icon
                    style={styles.mandatoryIcon}
                    family="Feather"
                    name="alert-circle"
                    size={14}
                    color={theme.COLORS.PRIMARY}
                  />
                )}
              </Block>

              <Block style={styles.selectIcon}>
                <Text style={styles.userRole}>{item.role}</Text>
                <Icon family="MaterialIcons" name="keyboard-arrow-right" size={36} color={theme.COLORS.PRIMARY} />
              </Block>
            </Block>
          </Block>
        </TouchableOpacity>
      </React.Fragment>
    );
  };

  return (
    <Block flex>
      <Header title="Directory" />

      <Block
        style={[
          styles.wrapper,
          {
            top: insets.top + HeaderHeight
          }
        ]}
      >
        {gettingDirectory && isEmpty(events) ? (
          <Block style={styles.loadingContainer}>
            <UserSkeleton />
            <Block style={styles.separator} />
            <UserSkeleton />
            <Block style={styles.separator} />
            <UserSkeleton />
            <Block style={styles.separator} />
            <UserSkeleton />
            <Block style={styles.separator} />
            <UserSkeleton />
          </Block>
        ) : (
          <FlatList
            ref={ref => (scrollRef.current = ref)}
            data={Object.values(directory).sort((a, b) => {
              const nameA = `${a.familyName}, ${b.givenName}`;
              const nameB = `${b.familyName}, ${b.givenName}`;

              return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
            })}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
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
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: theme.COLORS.WHITE
  },
  container: {
    display: 'flex',
    justifyContent: 'center'
  },
  separator: {
    marginHorizontal: 24,
    marginBottom: 16,
    borderBottomColor: theme.COLORS.LIGHT_BORDER,
    borderBottomWidth: 1
  },
  userContainer: {
    marginHorizontal: 24,
    height: 48,
    borderBottomColor: theme.COLORS.LIGHT_BORDER,
    borderBottomWidth: 1
  },
  userHeader: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  userName: {
    fontFamily: 'OpenSans',
    fontSize: 16,
    color: theme.COLORS.BLACK
  },
  userNameContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  mandatoryIcon: {
    marginLeft: 4
  },
  userRole: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 13,
    color: theme.COLORS.GRAY,
    textTransform: 'uppercase'
  },
  selectIcon: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  }
});

export default DirectoryContent;
