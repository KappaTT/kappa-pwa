import { ENDPOINTS, METHODS, TResponse, makeAuthorizedRequest, pass, fail } from '@backend/backend';
import { TUser } from '@backend/auth';
import { log } from '@services/logService';

export interface TCandidate {
  _id: string;
  email: string;
  phone?: string;
  familyName: string;
  givenName: string;
  classYear?: '' | 'FR' | 'SO' | 'JR' | 'SR';
  major?: string;
  secondTimeRush?: boolean;
  imageUrl?: string;
  approved: boolean;
  events: string[];
}

export interface TCandidateDict {
  [email: string]: TCandidate;
}

export interface TSession {
  _id: string;
  name: string;
  startDate: string;
  operatorEmail: string;
  candidateOrder: string[];
  currentCandidateId: string;
  active: boolean;
  type?: 'REGULAR' | 'MULTI';
  maxVotes?: number;
}

export interface TVote {
  _id: string;
  sessionId: string;
  candidateId: string;
  userEmail: string;
  verdict: boolean;
  reason: string;
}

export interface TSessionToCandidateToVoteDict {
  [sessionId: string]: {
    [candidateId: string]: TVote[];
  };
}

export interface TGetActiveVotesPayload {
  user: TUser;
}

interface TGetActiveVotesRequestResponse {
  sessions: TSession[];
  candidate?: TCandidate;
  candidates?: TCandidate[];
  votes: TVote[];
}

interface TGetActiveVotesResponse extends TResponse {
  data?: TGetActiveVotesRequestResponse;
}

/**
 * API request to get the votes for the active session and candidate if available.
 */
export const getActiveVotes = async (payload: TGetActiveVotesPayload): Promise<TGetActiveVotesResponse> => {
  try {
    const response = await makeAuthorizedRequest<TGetActiveVotesRequestResponse>(
      ENDPOINTS.GET_ACTIVE_VOTES(),
      METHODS.GET_ACTIVE_VOTES,
      {
        queryParams: {
          isMobile: true
        }
      },
      payload.user.sessionToken
    );

    log('Get active votes response', response.code);

    if (!response.success) {
      return fail({}, response.error?.message || 'issue connecting to the server', 500);
    } else if (response.code !== 200) {
      if (response.code === 401) {
        return fail({}, 'your credentials were invalid or have expired', response.code);
      }

      return fail({}, response.error?.message, response.code);
    }

    return pass({
      sessions: response.data.sessions,
      candidate: response.data.candidate,
      candidates: response.data.candidates,
      votes: response.data.votes
    });
  } catch (error) {
    log(error);
    return fail({}, "that wasn't supposed to happen", -1);
  }
};

export interface TSubmitVotePayload {
  user: TUser;
  vote: Partial<TVote>;
}

interface TSubmitVoteRequestResponse {
  votes: TVote[];
}

interface TSubmitVoteResponse extends TResponse {
  data?: TSubmitVoteRequestResponse;
}

/**
 * API request to submit a vote for a given candidate and session.
 */
export const submitVote = async (payload: TSubmitVotePayload): Promise<TSubmitVoteResponse> => {
  try {
    const response = await makeAuthorizedRequest<TSubmitVoteRequestResponse>(
      ENDPOINTS.SUBMIT_VOTE(),
      METHODS.SUBMIT_VOTE,
      {
        body: {
          vote: payload.vote
        }
      },
      payload.user.sessionToken
    );

    log('Submit vote response', response.code);

    if (!response.success) {
      return fail({}, response.error?.message || 'issue connecting to the server', 500);
    } else if (response.code !== 200) {
      if (response.code === 401) {
        return fail({}, 'your credentials were invalid or have expired', response.code);
      }

      return fail({}, response.error?.message, response.code);
    }

    return pass({
      votes: response.data.votes
    });
  } catch (error) {
    log(error);
    return fail({}, "that wasn't supposed to happen", -1);
  }
};

export interface TSubmitMultiVotePayload {
  user: TUser;
  sessionId: string;
  candidates: string[];
}

interface TSubmitMultiVoteRequestResponse {
  votes: TVote[];
}

interface TSubmitMultiVoteResponse extends TResponse {
  data?: TSubmitMultiVoteRequestResponse;
}

/**
 * API request to submit a vote for multiple candidates in a given session.
 */
export const submitMultiVote = async (payload: TSubmitMultiVotePayload): Promise<TSubmitMultiVoteResponse> => {
  try {
    const response = await makeAuthorizedRequest<TSubmitMultiVoteRequestResponse>(
      ENDPOINTS.SUBMIT_MULTI_VOTE(),
      METHODS.SUBMIT_MULTI_VOTE,
      {
        body: {
          sessionId: payload.sessionId,
          candidates: payload.candidates
        }
      },
      payload.user.sessionToken
    );

    log('Submit multi vote response', response.code);

    if (!response.success) {
      return fail({}, response.error?.message || 'issue connecting to the server', 500);
    } else if (response.code !== 200) {
      if (response.code === 401) {
        return fail({}, 'your credentials were invalid or have expired', response.code);
      }

      return fail({}, response.error?.message, response.code);
    }

    return pass({
      votes: response.data.votes
    });
  } catch (error) {
    log(error);
    return fail({}, "that wasn't supposed to happen", -1);
  }
};
