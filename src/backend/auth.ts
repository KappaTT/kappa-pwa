import {
  ENDPOINTS,
  METHODS,
  TResponseData,
  makeRequest,
  makeAuthorizedRequest,
  pass,
  fail,
  TBlame
} from '@backend/backend';
import { deviceId, sleep } from '@services/utils';
import { validate, USERNAME, EMAIL, PASSWORD } from '@backend/validators';
import { getBatch, deleteBatch } from '@services/secureStorage';
import { log } from '@services/logService';

export interface TUserResponse {
  _id: string;
  email: string;
}

export interface TUser extends TGoogleUser {
  _id: string;
}

export const initialUser: TUser = {
  _id: '',
  accessToken: '',
  refreshToken: '',
  idToken: '',
  email: '',
  familyName: '',
  givenName: '',
  id: '',
  photoUrl: ''
};

export interface TGoogleUser {
  accessToken: string;
  refreshToken: string;
  idToken: string;
  email: string;
  familyName: string;
  givenName: string;
  id: string;
  photoUrl: string;
}

export const initialGoogleUser: TGoogleUser = {
  accessToken: '',
  refreshToken: '',
  idToken: '',
  email: '',
  familyName: '',
  givenName: '',
  id: '',
  photoUrl: ''
};

export const purge = async () => {
  return deleteBatch('user', initialUser);
};

export interface TSignInPayload {
  email: string;
  idToken: string;
}

interface TSignInRequestResponse {
  token: string;
  user: TUserResponse;
}

interface TSignInResponse extends TResponseData {
  data?: {
    user: TUserResponse;
  };
}

export const signIn = async (payload: TSignInPayload): Promise<TSignInResponse> => {
  const body: {
    user: {
      email: string;
    };
    idToken: string;
  } = {
    user: {
      email: payload.email
    },
    idToken: payload.idToken
  };

  const response = await makeRequest<TSignInRequestResponse>(ENDPOINTS.SIGN_IN, METHODS.SIGN_IN, {
    body
  });

  log('Sign in response', response);

  if (!response.success || response.code === 500) {
    return fail({}, 'problem connecting to server');
  } else if (response.code !== 200) {
    if (response.code === 401) {
      return fail({}, 'your netid was not recognized');
    }

    return fail({}, '');
  }

  return {
    success: true,
    data: {
      user: {
        _id: response.data.user._id,
        email: response.data.user.email
      }
    }
  };
};
