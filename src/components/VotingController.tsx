import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';

import { TRedux } from '@reducers';
import { _voting } from '@reducers/actions';

const VotingController: React.FC = () => {
  const authorized = useSelector((state: TRedux) => state.auth.authorized);
  const user = useSelector((state: TRedux) => state.auth.user);
  const isGettingActiveVotes = useSelector((state: TRedux) => state.voting.isGettingActiveVotes);
  const activeSession = useSelector((state: TRedux) => state.voting.activeSession);
  const isShowingVoting = useSelector((state: TRedux) => state.voting.isShowingVoting);

  const [votingRefreshDate, setVotingRefreshDate] = React.useState(null);

  const dispatch = useDispatch();
  const dispatchGetActiveVotes = React.useCallback(() => dispatch(_voting.getActiveVotes(user)), [dispatch, user]);
  const dispatchHideVoting = React.useCallback(() => dispatch(_voting.hideVoting()), [dispatch]);

  /**
   * Refresh the vote information
   */
  const refreshVotes = React.useCallback(() => {
    if (!isGettingActiveVotes) dispatchGetActiveVotes();

    setVotingRefreshDate(moment());
  }, [dispatchGetActiveVotes, isGettingActiveVotes]);

  React.useEffect(() => {
    // Hide voting if no session is available
    if (activeSession === null && isShowingVoting) {
      dispatchHideVoting();
    }
  }, [activeSession, dispatchHideVoting, isShowingVoting]);

  React.useEffect(() => {
    // Trigger a refresh loop based on the priority of the information (if there is an active session already discovered)
    if (authorized && !isGettingActiveVotes && (votingRefreshDate === null || votingRefreshDate.isBefore(moment()))) {
      const t = setTimeout(refreshVotes, votingRefreshDate === null ? 0 : isShowingVoting ? 5000 : 10000);
      return () => clearTimeout(t);
    }
  }, [authorized, isGettingActiveVotes, isShowingVoting, refreshVotes, votingRefreshDate]);

  return <React.Fragment />;
};

export default VotingController;
