import { Auth } from '@backend';

import {
  SHOW_MODAL,
  HIDE_MODAL,
  LOADED_USER,
  SET_USER,
  SIGN_IN,
  SIGN_IN_SUCCESS,
  SIGN_IN_FAILURE,
  SIGN_OUT,
  SHOW_SIGN_IN,
  SIGN_IN_WITH_GOOGLE,
  SIGN_IN_WITH_GOOGLE_SUCCESS,
  SIGN_IN_WITH_GOOGLE_FAILURE,
  MODIFY_USER
} from '@reducers/auth';
import { TUser, initialUser, TGoogleUser, purge } from '@backend/auth';
import { getBatch, setBatch, deleteBatch } from '@services/secureStorage';
import * as GoogleService from '@services/googleService';
import { log } from '@services/logService';
import { DEMO_USER } from '@services/demoService';

/**
 * Show the login modal.
 */
export const showModal = () => {
  return {
    type: SHOW_MODAL
  };
};

/**
 * Hide the login modal.
 */
export const hideModal = () => {
  return {
    type: HIDE_MODAL
  };
};

/**
 * Show the sign in view.
 */
export const showSignIn = () => {
  return {
    type: SHOW_SIGN_IN
  };
};

/**
 * Finish loading user.
 */
export const loadedUser = () => {
  return {
    type: LOADED_USER
  };
};

/**
 * Update the user object.
 */
export const setUser = (user: TUser, authorized: boolean = true) => {
  return {
    type: SET_USER,
    user,
    authorized
  };
};

/**
 * Modify the user object.
 */
export const modifyUser = (user: TUser) => {
  return {
    type: MODIFY_USER,
    user
  };
};

/**
 * Load the user from device storage.
 */
export const loadUser = () => {
  return (dispatch) => {
    getBatch('user', initialUser, true).then((user: TUser | undefined) => {
      if (user?.email) {
        dispatch(setUser(user));
      }

      dispatch(loadedUser());
    });
  };
};

/**
 * Is signing in.
 */
const signingIn = () => {
  return {
    type: SIGN_IN
  };
};

/**
 * Sign out from the account. Clear local storage.
 */
export const signOut = () => {
  purge();

  return {
    type: SIGN_OUT
  };
};

/**
 * Finish signing in successfully.
 */
const signInSuccess = () => {
  return {
    type: SIGN_IN_SUCCESS
  };
};

/**
 * Finish signing in with an error.
 */
const signInFailure = (err) => {
  return {
    type: SIGN_IN_FAILURE,
    error: err
  };
};

/**
 * Sign in with the given email and id token.
 */
export const authenticate = (email: string, idToken: string) => {
  return (dispatch) => {
    dispatch(signingIn());

    Auth.signIn({ email, idToken }).then((res) => {
      if (res.success) {
        const user = res.data.user;

        dispatch(setUser(user));
        dispatch(signInSuccess());

        setBatch('user', user);
      } else {
        dispatch(signInFailure(res.error));
      }
    });
  };
};

/**
 * Sign in with the given secret code.
 */
export const authenticateWithSecretCode = (secretCode: string) => {
  return (dispatch) => {
    dispatch(signingIn());

    Auth.signIn({ secretCode }).then((res) => {
      if (res.success) {
        const user = res.data.user;

        dispatch(setUser(user));
        dispatch(signInSuccess());

        setBatch('user', user);
      } else {
        dispatch(signInFailure(res.error));
      }
    });
  };
};

/**
 * Is signing in with google.
 */
const signingInWithGoogle = () => {
  return {
    type: SIGN_IN_WITH_GOOGLE
  };
};

/**
 * Finish signing in with google successfully.
 */
const signInWithGoogleSuccess = () => {
  return {
    type: SIGN_IN_WITH_GOOGLE_SUCCESS
  };
};

/**
 * Finish signing in with google with an error.
 */
const signInWithGoogleFailure = (err) => {
  return {
    type: SIGN_IN_WITH_GOOGLE_FAILURE,
    error: err
  };
};

/**
 * Sign in with google.
 */
export const signInWithGoogle = () => {
  return (dispatch) => {
    dispatch(signingInWithGoogle());

    GoogleService.login().then((res) => {
      if (res.success) {
        if (res.data.email === 'thetataudemo@gmail.com') {
          dispatch(signInWithGoogleSuccess());
          dispatch(setUser(DEMO_USER));
          dispatch(signInSuccess());
        } else {
          dispatch(signInWithGoogleSuccess());
          dispatch(authenticate(res.data.email, res.data.idToken));
        }
      } else {
        dispatch(
          signInWithGoogleFailure({
            message: 'Canceled'
          })
        );
      }
    });
  };
};

/**
 * Sign in with the demo account.
 */
export const signInDemo = () => {
  return (dispatch) => {
    dispatch(signInWithGoogleSuccess());
    dispatch(setUser(DEMO_USER));
    dispatch(signInSuccess());
  };
};
