import React from 'react';
import { StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useSafeArea } from 'react-native-safe-area-context';

import { TRedux } from '@reducers';
import { _auth, _kappa } from '@reducers/actions';
import { theme } from '@constants';
import { Block, Text, Header } from '@components';
import { NavigationTypes } from '@types';
import { sortEventByDate, shouldLoad } from '@services/kappaService';
import { HeaderHeight } from '@services/utils';

const MessagesContent: React.FC<{
  navigation: NavigationTypes.ParamType;
}> = ({ navigation }) => {
  const user = useSelector((state: TRedux) => state.auth.user);
  const loadHistory = useSelector((state: TRedux) => state.kappa.loadHistory);
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
          <Block style={styles.content}></Block>
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
  }
});

export default MessagesContent;
