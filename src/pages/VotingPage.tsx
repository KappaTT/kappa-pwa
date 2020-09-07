import React from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  View,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useSafeArea } from 'react-native-safe-area-context';
import moment from 'moment';

import { TRedux } from '@reducers';
import { _kappa, _ui, _voting } from '@reducers/actions';
import { TEvent } from '@backend/kappa';
import { TVote, TCandidate } from '@backend/voting';
import { getVotes, getVotesBySession } from '@services/votingService';
import { theme } from '@constants';
import { Header, EndCapButton, Icon, FormattedInput, RoundButton, TextButton } from '@components';
import { HeaderHeight, HORIZONTAL_PADDING } from '@services/utils';

const VotingPage: React.FC<{
  onRequestClose(): void;
}> = ({ onRequestClose }) => {
  const user = useSelector((state: TRedux) => state.auth.user);
  const eventArray = useSelector((state: TRedux) => state.kappa.eventArray);
  const activeSession = useSelector((state: TRedux) => state.voting.activeSession);
  const candidateArray = useSelector((state: TRedux) => state.voting.candidateArray);
  const sessionToCandidateToVotes = useSelector((state: TRedux) => state.voting.sessionToCandidateToVotes);
  const isSubmittingVote = useSelector((state: TRedux) => state.voting.isSubmittingVote);

  const maxVotes = React.useMemo(() => (activeSession?.maxVotes !== undefined ? activeSession.maxVotes : 0), [
    activeSession
  ]);

  const currentCandidate = React.useMemo(
    () => candidateArray.find((candidate) => candidate._id === activeSession?.currentCandidateId) || null,
    [activeSession, candidateArray]
  );

  const currentCandidateArray = React.useMemo(() => {
    if (activeSession?.type === 'MULTI') {
      return activeSession.candidateOrder
        .map((id) => candidateArray.find((candidate) => candidate._id === id) || null)
        .filter((candidate) => candidate !== null);
    }

    return [];
  }, [activeSession, candidateArray]);

  const currentCandidateId = React.useMemo(() => activeSession?.currentCandidateId || '', [activeSession]);

  const attendedEvents = React.useMemo(() => {
    if (!currentCandidate) return [];

    const events = [];

    for (const eventId of currentCandidate.events) {
      const event = eventArray.find((event) => event._id === eventId);

      if (event) {
        events.push(event);
      }
    }

    return events;
  }, [eventArray, currentCandidate]);

  const candidateIdToAttendedEvents = React.useMemo(() => {
    if (currentCandidateArray.length === 0) return {};

    const idToEvents = {};

    for (const candidate of currentCandidateArray) {
      const events = [];

      for (const eventId of candidate.events) {
        const event = eventArray.find((event) => event._id === eventId);

        if (event) {
          events.push(event);
        }
      }

      idToEvents[candidate._id] = events;
    }

    return idToEvents;
  }, [currentCandidateArray, eventArray]);

  const votes = getVotes(sessionToCandidateToVotes, activeSession?._id, activeSession?.currentCandidateId, {});
  const sessionVotes = getVotesBySession(sessionToCandidateToVotes, activeSession?._id);

  const currentVote = React.useMemo(() => votes.find((vote) => vote.userEmail === user.email) || null, [
    user.email,
    votes
  ]);

  const [pastVote, setPastVote] = React.useState<TVote>(null);
  const [verdict, setVerdict] = React.useState<boolean>(null);
  const [reason, setReason] = React.useState<string>('');
  const [selectedCandidates, setSelectedCandidates] = React.useState<string[]>([]);

  const readyToSubmit = React.useMemo(() => selectedCandidates.length > 0 && selectedCandidates.length <= maxVotes, [
    maxVotes,
    selectedCandidates.length
  ]);

  const dispatch = useDispatch();
  const dispatchSubmitVote = React.useCallback(
    () =>
      dispatch(
        _voting.submitVote(user, {
          sessionId: activeSession?._id,
          candidateId: currentCandidate?._id,
          verdict,
          reason: verdict ? '' : reason
        })
      ),
    [activeSession, currentCandidate, dispatch, reason, user, verdict]
  );
  const dispatchSubmitMultiVote = React.useCallback(
    () => dispatch(_voting.submitMultiVote(user, activeSession?._id, selectedCandidates)),
    [activeSession, dispatch, selectedCandidates, user]
  );

  const onPressReject = React.useCallback(() => setVerdict(verdict !== false ? false : null), [verdict]);
  const onPressApprove = React.useCallback(() => setVerdict(verdict !== true ? true : null), [verdict]);
  const onPressSelectCandidate = React.useCallback(
    (candidateId) => {
      if (selectedCandidates.indexOf(candidateId) >= 0) {
        setSelectedCandidates(selectedCandidates.filter((id) => id !== candidateId));
      } else {
        setSelectedCandidates([...selectedCandidates, candidateId]);
      }
    },
    [selectedCandidates]
  );

  const submitDisabled = React.useMemo(
    () => currentCandidate === null || verdict === null || (verdict === false && reason === ''),
    [currentCandidate, reason, verdict]
  );

  React.useEffect(() => {
    if (
      currentVote?._id !== pastVote?._id ||
      currentVote?.candidateId !== pastVote?.candidateId ||
      currentVote?.sessionId !== pastVote?.sessionId ||
      currentVote?.reason !== pastVote?.reason ||
      currentVote?.verdict !== pastVote?.verdict
    ) {
      setReason('');
      setVerdict(null);
      setPastVote(currentVote);
    }
  }, [currentVote, pastVote]);

  const insets = useSafeArea();

  const renderRegular = () => {
    return (
      <React.Fragment>
        <View style={styles.activeContent}>
          {currentCandidate !== null ? (
            <View style={styles.candidateArea}>
              <View style={styles.candidateHeader}>
                <View style={styles.candidateName}>
                  <Text style={styles.name}>
                    {currentCandidate.familyName}, {currentCandidate.givenName}
                  </Text>

                  {currentCandidate.approved && (
                    <Icon
                      style={styles.approvedIcon}
                      family="Feather"
                      name="check"
                      size={24}
                      color={theme.COLORS.PRIMARY_GREEN}
                    />
                  )}
                </View>
              </View>

              <View style={styles.splitPropertyRow}>
                <View style={styles.splitProperty}>
                  <Text style={styles.propertyHeader}>Year</Text>
                  <Text style={styles.propertyValue}>{currentCandidate.classYear}</Text>
                </View>
                <View style={styles.splitProperty}>
                  <Text style={styles.propertyHeader}>Major</Text>
                  <Text style={styles.propertyValue}>{currentCandidate.major}</Text>
                </View>
                <View style={styles.splitProperty}>
                  <Text style={styles.propertyHeader}>2nd Time Rush</Text>
                  <Text style={styles.propertyValue}>{currentCandidate.secondTimeRush ? 'Yes' : 'No'}</Text>
                </View>
              </View>

              <Text style={styles.propertyHeader}>Attended Events</Text>
              {attendedEvents.map((event: TEvent) => (
                <View key={event._id} style={styles.eventContainer}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <Text style={styles.eventDate}>{moment(event.start).format('MM/DD h:mm A')}</Text>
                </View>
              ))}
              {attendedEvents.length === 0 && <Text style={styles.noEvents}>No events</Text>}
            </View>
          ) : (
            <View style={styles.candidateArea}>
              <Text style={styles.noVotes}>
                There is currently no candidate being voted on. This page will automatically update.
              </Text>
            </View>
          )}
        </View>

        <View style={styles.propertyHeaderContainer}>
          <Text style={[styles.propertyHeader, { marginTop: 0 }]}>Your Vote</Text>
        </View>

        <View style={styles.voteContainer}>
          <View style={styles.verdictContainer}>
            <View style={styles.verdictButtonWrapper}>
              <TouchableOpacity activeOpacity={0.6} onPress={onPressReject}>
                <View
                  style={[
                    styles.verdict,
                    {
                      marginRight: 10
                    },
                    verdict === false && {
                      backgroundColor: `${theme.COLORS.PRIMARY}1A`,
                      borderColor: theme.COLORS.PRIMARY
                    }
                  ]}
                >
                  <Text style={[styles.verdictTitle, verdict === false && { color: theme.COLORS.PRIMARY }]}>
                    Reject
                  </Text>
                  <Text style={styles.submittedVote}>{currentVote?.verdict === false ? 'Submitted' : ''}</Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.verdictButtonWrapper}>
              <TouchableOpacity activeOpacity={0.6} onPress={onPressApprove}>
                <View
                  style={[
                    styles.verdict,
                    {
                      marginLeft: 10
                    },
                    verdict === true && {
                      backgroundColor: `${theme.COLORS.PRIMARY}1A`,
                      borderColor: theme.COLORS.PRIMARY
                    }
                  ]}
                >
                  <Text style={[styles.verdictTitle, verdict === true && { color: theme.COLORS.PRIMARY }]}>
                    Approve
                  </Text>
                  <Text style={styles.submittedVote}>{currentVote?.verdict === true ? 'Submitted' : ''}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {verdict === false && (
            <React.Fragment>
              <View style={styles.propertyHeaderContainer}>
                <Text style={[styles.propertyHeader, { marginTop: 0 }]}>Reason</Text>
              </View>

              <FormattedInput
                editable={true}
                style={styles.input}
                placeholderText={
                  currentVote?.verdict === false
                    ? `Submitted: ${currentVote?.reason}`
                    : 'Why are you against this candidate?'
                }
                returnKeyType="done"
                maxLength={128}
                error={false}
                value={reason}
                onChangeText={(text: string) => setReason(text)}
              />
            </React.Fragment>
          )}

          <Text style={styles.description}>
            {verdict === true
              ? 'When you vote to approve a candidate, you are saying you believe they represent and uphold the ideals and pillars of the fraternity. If you have not had enough interaction with the candidate to feel comfortable vouching for their character, make your decision based on the fraternity discussion. Note: if you change your mind, you can switch your vote up until the voting moves to the next candidate.'
              : verdict === false
              ? 'When you vote to reject a candidate, you are saying you do not believe this candidate would make a good addition to the fraternity. You must provide a reason for why you are rejecting which represents why they are not fit for brotherhood. An example of this would be if you witnessed them having bad interactions with other rushes. Votes that do not have valid reasons will be dismissed.'
              : 'You have not submitted a vote yet, please select an option above. If you choose to reject, you will be asked to provide a reason. Once you area satisfied, click submit in the top right corner. You may change your vote after submitting. This page will automatically update as voting continues.'}
          </Text>
        </View>
      </React.Fragment>
    );
  };

  const renderCandidateOption = (candidate: TCandidate) => {
    return (
      <View key={candidate._id} style={styles.candidateArea}>
        <View style={styles.candidateHeader}>
          <View style={styles.candidateName}>
            <Text style={styles.name}>
              {candidate.familyName}, {candidate.givenName}
            </Text>

            {candidate.approved && (
              <Icon
                style={styles.approvedIcon}
                family="Feather"
                name="check"
                size={24}
                color={theme.COLORS.PRIMARY_GREEN}
              />
            )}
          </View>

          <View style={styles.candidateButtonArea}>
            {sessionVotes.hasOwnProperty(candidate._id) &&
              sessionVotes[candidate._id].find((vote) => vote.userEmail === user.email) && (
                <Text style={styles.submittedText}>Submitted</Text>
              )}
            {selectedCandidates.indexOf(candidate._id) >= 0 ? (
              <TextButton
                label="Unselect"
                textStyle={styles.selectButton}
                onPress={() => onPressSelectCandidate(candidate._id)}
              />
            ) : (
              <TextButton
                label="Select"
                textStyle={styles.selectButton}
                onPress={() => onPressSelectCandidate(candidate._id)}
              />
            )}
          </View>
        </View>

        <View style={styles.splitPropertyRow}>
          <View style={styles.splitProperty}>
            <Text style={styles.propertyHeader}>Year</Text>
            <Text style={styles.propertyValue}>{candidate.classYear}</Text>
          </View>
          <View style={styles.splitProperty}>
            <Text style={styles.propertyHeader}>Major</Text>
            <Text style={styles.propertyValue}>{candidate.major}</Text>
          </View>
          <View style={styles.splitProperty}>
            <Text style={styles.propertyHeader}>2nd Time Rush</Text>
            <Text style={styles.propertyValue}>{candidate.secondTimeRush ? 'Yes' : 'No'}</Text>
          </View>
        </View>

        <Text style={styles.propertyHeader}>Attended Events</Text>
        {candidateIdToAttendedEvents.hasOwnProperty(candidate._id) ? (
          candidateIdToAttendedEvents[candidate._id].map((event: TEvent) => (
            <View key={event._id} style={styles.eventContainer}>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <Text style={styles.eventDate}>{moment(event.start).format('MM/DD h:mm A')}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noEvents}>No events</Text>
        )}
      </View>
    );
  };

  const renderMultiSelect = () => {
    return (
      <React.Fragment>
        <View style={styles.activeContent}>
          {currentCandidateArray.length > 0 ? (
            <React.Fragment>
              {currentCandidateArray.map((candidate) => renderCandidateOption(candidate))}
            </React.Fragment>
          ) : (
            <View style={styles.candidateArea}>
              <Text style={styles.noVotes}>
                There is currently no candidate being voted on. This page will automatically update.
              </Text>
            </View>
          )}
        </View>
      </React.Fragment>
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title="Voting"
        subtitle={activeSession?.name}
        showBackButton={true}
        onPressBackButton={onRequestClose}
        rightButton={
          activeSession?.type === 'MULTI' ? (
            <EndCapButton
              label={
                maxVotes === 0 || selectedCandidates.length <= maxVotes
                  ? `Submit (${selectedCandidates.length})`
                  : `Too Many`
              }
              loading={isSubmittingVote}
              disabled={!readyToSubmit}
              onPress={dispatchSubmitMultiVote}
            />
          ) : (
            <EndCapButton
              label="Submit"
              loading={isSubmittingVote}
              disabled={submitDisabled}
              onPress={dispatchSubmitVote}
            />
          )
        }
      />

      <View
        style={[
          styles.wrapper,
          {
            top: insets.top + HeaderHeight
          }
        ]}
      >
        <KeyboardAvoidingView behavior="position" enabled>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <TouchableWithoutFeedback>
              <View
                style={[
                  styles.content,
                  {
                    paddingBottom: insets.bottom
                  }
                ]}
              >
                {activeSession?.type === 'MULTI' ? renderMultiSelect() : renderRegular()}
              </View>
            </TouchableWithoutFeedback>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </View>
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
  scrollContent: {
    flexGrow: 1,
    backgroundColor: theme.COLORS.WHITE
  },
  content: {
    minHeight: '100%',
    paddingBottom: 64,
    paddingHorizontal: HORIZONTAL_PADDING
  },
  propertyHeaderContainer: {
    marginTop: 16,
    display: 'flex',
    flexDirection: 'row'
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
  input: {
    backgroundColor: theme.COLORS.SUPER_LIGHT_BLUE_GRAY
  },
  multiInput: {
    backgroundColor: theme.COLORS.SUPER_LIGHT_BLUE_GRAY,
    height: 72
  },
  description: {
    marginTop: 12,
    fontFamily: 'OpenSans',
    fontSize: 12
  },
  noVotes: {
    fontFamily: 'OpenSans',
    fontSize: 15
  },
  activeContent: {},
  candidateArea: {
    marginTop: 16,
    padding: 16,
    borderRadius: 8,
    backgroundColor: theme.COLORS.SUPER_LIGHT_BLUE_GRAY
  },
  candidateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  candidateName: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  name: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 16
  },
  approvedIcon: {
    marginLeft: 8
  },
  candidateButtonArea: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  splitPropertyRow: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  splitProperty: {
    marginRight: 24
  },
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
  },
  noEvents: {
    fontFamily: 'OpenSans',
    fontSize: 15
  },
  voteContainer: {
    marginTop: 8
  },
  verdictContainer: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  verdictButtonWrapper: {
    flex: 1
  },
  verdict: {
    padding: 16,
    backgroundColor: theme.COLORS.SUPER_LIGHT_BLUE_GRAY,
    borderColor: theme.COLORS.BORDER,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth * 2
  },
  verdictTitle: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 15
  },
  submittedVote: {
    marginTop: 4,
    height: 20,
    fontFamily: 'OpenSans',
    fontSize: 13,
    color: theme.COLORS.DARK_GRAY
  },
  submittedText: {
    marginRight: 8,
    height: 20,
    fontFamily: 'OpenSans',
    fontSize: 15,
    color: theme.COLORS.DARK_GRAY
  },
  selectButton: {
    color: theme.COLORS.PRIMARY,
    fontSize: 15,
    fontFamily: 'OpenSans-SemiBold'
  }
});

export default VotingPage;
