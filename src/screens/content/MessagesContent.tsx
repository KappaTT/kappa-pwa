import React from 'react';
import { StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useSafeArea } from 'react-native-safe-area-context';
import moment from 'moment';
import { useIsFocused } from 'react-navigation-hooks';

import { TRedux } from '@reducers';
import { _auth, _kappa } from '@reducers/actions';
import { theme } from '@constants';
import { Block, Text, Header, FadeModal, SlideModal, EndCapButton } from '@components';
import { NavigationTypes } from '@types';
import { sortEventByDate, shouldLoad } from '@services/kappaService';
import { HeaderHeight, HORIZONTAL_PADDING } from '@services/utils';
import { TPendingExcuse } from '@backend/kappa';
import { ExcusePage, LateExcusePage } from '@pages';

const MessagesContent: React.FC<{
  navigation: NavigationTypes.ParamType;
}> = ({ navigation }) => {
  const isFocused = useIsFocused();

  const user = useSelector((state: TRedux) => state.auth.user);
  const loadHistory = useSelector((state: TRedux) => state.kappa.loadHistory);
  const directory = useSelector((state: TRedux) => state.kappa.directory);
  const pendingExcusesArray = useSelector((state: TRedux) => state.kappa.pendingExcusesArray);
  const isGettingExcuses = useSelector((state: TRedux) => state.kappa.isGettingExcuses);
  const getExcusesError = useSelector((state: TRedux) => state.kappa.getExcusesError);

  const [refreshing, setRefreshing] = React.useState<boolean>(false);
  const [selectedExcuse, setSelectedExcuse] = React.useState<TPendingExcuse>(null);
  const [showingRequestPage, setShowingRequestPage] = React.useState<boolean>(false);

  const dispatch = useDispatch();
  const dispatchGetExcuses = React.useCallback(() => dispatch(_kappa.getExcuses(user)), [dispatch, user]);

  const insets = useSafeArea();

  const loadData = React.useCallback(
    (force: boolean) => {
      if (!isGettingExcuses && (force || (!getExcusesError && shouldLoad(loadHistory, 'excuses'))))
        dispatchGetExcuses();
    },
    [isGettingExcuses, getExcusesError, loadHistory, dispatchGetExcuses]
  );

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    loadData(true);
  }, [loadData]);

  const onSelectExcuse = React.useCallback(
    (excuse: TPendingExcuse) => {
      if (excuse === null || user.privileged) {
        setSelectedExcuse(excuse);
      }
    },
    [user]
  );

  React.useEffect(() => {
    if (selectedExcuse === null) return;

    if (
      pendingExcusesArray.findIndex(
        (excuse: TPendingExcuse) => excuse.event_id === selectedExcuse.event_id && excuse.netid === selectedExcuse.netid
      ) === -1
    ) {
      setSelectedExcuse(null);
    }
  }, [pendingExcusesArray, selectedExcuse]);

  React.useEffect(() => {
    if (!isGettingExcuses) {
      setRefreshing(false);
    }
  }, [isGettingExcuses]);

  React.useEffect(() => {
    if (isFocused && user.sessionToken) {
      loadData(false);
    }
  }, [user.sessionToken, isFocused, loadData]);

  const getExcuseRequester = (excuse: TPendingExcuse) => {
    const email = `${excuse.netid}@illinois.edu`;

    if (directory.hasOwnProperty(email)) {
      return `${directory[email].givenName} ${directory[email].familyName}`;
    }

    return excuse.netid;
  };

  const renderExcuse = (excuse: TPendingExcuse, separator: boolean = true, disable: boolean = false) => {
    if (excuse === null) return <React.Fragment />;

    return (
      <React.Fragment key={`${excuse.event_id}:${excuse.netid}`}>
        <TouchableOpacity disabled={!user.privileged || disable} onPress={() => onSelectExcuse(excuse)}>
          <Block style={styles.excuseContainer}>
            <Text style={styles.excuseRequester}>{getExcuseRequester(excuse)}</Text>

            <Block style={styles.excuseEvent}>
              <Text style={styles.excuseEventTitle}>{excuse.title}</Text>
              <Text style={styles.excuseEventStart}>{moment(excuse.start).format('MM/DD')}</Text>
              {excuse.late === 1 && <Text style={styles.excuseLate}>LATE</Text>}
            </Block>

            <Text style={styles.excuseReason}>{excuse.reason}</Text>
          </Block>
        </TouchableOpacity>

        {separator && <Block style={styles.separator} />}
      </React.Fragment>
    );
  };

  return (
    <Block flex>
      <Header
        title="Messages"
        rightButton={<EndCapButton label="Request" onPress={() => setShowingRequestPage(true)} />}
      />

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
            {pendingExcusesArray.sort(sortEventByDate).map((excuse) => renderExcuse(excuse))}
          </Block>
        </ScrollView>
      </Block>

      <FadeModal transparent={true} visible={selectedExcuse !== null} onRequestClose={() => onSelectExcuse(null)}>
        <ExcusePage
          excuse={selectedExcuse}
          renderExcuse={renderExcuse(selectedExcuse, false, true)}
          onRequestClose={() => onSelectExcuse(null)}
        />
      </FadeModal>
      <SlideModal transparent={false} visible={showingRequestPage} onRequestClose={() => setShowingRequestPage(false)}>
        <LateExcusePage onRequestClose={() => setShowingRequestPage(false)} />
      </SlideModal>
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
    paddingHorizontal: HORIZONTAL_PADDING
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
  excuseLate: {
    marginLeft: 8,
    fontFamily: 'OpenSans-Bold',
    fontSize: 13,
    color: theme.COLORS.PRIMARY
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
