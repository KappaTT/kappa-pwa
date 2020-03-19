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
  username: string;
  email: string;
  token: string;
}

export interface TUser extends TUserResponse {
  password: string;
}

export const initialUser: TUser = {
  username: '',
  email: '',
  password: '',
  token: ''
};

export const purge = async () => {
  return deleteBatch('user', initialUser);
};

export const validateSignIn = (payload: TSignInPayload): TResponseData => {
  if (!(payload.username || payload.email)) return fail({ username: 'field is missing' });
  if (!payload.password) return fail({ password: 'field is missing' });

  const { username, email, password } = payload;

  if (username) {
    const username_reason = validate(username, USERNAME);
    if (username_reason) return fail({ username: username_reason });
  }

  if (email) {
    const email_reason = validate(email, EMAIL);
    if (email_reason) return fail({ username: email_reason });
  }

  const password_reason = validate(password, PASSWORD);
  if (password_reason) return fail({ password: password_reason });

  return pass();
};

export interface TSignInPayload {
  username?: string;
  email?: string;
  password: string;
}

interface TSignInRequestResponse {
  blame: {
    body: {
      user: TBlame;
    };
  };
  token: string;
  user: TUserResponse;
}

interface TSignInResponse extends TResponseData {
  data?: {
    user: TUserResponse;
  };
}

export const signIn = async (payload: TSignInPayload): Promise<TSignInResponse> => {
  const valid = validateSignIn(payload);

  if (!valid.success) {
    return valid;
  }

  const body: {
    user: {
      username?: string;
      email?: string;
      password: string;
    };
  } = {
    user: {
      password: payload.password
    }
  };

  if (payload.username) {
    body.user.username = payload.username;
  } else {
    body.user.email = payload.email;
  }

  const response = await makeRequest<TSignInRequestResponse>(ENDPOINTS.SIGN_IN, METHODS.SIGN_IN, {
    body
  });

  log('Sign in response', response);

  if (!response.success || response.code === 500) {
    return fail({}, 'problem connecting to server');
  } else if (response.code !== 200) {
    if (response.code === 404) {
      return fail({}, 'your username or password was incorrect');
    }

    return fail(response.data.blame.body.user, '');
  }

  return {
    success: true,
    data: {
      user: {
        username: response.data.user.username,
        email: response.data.user.email,
        token: response.data.user.token
      }
    }
  };
};
