import { Auth } from '@backend';

import {
  SHOW_ONBOARDING,
  HIDE_ONBOARDING,
  SHOW_MODAL,
  HIDE_MODAL,
  RESET_BLAME,
  LOADED_USER,
  SET_USER,
  SIGN_IN,
  SIGN_IN_SUCCESS,
  SIGN_IN_FAILURE,
  SIGN_OUT,
  SIGN_UP,
  SIGN_UP_SUCCESS,
  SIGN_UP_FAILURE,
  SHOW_SIGN_IN,
  SHOW_SIGN_UP,
  SHOW_SIGN_IN_CONFIRMATION_MODAL,
  SHOW_SIGN_UP_CONFIRMATION_MODAL,
  CONFIRM_SIGN_UP,
  CONFIRM_SIGN_UP_SUCCESS,
  CONFIRM_SIGN_UP_FAILURE,
  CONFIRM_SIGN_IN,
  CONFIRM_SIGN_IN_SUCCESS,
  CONFIRM_SIGN_IN_FAILURE,
  SHOW_RESET_PASSWORD,
  HIDE_RESET_PASSWORD,
  SENT_RESET_PASSWORD_CODE,
  SENDING_RESET_PASSWORD_CODE,
  VERIFYING_RESET_PASSWORD_CODE,
  VERIFY_RESET_PASSWORD_CODE_SUCCESS,
  VERIFY_RESET_PASSWORD_CODE_FAILURE,
  RESETTING_PASSWORD,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAILURE
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

export const showSignUp = () => {
  return {
    type: SHOW_SIGN_UP
  };
};

export const showSignIn = () => {
  return {
    type: SHOW_SIGN_IN
  };
};

export const resetBlame = () => {
  return {
    type: RESET_BLAME
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

const signingUp = () => {
  return {
    type: SIGN_UP
  };
};

const signUpSuccess = data => {
  return {
    type: SIGN_UP_SUCCESS,
    user: data.user
  };
};

const signUpFailure = err => {
  return {
    type: SIGN_UP_FAILURE,
    error: err
  };
};

export const createUser = (username: string, email: string, password: string, agreed: boolean) => {
  return dispatch => {
    dispatch(signingUp());

    Auth.signUp({ username, email, password, agreed }).then(res => {
      if (res.success) {
        dispatch(signUpSuccess(res.data));
        setBatch('user', { ...res.data.user, password });
      } else {
        dispatch(signUpFailure(res.error));
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

export const showSignInConfirmationModal = () => {
  return {
    type: SHOW_SIGN_IN_CONFIRMATION_MODAL
  };
};

export const showSignUpConfirmationModal = () => {
  return {
    type: SHOW_SIGN_UP_CONFIRMATION_MODAL
  };
};

export const confirmUserLogin = authCode => {
  return (dispatch, getState) => {
    dispatch(confirmSignIn());
    const {
      auth: { user }
    } = getState();
    log('state: ', getState());
    // Auth.confirmSignIn(user, authCode)
    //   .then(data => {
    //     log('data from confirmLogin: ', data);
    //     dispatch(confirmLoginSuccess(data));
    //   })
    //   .catch(err => {
    //     log('error signing in: ', err);
    //     dispatch(confirmLoginFailure(err));
    //   });
  };
};

const confirmSignIn = () => {
  return {
    type: CONFIRM_SIGN_IN
  };
};

const confirmSignInSuccess = user => {
  return {
    type: CONFIRM_SIGN_IN_SUCCESS,
    user
  };
};

const confirmSignInFailure = err => {
  return {
    type: CONFIRM_SIGN_IN_FAILURE,
    error: err
  };
};

export const confirmUserSignUp = (username, authCode) => {
  return dispatch => {
    dispatch(confirmSignUp());
    // Auth.confirmSignUp(username, authCode)
    //   .then(data => {
    //     log('data from confirmSignUp: ', data);
    //     dispatch(confirmSignUpSuccess());
    //     setTimeout(() => {
    //       Alert.alert('Successfully Signed Up!', 'Please Sign');
    //     }, 0);
    //   })
    //   .catch(err => {
    //     log('error signing up: ', err);
    //     dispatch(confirmSignUpFailure(err));
    //   });
  };
};

const confirmSignUp = () => {
  return {
    type: CONFIRM_SIGN_UP
  };
};

const confirmSignUpSuccess = () => {
  return {
    type: CONFIRM_SIGN_UP_SUCCESS
  };
};

const confirmSignUpFailure = error => {
  return {
    type: CONFIRM_SIGN_UP_FAILURE,
    error
  };
};

export const showResetPassword = () => {
  return {
    type: SHOW_RESET_PASSWORD
  };
};

export const hideResetPassword = () => {
  return {
    type: HIDE_RESET_PASSWORD
  };
};

const sendingResetPasswordCode = () => {
  return {
    type: SENDING_RESET_PASSWORD_CODE
  };
};

const sentResetPasswordCode = () => {
  return {
    type: SENT_RESET_PASSWORD_CODE
  };
};

export const sendResetPasswordCode = (email: string) => {
  return dispatch => {
    dispatch(sendingResetPasswordCode());

    Auth.sendResetPasswordCode(email).then(res => {
      dispatch(sentResetPasswordCode());
    });
  };
};

const verifyingResetPasswordCode = () => {
  return {
    type: VERIFYING_RESET_PASSWORD_CODE
  };
};

const verifyResetPasswordCodeSuccess = () => {
  return {
    type: VERIFY_RESET_PASSWORD_CODE_SUCCESS
  };
};

const verifyResetPasswordCodeFailure = error => {
  return {
    type: VERIFY_RESET_PASSWORD_CODE_FAILURE,
    error
  };
};

export const verifyResetPasswordCode = (email: string, code: string) => {
  return dispatch => {
    dispatch(verifyingResetPasswordCode());

    Auth.verifyResetPasswordCode({ email, code }).then(res => {
      if (res.success) {
        dispatch(verifyResetPasswordCodeSuccess());
      } else {
        dispatch(verifyResetPasswordCodeFailure(res.error));
      }
    });
  };
};

const resettingPassword = () => {
  return {
    type: RESETTING_PASSWORD
  };
};

const resetPasswordSuccess = (user: TUserResponse, password: string) => {
  return {
    type: RESET_PASSWORD_SUCCESS,
    user: {
      ...user,
      password
    }
  };
};

const resetPasswordFailure = error => {
  return {
    type: RESET_PASSWORD_FAILURE,
    error
  };
};

export const resetPassword = (email: string, code: string, password: string) => {
  return dispatch => {
    dispatch(resettingPassword());

    Auth.resetPassword({ email, code, password }).then(res => {
      if (res.success) {
        log('success');
        dispatch(resetPasswordSuccess(res.data.user, password));
        setBatch('user', { ...res.data.user, password });
      } else {
        dispatch(resetPasswordFailure(res.error));
      }
    });
  };
};
