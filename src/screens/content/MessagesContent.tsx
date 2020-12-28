import React from 'react';
import { StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useSafeArea } from 'react-native-safe-area-context';
import moment from 'moment';
import { useIsFocused, NavigationProp } from '@react-navigation/native';

import { TRedux } from '@reducers';
import { _kappa, _voting } from '@reducers/actions';
import { shouldLoad, sortEventsByDateReverse, getExcusedEvents, getEventById } from '@services/kappaService';
import { HeaderHeight, HORIZONTAL_PADDING, isEmpty } from '@services/utils';
import { TPendingExcuse, TExcuse } from '@backend/kappa';
import { ExcusePage, LateExcusePage } from '@pages';
import { theme } from '@constants';
import { Block, Text, Header, EndCapButton, LocalModalController, FullPageModal } from '@components';

const MessagesContent: React.FC<{
  navigation: NavigationProp<any, 'Messages'>;
}> = ({ navigation }) => {
  const isFocused = useIsFocused();

  const user = useSelector((state: TRedux) => state.auth.user);
  const loadHistory = useSelector((state: TRedux) => state.kappa.loadHistory);
  const directory = useSelector((state: TRedux) => state.kappa.directory);
  const events = useSelector((state: TRedux) => state.kappa.events);
  const records = useSelector((state: TRedux) => state.kappa.records);
  const pendingExcusesArray = useSelector((state: TRedux) => state.kappa.pendingExcusesArray);
  const isGettingExcuses = useSelector((state: TRedux) => state.kappa.isGettingExcuses);
  const getExcusesError = useSelector((state: TRedux) => state.kappa.getExcusesError);
  const activeSession = useSelector((state: TRedux) => state.voting.activeSession);

  const [refreshing, setRefreshing] = React.useState<boolean>(false);
  const [selectedExcuse, setSelectedExcuse] = React.useState<TPendingExcuse>(null);
  const [showingRequestPage, setShowingRequestPage] = React.useState<boolean>(false);

  const dispatch = useDispatch();
  const dispatchGetExcuses = React.useCallback(() => dispatch(_kappa.getExcuses(user)), [dispatch, user]);
  const dispatchShowVoting = React.useCallback(() => dispatch(_voting.showVoting()), [dispatch]);

  const insets = useSafeArea();

  const excused = getExcusedEvents(records, user.email);
  const excusedArray = Object.values(excused)
    .filter((excuse) => excuse.approved)
    .map((excuse: TExcuse) => {
      const event = getEventById(events, excuse.eventId);

      if (isEmpty(event)) return null;

      return {
        ...excuse,
        title: event.title,
        start: event.start,
        prettyStart: moment(event.start).format('ddd LLL')
      };
    })
    .filter((excuse) => excuse !== null)
    .sort(sortEventsByDateReverse);

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

  const onPressVote = React.useCallback(() => {
    dispatchShowVoting();
  }, [dispatchShowVoting]);

  React.useEffect(() => {
    if (selectedExcuse === null) return;

    if (
      pendingExcusesArray.findIndex(
        (excuse: TPendingExcuse) => excuse.eventId === selectedExcuse.eventId && excuse.email === selectedExcuse.email
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

  const getExcuseRequester = React.useCallback(
    (excuse: TPendingExcuse) => {
      if (directory.hasOwnProperty(excuse.email)) {
        return `${directory[excuse.email].givenName} ${directory[excuse.email].familyName}`;
      }

      return excuse.email;
    },
    [directory]
  );

  const renderExcuse = (excuse: TPendingExcuse, separator: boolean = true, disable: boolean = false) => {
    if (excuse === null) return <React.Fragment />;

    return (
      <React.Fragment key={`${excuse.eventId}:${excuse.email}`}>
        <TouchableOpacity disabled={!user.privileged || disable} onPress={() => onSelectExcuse(excuse)}>
          <Block style={styles.excuseContainer}>
            <Text style={styles.excuseRequester}>{getExcuseRequester(excuse)}</Text>

            <Block style={styles.excuseEvent}>
              <Text style={styles.excuseEventTitle}>{excuse.title}</Text>
              <Text style={styles.excuseEventStart}>{moment(excuse.start).format('MM/DD')}</Text>
              {excuse.late && <Text style={styles.excuseLate}>LATE</Text>}
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
            {activeSession !== null && (
              <Block style={styles.votingContainer}>
                <Block style={styles.votingDetails}>
                  <Text style={styles.votingName}>{activeSession.name}</Text>
                  <Text style={styles.description}>Cast your vote to help shape the future of our fraternity.</Text>
                </Block>

                <TouchableOpacity activeOpacity={0.6} onPress={onPressVote}>
                  <Block style={styles.votingButton}>
                    <Text style={styles.votingButtonText}>Vote</Text>
                  </Block>
                </TouchableOpacity>
              </Block>
            )}

            <Text style={styles.propertyHeader}>Pending</Text>
            {pendingExcusesArray.length === 0 ? (
              <Text style={styles.description}>You have no pending excuses</Text>
            ) : (
              pendingExcusesArray.sort(sortEventsByDateReverse).map((excuse) => renderExcuse(excuse))
            )}

            <Text
              style={[
                styles.propertyHeader,
                {
                  marginTop: 16,
                  marginBottom: 0
                }
              ]}
            >
              Approved
            </Text>
            {excusedArray.length === 0 ? (
              <Text style={styles.description}>You have no approved excuses</Text>
            ) : (
              excusedArray.map((excuse) => (
                <Block key={`${excuse.eventId}:${excuse.email}`} style={styles.approvedWrapper}>
                  <Text style={styles.approvedTitle}>{excuse.title}</Text>
                  <Text style={styles.approvedStart}>{excuse.prettyStart}</Text>
                </Block>
              ))
            )}
          </Block>
        </ScrollView>
      </Block>

      <LocalModalController>
        <FullPageModal visible={selectedExcuse !== null} onDoneClosing={() => onSelectExcuse(null)}>
          <ExcusePage
            excuse={selectedExcuse}
            renderExcuse={renderExcuse(selectedExcuse, false, true)}
            onRequestClose={() => onSelectExcuse(null)}
          />
        </FullPageModal>

        <FullPageModal visible={showingRequestPage} onDoneClosing={() => setShowingRequestPage(false)}>
          <LateExcusePage onRequestClose={() => setShowingRequestPage(false)} />
        </FullPageModal>
      </LocalModalController>
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
  },
  propertyHeader: {
    marginBottom: 8,
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 13,
    textTransform: 'uppercase',
    color: theme.COLORS.GRAY
  },
  description: {
    fontFamily: 'OpenSans',
    fontSize: 12
  },
  approvedWrapper: {
    width: '100%',
    height: 48,
    borderBottomColor: theme.COLORS.LIGHT_GRAY,
    borderBottomWidth: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  approvedTitle: {
    fontFamily: 'OpenSans',
    fontSize: 15,
    color: theme.COLORS.BLACK
  },
  approvedStart: {
    fontFamily: 'OpenSans',
    fontSize: 12,
    color: theme.COLORS.DARK_GRAY
  },
  votingContainer: {
    marginVertical: HORIZONTAL_PADDING,
    padding: HORIZONTAL_PADDING,
    borderRadius: 20,
    backgroundColor: theme.COLORS.SUPER_LIGHT_BLUE_GRAY,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  votingDetails: {
    flex: 1
  },
  votingName: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 15
  },
  votingButton: {
    marginLeft: 8,
    paddingVertical: 4,
    paddingHorizontal: 24,
    borderRadius: 100,
    backgroundColor: theme.COLORS.LIGHT_GRAY
  },
  votingButtonText: {
    fontFamily: 'OpenSans-Bold',
    color: theme.COLORS.PRIMARY,
    fontSize: 15,
    textTransform: 'uppercase'
  }
});

export default MessagesContent;
