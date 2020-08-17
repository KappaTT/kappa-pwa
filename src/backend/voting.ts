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
  sessions: TSession;
  candidate: TCandidate;
  votes: TVote[];
}

interface TGetActiveVotesResponse extends TResponse {
  data?: TGetActiveVotesRequestResponse;
}

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
