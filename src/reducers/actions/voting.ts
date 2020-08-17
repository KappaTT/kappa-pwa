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

export const setGlobalError = (data) => {
  return {
    type: SET_GLOBAL_ERROR_MESSAGE,
    message: data.message,
    code: data.code
  };
};

export const clearGlobalError = () => {
  return {
    type: CLEAR_GLOBAL_ERROR_MESSAGE
  };
};

const gettingActiveVotes = () => {
  return {
    type: GET_ACTIVE_VOTES
  };
};

const getActiveVotesSuccess = (data) => {
  return {
    type: GET_ACTIVE_VOTES_SUCCESS,
    sessions: data.sessions,
    candidate: data.candidate,
    votes: data.votes
  };
};

const getActiveVotesFailure = (error) => {
  return {
    type: GET_ACTIVE_VOTES_FAILURE,
    error
  };
};

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

const submittingVote = () => {
  return {
    type: SUBMIT_VOTE
  };
};

const submitVoteSuccess = (data) => {
  return {
    type: SUBMIT_VOTE_SUCCESS,
    votes: data.votes
  };
};

const submitVoteFailure = (error) => {
  return {
    type: SUBMIT_VOTE_FAILURE,
    error
  };
};

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

export const showVoting = () => {
  return {
    type: SHOW_VOTING
  };
};

export const hideVoting = () => {
  return {
    type: HIDE_VOTING
  };
};
