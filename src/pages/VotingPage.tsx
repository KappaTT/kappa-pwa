import React from 'react';
import { StyleSheet, ScrollView, View, Text, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useSafeArea } from 'react-native-safe-area-context';
import moment from 'moment';

import { TRedux } from '@reducers';
import { _kappa, _ui, _voting } from '@reducers/actions';
import { TEvent } from '@backend/kappa';
import { getVotes } from '@services/votingService';
import { theme } from '@constants';
import { Header, EndCapButton, Icon, FormattedInput } from '@components';
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

  const currentCandidate = React.useMemo(
    () => candidateArray.find((candidate) => candidate._id === activeSession?.currentCandidateId) || null,
    [activeSession, candidateArray]
  );

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

  const votes = getVotes(sessionToCandidateToVotes, activeSession?._id, activeSession?.currentCandidateId, {});

  const currentVote = React.useMemo(() => votes.find((vote) => vote.userEmail === user.email) || null, [
    user.email,
    votes
  ]);

  const [verdict, setVerdict] = React.useState<boolean>(null);
  const [reason, setReason] = React.useState<string>('');

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

  const onPressReject = React.useCallback(() => setVerdict(false), []);
  const onPressApprove = React.useCallback(() => setVerdict(true), []);

  const insets = useSafeArea();

  return (
    <View style={styles.container}>
      <Header
        title="Voting"
        subtitle={activeSession.name}
        showBackButton={true}
        onPressBackButton={onRequestClose}
        rightButton={
          <EndCapButton
            label="Submit"
            loading={isSubmittingVote}
            disabled={currentCandidate === null || reason === '' || verdict === null}
            onPress={dispatchSubmitVote}
          />
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
              </View>

              {/*<View style={styles.currentVoteContainer}>
                {currentVote !== null ? (
                  <React.Fragment>
                    <View style={styles.splitPropertyRow}>
                      <View style={styles.splitProperty}>
                        <Text style={[styles.propertyHeader, { marginTop: 0 }]}>Verdict</Text>
                        <Text style={styles.propertyValue}>
                          {currentVote?.verdict === true ? 'Approved' : 'Rejected'}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.splitPropertyRow}>
                      <View style={styles.splitProperty}>
                        <Text style={styles.propertyHeader}>Reason</Text>
                        <Text style={styles.propertyValue}>
                          {currentVote?.verdict === false ? currentVote.reason : 'N/A'}
                        </Text>
                      </View>
                    </View>
                  </React.Fragment>
                ) : (
                  <Text style={styles.noVotes}>You have not submitted a vote</Text>
                )}
                </View>*/}
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
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
    flexGrow: 1
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
  multiInput: {
    backgroundColor: theme.COLORS.SUPER_LIGHT_BLUE_GRAY,
    height: 128
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
  currentVoteContainer: {
    marginTop: 16,
    padding: 16,
    borderRadius: 8,
    backgroundColor: theme.COLORS.SUPER_LIGHT_BLUE_GRAY
  },
  votingContainer: {
    marginTop: 16,
    marginHorizontal: 16,
    flexDirection: 'row'
  },
  voteContainer: {
    marginTop: 16
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
  }
});

export default VotingPage;
