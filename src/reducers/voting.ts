import { setGlobalError } from '@services/kappaService';
import { TLoadHistory } from '@backend/kappa';
import { TCandidate, TCandidateDict, TSession, TSessionToCandidateToVoteDict } from '@backend/voting';
import { recomputeVotingState, mergeCandidates, mergeSessions, mergeVotes } from '@services/votingService';

export const SET_GLOBAL_ERROR_MESSAGE = 'SET_GLOBAL_ERROR_MESSAGE';
export const CLEAR_GLOBAL_ERROR_MESSAGE = 'CLEAR_GLOBAL_ERROR_MESSAGE';

export const GET_ACTIVE_VOTES = 'GET_ACTIVE_VOTES';
export const GET_ACTIVE_VOTES_SUCCESS = 'GET_ACTIVE_VOTES_SUCCESS';
export const GET_ACTIVE_VOTES_FAILURE = 'GET_ACTIVE_VOTES_FAILURE';
export const SUBMIT_VOTE = 'SUBMIT_VOTE';
export const SUBMIT_VOTE_SUCCESS = 'SUBMIT_VOTE_SUCCESS';
export const SUBMIT_VOTE_FAILURE = 'SUBMIT_VOTE_FAILURE';

export const SHOW_VOTING = 'SHOW_VOTING';
export const HIDE_VOTING = 'HIDE_VOTING';

export interface TVotingState {
  globalErrorMessage: string;
  globalErrorCode: number;
  globalErrorDate: Date;

  isGettingActiveVotes: boolean;
  getActiveVotesError: boolean;
  getActiveVotesErrorMessage: string;

  isSubmittingVote: boolean;
  submitVoteError: boolean;
  submitVoteErrorMessage: string;

  isShowingVoting: boolean;

  loadHistory: TLoadHistory;
  candidateArray: TCandidate[];
  emailToCandidate: TCandidateDict;
  idToCandidate: TCandidateDict;
  sessionArray: TSession[];
  sessionToCandidateToVotes: TSessionToCandidateToVoteDict;

  // mobile specific
  activeSession: TSession;
}

const initialState: TVotingState = {
  globalErrorMessage: '',
  globalErrorCode: 0,
  globalErrorDate: null,

  isGettingActiveVotes: false,
  getActiveVotesError: false,
  getActiveVotesErrorMessage: '',

  isSubmittingVote: false,
  submitVoteError: false,
  submitVoteErrorMessage: '',

  isShowingVoting: false,

  loadHistory: {},
  candidateArray: [],
  emailToCandidate: {},
  idToCandidate: {},
  sessionArray: [],
  sessionToCandidateToVotes: {},

  // mobile specific
  activeSession: null
};

export default (state = initialState, action: any): TVotingState => {
  switch (action.type) {
    case SET_GLOBAL_ERROR_MESSAGE:
      return {
        ...state,
        ...setGlobalError(action.message, action.code)
      };
    case CLEAR_GLOBAL_ERROR_MESSAGE:
      return {
        ...state,
        globalErrorMessage: '',
        globalErrorCode: 0,
        globalErrorDate: null
      };
    case GET_ACTIVE_VOTES:
      return {
        ...state,
        isGettingActiveVotes: true,
        getActiveVotesError: false,
        getActiveVotesErrorMessage: ''
      };
    case GET_ACTIVE_VOTES_SUCCESS: {
      if (action.sessions.length > 0 && action.candidate !== null) {
        const newSessionArray = mergeSessions(state.sessionArray, action.sessions);

        return {
          ...state,
          isGettingActiveVotes: false,
          sessionArray: newSessionArray,
          sessionToCandidateToVotes: mergeVotes(state.sessionToCandidateToVotes, action.votes),
          ...recomputeVotingState({
            emailToCandidate: mergeCandidates(state.emailToCandidate, [action.candidate])
          }),
          activeSession: newSessionArray.find((session) => session.active === true) || null
        };
      } else {
        return {
          ...state,
          isGettingActiveVotes: false,
          activeSession: null
        };
      }
    }
    case GET_ACTIVE_VOTES_FAILURE:
      return {
        ...state,
        isGettingActiveVotes: false,
        getActiveVotesError: true,
        getActiveVotesErrorMessage: action.error.message
      };
    case SUBMIT_VOTE:
      return {
        ...state,
        isSubmittingVote: true,
        submitVoteError: false,
        submitVoteErrorMessage: ''
      };
    case SUBMIT_VOTE_SUCCESS:
      return {
        ...state,
        isSubmittingVote: false,
        sessionToCandidateToVotes: mergeVotes(state.sessionToCandidateToVotes, action.votes)
      };
    case SUBMIT_VOTE_FAILURE:
      return {
        ...state,
        isSubmittingVote: false,
        submitVoteError: true,
        submitVoteErrorMessage: action.error.message,
        ...setGlobalError(action.error.message, action.error.code)
      };
    case SHOW_VOTING:
      return {
        ...state,
        isShowingVoting: true
      };
    case HIDE_VOTING:
      return {
        ...state,
        isShowingVoting: false
      };
    default:
      return state;
  }
};
