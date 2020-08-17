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

  const [votingRefreshDate, setVotingRefreshDate] = React.useState(moment());

  const dispatch = useDispatch();
  const dispatchGetActiveVotes = React.useCallback(() => dispatch(_voting.getActiveVotes(user)), [dispatch, user]);

  const refreshVotes = React.useCallback(() => {
    if (!isGettingActiveVotes) dispatchGetActiveVotes();

    setVotingRefreshDate(moment());
  }, [dispatchGetActiveVotes, isGettingActiveVotes]);

  React.useEffect(() => {
    if (authorized && !isGettingActiveVotes && votingRefreshDate.isBefore(moment())) {
      const t = setTimeout(refreshVotes, activeSession ? 5000 : 10000);
      return () => clearTimeout(t);
    }
  }, [activeSession, authorized, isGettingActiveVotes, refreshVotes, votingRefreshDate]);

  return <React.Fragment />;
};

export default VotingController;
