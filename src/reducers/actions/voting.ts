import { Voting } from '@backend';
import { TUser } from '@backend/auth';
import { TVote } from '@backend/voting';
import {
  GET_ACTIVE_VOTES,
  GET_ACTIVE_VOTES_SUCCESS,
  GET_ACTIVE_VOTES_FAILURE,
  SHOW_VOTING,
  HIDE_VOTING,
  SUBMIT_VOTE,
  SUBMIT_VOTE_SUCCESS,
  SUBMIT_VOTE_FAILURE,
  SET_GLOBAL_ERROR_MESSAGE,
  CLEAR_GLOBAL_ERROR_MESSAGE
} from '@reducers/voting';

/**
 * Set the global error message.
 */
export const setGlobalError = (data) => {
  return {
    type: SET_GLOBAL_ERROR_MESSAGE,
    message: data.message,
    code: data.code
  };
};

/**
 * Clear the global error message.
 */
export const clearGlobalError = () => {
  return {
    type: CLEAR_GLOBAL_ERROR_MESSAGE
  };
};

/**
 * Is getting the votes for the active candidate.
 */
const gettingActiveVotes = () => {
  return {
    type: GET_ACTIVE_VOTES
  };
};

/**
 * Finished getting the active votes successfully.
 */
const getActiveVotesSuccess = (data) => {
  return {
    type: GET_ACTIVE_VOTES_SUCCESS,
    sessions: data.sessions,
    candidate: data.candidate,
    candidates: data.candidates,
    votes: data.votes
  };
};

/**
 * Finished getting the active votes with an error.
 */
const getActiveVotesFailure = (error) => {
  return {
    type: GET_ACTIVE_VOTES_FAILURE,
    error
  };
};

/**
 * Get the votes for the active candidate and session if available.
 */
export const getActiveVotes = (user: TUser) => {
  return (dispatch) => {
    dispatch(gettingActiveVotes());

    Voting.getActiveVotes({ user }).then((res) => {
      if (res.success) {
        dispatch(getActiveVotesSuccess(res.data));
      } else {
        dispatch(getActiveVotesFailure(res.error));
      }
    });
  };
};

/**
 * Is submitting a vote.
 */
const submittingVote = () => {
  return {
    type: SUBMIT_VOTE
  };
};

/**
 * Finished submitting a vote successfully.
 */
const submitVoteSuccess = (data) => {
  return {
    type: SUBMIT_VOTE_SUCCESS,
    votes: data.votes
  };
};

/**
 * Finished submitting a vote with an error.
 */
const submitVoteFailure = (error) => {
  return {
    type: SUBMIT_VOTE_FAILURE,
    error
  };
};

/**
 * Submit a vote for a given candidate and session.
 */
export const submitVote = (user: TUser, vote: Partial<TVote>) => {
  return (dispatch) => {
    dispatch(submittingVote());

    Voting.submitVote({ user, vote }).then((res) => {
      if (res.success) {
        dispatch(submitVoteSuccess(res.data));
      } else {
        dispatch(submitVoteFailure(res.error));
      }
    });
  };
};

/**
 * Submit a vote for multiple candidates in a given session.
 */
export const submitMultiVote = (user: TUser, sessionId: string, candidates: string[]) => {
  return (dispatch) => {
    dispatch(submittingVote());

    Voting.submitMultiVote({ user, sessionId, candidates }).then((res) => {
      if (res.success) {
        dispatch(submitVoteSuccess(res.data));
      } else {
        dispatch(submitVoteFailure(res.error));
      }
    });
  };
};

/**
 * Show the voting page.
 */
export const showVoting = () => {
  return {
    type: SHOW_VOTING
  };
};

/**
 * Hide the voting page.
 */
export const hideVoting = () => {
  return {
    type: HIDE_VOTING
  };
};
