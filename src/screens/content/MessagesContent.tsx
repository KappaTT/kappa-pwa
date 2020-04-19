import React from 'react';
import { StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useSafeArea } from 'react-native-safe-area-context';
import moment from 'moment';

import { TRedux } from '@reducers';
import { _auth, _kappa } from '@reducers/actions';
import { theme } from '@constants';
import { Block, Text, Header } from '@components';
import { NavigationTypes } from '@types';
import { sortEventByDate, shouldLoad } from '@services/kappaService';
import { HeaderHeight } from '@services/utils';
import { TPendingExcuse } from '@backend/kappa';

const MessagesContent: React.FC<{
  navigation: NavigationTypes.ParamType;
}> = ({ navigation }) => {
  const user = useSelector((state: TRedux) => state.auth.user);
  const loadHistory = useSelector((state: TRedux) => state.kappa.loadHistory);
  const directory = useSelector((state: TRedux) => state.kappa.directory);
  const pendingExcusesArray = useSelector((state: TRedux) => state.kappa.pendingExcusesArray);
  const gettingExcuses = useSelector((state: TRedux) => state.kappa.gettingExcuses);

  const [refreshing, setRefreshing] = React.useState<boolean>(false);

  const dispatch = useDispatch();
  const dispatchGetExcuses = React.useCallback(() => dispatch(_kappa.getExcuses(user)), [dispatch, user]);

  const insets = useSafeArea();

  const loadData = React.useCallback(
    (force: boolean) => {
      if (force || shouldLoad(loadHistory, 'excuses')) dispatchGetExcuses();
    },
    [user, loadHistory]
  );

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    loadData(true);
  }, [user, refreshing]);

  React.useEffect(() => {
    if (!gettingExcuses) {
      setRefreshing(false);
    }
  }, [gettingExcuses]);

  React.useEffect(() => {
    if (user?.sessionToken) {
      loadData(false);
    }
  }, [user]);

  const getExcuseRequester = (excuse: TPendingExcuse) => {
    const email = `${excuse.netid}@illinois.edu`;

    if (directory.hasOwnProperty(email)) {
      return `${directory[email].givenName} ${directory[email].familyName}`;
    }

    return excuse.netid;
  };

  const renderExcuse = (excuse: TPendingExcuse) => {
    return (
      <React.Fragment key={`${excuse.event_id}:${excuse.netid}`}>
        <Block style={styles.excuseContainer}>
          <Text style={styles.excuseRequester}>{getExcuseRequester(excuse)}</Text>

          <Block style={styles.excuseEvent}>
            <Text style={styles.excuseEventTitle}>{excuse.title}</Text>
            <Text style={styles.excuseEventStart}>{moment(excuse.start).format('MM/DD')}</Text>
          </Block>

          <Text style={styles.excuseReason}>{excuse.reason}</Text>
        </Block>

        <Block style={styles.separator} />
      </React.Fragment>
    );
  };

  return (
    <Block flex>
      <Header title="Messages" />

      <Block
        style={[
          styles.wrapper,
          {
            top: insets.top + HeaderHeight
          }
        ]}
      >
        <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
          <Block style={styles.content}>
            {pendingExcusesArray.sort(sortEventByDate).map(excuse => renderExcuse(excuse))}
          </Block>
        </ScrollView>
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
  content: {
    minHeight: '100%',
    paddingHorizontal: 20
  },
  excuseContainer: {
    paddingBottom: 16
  },
  excuseRequester: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 16
  },
  excuseEvent: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  excuseEventTitle: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 13,
    color: theme.COLORS.DARK_GRAY
  },
  excuseEventStart: {
    marginLeft: 8,
    fontFamily: 'OpenSans',
    fontSize: 13,
    color: theme.COLORS.DARK_GRAY
  },
  excuseReason: {
    marginTop: 12
  },
  separator: {
    marginBottom: 16,
    borderBottomColor: theme.COLORS.LIGHT_BORDER,
    borderBottomWidth: 1
  }
});

export default MessagesContent;
