import React from 'react';
import { StyleSheet, ScrollView, View, Text, TouchableWithoutFeedback } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useSafeArea } from 'react-native-safe-area-context';

import { TRedux } from '@reducers';
import { _kappa, _ui, _voting } from '@reducers/actions';
import { theme } from '@constants';
import { Header, EndCapButton, FormattedInput } from '@components';
import { HeaderHeight, HORIZONTAL_PADDING } from '@services/utils';

const VotingPage: React.FC<{
  onRequestClose(): void;
}> = ({ onRequestClose }) => {
  const user = useSelector((state: TRedux) => state.auth.user);
  const activeSession = useSelector((state: TRedux) => state.voting.activeSession);
  const candidateArray = useSelector((state: TRedux) => state.voting.candidateArray);

  const currentCandidate = React.useMemo(
    () => candidateArray.find((candidate) => candidate._id === activeSession?.currentCandidateId) || null,
    [activeSession, candidateArray]
  );

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
            loading={false}
            disabled={currentCandidate === null || reason === ''}
            onPress={() => console.log('TODO')}
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
            ></View>
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
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 13,
    textTransform: 'uppercase',
    color: theme.COLORS.GRAY
  },
  multiInput: {
    backgroundColor: theme.COLORS.SUPER_LIGHT_BLUE_GRAY,
    height: 128
  },
  description: {
    marginTop: 12,
    fontFamily: 'OpenSans',
    fontSize: 12
  }
});

export default VotingPage;
