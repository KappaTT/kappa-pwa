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

export const validateSignUp = (payload: TSignUpPayload): TResponseData => {
  if (!payload.username) return fail({ username: 'field is missing' });
  if (!payload.email) return fail({ email: 'field is missing' });
  if (!payload.password) return fail({ password: 'field is missing' });

  const { username, email, password } = payload;

  const username_reason = validate(username, USERNAME);
  if (username_reason) return fail({ username: username_reason });

  const email_reason = validate(email, EMAIL, 'must be a real email');
  if (email_reason) return fail({ email: email_reason });

  const password_reason = validate(password, PASSWORD);
  if (password_reason) return fail({ password: password_reason });

  if (!payload.agreed) return fail({ agreed: 'please accept the terms of service' });

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

export interface TSignUpPayload {
  username: string;
  email: string;
  password: string;
  agreed: boolean;
}

interface TSignUpRequestResponse {
  blame: {
    body: {
      user: TBlame;
    };
  };
  token: string;
  user: TUserResponse;
}

interface TSignUpResponse extends TResponseData {
  data?: {
    user: TUserResponse;
  };
}

export const signUp = async (payload: TSignUpPayload): Promise<TSignUpResponse> => {
  const valid = validateSignUp(payload);

  if (!valid.success) {
    return valid;
  }

  const response = await makeRequest<TSignUpRequestResponse>(ENDPOINTS.SIGN_UP, METHODS.SIGN_UP, {
    body: {
      user: {
        username: payload.username,
        email: payload.email,
        password: payload.password
      }
    }
  });

  log('Sign up response', response);

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

export const sendResetPasswordCode = async (email: string): Promise<TResponseData> => {
  const response = await makeRequest(ENDPOINTS.FORGOT_PASSWORD, METHODS.FORGOT_PASSWORD, {
    body: {
      user: {
        email
      }
    }
  });

  log('Forgot password response', response);

  if (!response.success) {
    return fail({}, 'problem connecting to server');
  } else if (response.code !== 200) {
    return fail({}, 'problem connecting to server');
  }

  return {
    success: true
  };
};

export interface TVerifyPassPayload {
  email: string;
  code: string;
}

export const verifyResetPasswordCode = async (payload: TVerifyPassPayload): Promise<TResponseData> => {
  const response = await makeRequest(ENDPOINTS.VERIFY_PASSWORD_CODE, METHODS.VERIFY_PASSWORD_CODE, {
    body: {
      user: {
        email: payload.email,
        resetCode: payload.code
      }
    }
  });

  log('Verify password response', response);

  if (!response.success || response.code === 500) {
    return fail({}, 'problem connecting to server');
  } else if (response.code !== 200) {
    return fail({}, 'the code was incorrect');
  }

  return {
    success: true
  };
};

export interface TResetPayload {
  email: string;
  password: string;
  code: string;
}

interface TResetRequestResponse {
  token: string;
  user: TUserResponse;
}

interface TResetResponse extends TResponseData {
  data?: {
    user: TUserResponse;
  };
}

export const resetPassword = async (payload: TResetPayload): Promise<TResetResponse> => {
  const response = await makeRequest<TResetRequestResponse>(ENDPOINTS.RESET_PASSWORD, METHODS.RESET_PASSWORD, {
    body: {
      user: {
        email: payload.email,
        resetCode: payload.code,
        newPassword: payload.password
      }
    }
  });

  log('Reset password response', response);

  if (!response.success || response.code === 500) {
    return fail({}, 'problem connecting to server');
  } else if (response.code !== 200) {
    return fail({}, 'there was an issue changing your password');
  }

  // TODO: make sure that updated credentials are saved into storage

  return {
    success: true,
    data: {
      user: {
        username: response.data.user.username, // TODO: verify that this is returned and not just token
        email: response.data.user.email,
        token: response.data.user.token
      }
    }
  };
};
