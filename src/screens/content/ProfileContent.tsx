import React from 'react';
import { StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useSafeArea } from 'react-native-safe-area-context';

import { TRedux } from '@reducers';
import { _auth, _kappa } from '@reducers/actions';
import { theme } from '@constants';
import { Block, Text, Icon } from '@components';
import { NavigationTypes } from '@types';
import { log } from '@services/logService';
import { shouldLoad } from '@services/kappaService';

const ProfileContent: React.FC<{
  navigation: NavigationTypes.ParamType;
}> = ({ navigation }) => {
  const user = useSelector((state: TRedux) => state.auth.user);
  const loadHistory = useSelector((state: TRedux) => state.kappa.loadHistory);
  const events = useSelector((state: TRedux) => state.kappa.events);
  const gmCount = useSelector((state: TRedux) => state.kappa.gmCount);
  const records = useSelector((state: TRedux) => state.kappa.records);

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
  }, [user, refreshing]);

  React.useEffect(() => {
    if (user?.sessionToken) {
      loadData(false);
    }
  }, [user]);

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
              <Text style={styles.subtitle}>{user.email}</Text>
            </Block>

            <TouchableOpacity onPress={dispatchEdit}>
              <Icon style={styles.editButton} family="MaterialIcons" name="edit" size={24} />
            </TouchableOpacity>
          </Block>
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
    paddingTop: 8
  }
});

export default ProfileContent;
