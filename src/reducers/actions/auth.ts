import { Auth } from '@backend';

import {
  SHOW_ONBOARDING,
  HIDE_ONBOARDING,
  SHOW_MODAL,
  HIDE_MODAL,
  LOADED_USER,
  SET_USER,
  SIGN_IN,
  SIGN_IN_SUCCESS,
  SIGN_IN_FAILURE,
  SIGN_OUT,
  SHOW_SIGN_IN
} from '@reducers/auth';
import { TUser, initialUser, TUserResponse } from '@backend/auth';
import { getBatch, setBatch } from '@services/secureStorage';
import { log } from '@services/logService';

export const showOnboarding = () => {
  return {
    type: SHOW_ONBOARDING
  };
};

export const hideOnboarding = () => {
  return {
    type: HIDE_ONBOARDING
  };
};

export const showModal = () => {
  return {
    type: SHOW_MODAL
  };
};

export const hideModal = () => {
  return {
    type: HIDE_MODAL
  };
};

export const showSignIn = () => {
  return {
    type: SHOW_SIGN_IN
  };
};

export const loadedUser = () => {
  return {
    type: LOADED_USER
  };
};

export const setUser = (user: TUser) => {
  return {
    type: SET_USER,
    user
  };
};

export const loadUser = () => {
  return dispatch => {
    getBatch('user', initialUser).then((user: TUser | undefined) => {
      dispatch(loadedUser());

      if (user) {
        dispatch(setUser(user));
      }
    });
  };
};

const signingIn = () => {
  return {
    type: SIGN_IN
  };
};

export const signOut = () => {
  return {
    type: SIGN_OUT
  };
};

const signInSuccess = data => {
  return {
    type: SIGN_IN_SUCCESS,
    user: data.user
  };
};

const signInFailure = err => {
  return {
    type: SIGN_IN_FAILURE,
    error: err
  };
};

export const authenticate = (username: string, email: string, password: string) => {
  return dispatch => {
    dispatch(signingIn());

    Auth.signIn({ username, email, password }).then(res => {
      if (res.success) {
        dispatch(signInSuccess(res.data));
        setBatch('user', { ...res.data.user, password });
      } else {
        dispatch(signInFailure(res.error));
      }
    });
  };
};
