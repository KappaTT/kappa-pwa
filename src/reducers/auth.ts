import { TBlame } from '@backend/backend';
import { TUser, initialUser } from '@backend/auth';

export const SHOW_ONBOARDING = 'SHOW_ONBOARDING';
export const HIDE_ONBOARDING = 'HIDE_ONBOARDING';

export const SHOW_MODAL = 'SHOW_MODAL';
export const HIDE_MODAL = 'HIDE_MODAL';

export const RESET_BLAME = 'RESET_BLAME';

export const LOADED_USER = 'LOADED_USER';
export const SET_USER = 'SET_USER';

export const SIGN_IN = 'SIGN_IN';
export const SIGN_IN_SUCCESS = 'SIGN_IN_SUCCESS';
export const SIGN_IN_FAILURE = 'SIGN_IN_FAILURE';
export const SIGN_OUT = 'SIGN_OUT';

export const SIGN_UP = 'SIGN_UP';
export const SIGN_UP_SUCCESS = 'SIGN_UP_SUCCESS';
export const SIGN_UP_FAILURE = 'SIGN_UP_FAILURE';

export const SHOW_SIGN_IN = 'SHOW_SIGN_IN';
export const SHOW_SIGN_UP = 'SHOW_SIGN_UP';

export const SHOW_SIGN_IN_CONFIRMATION_MODAL = 'SHOW_SIGN_IN_CONFIRMATION_MODAL';
export const SHOW_SIGN_UP_CONFIRMATION_MODAL = 'SHOW_SIGN_UP_CONFIRMATION_MODAL';

export const CONFIRM_SIGN_UP = 'CONFIRM_SIGN_UP';
export const CONFIRM_SIGN_UP_SUCCESS = 'CONFIRM_SIGN_UP_SUCCESS';
export const CONFIRM_SIGN_UP_FAILURE = 'CONFIRM_SIGN_UP_FAILURE';

export const CONFIRM_SIGN_IN = 'CONFIRM_SIGN_IN';
export const CONFIRM_SIGN_IN_SUCCESS = 'CONFIRM_SIGN_IN_SUCCESS';
export const CONFIRM_SIGN_IN_FAILURE = 'CONFIRM_SIGN_IN_FAILURE';

export const SHOW_RESET_PASSWORD = 'SHOW_RESET_PASSWORD';
export const HIDE_RESET_PASSWORD = 'HIDE_RESET_PASSWORD';
export const SENDING_RESET_PASSWORD_CODE = 'SEND_RESET_PASSWORD_CODE';
export const SENT_RESET_PASSWORD_CODE = 'SENT_RESET_PASSWORD_CODE';
export const VERIFYING_RESET_PASSWORD_CODE = 'VERIFYING_RESET_PASSWORD_CODE';
export const VERIFY_RESET_PASSWORD_CODE_SUCCESS = 'VERIFY_RESET_PASSWORD_CODE_SUCCESS';
export const VERIFY_RESET_PASSWORD_CODE_FAILURE = 'VERIFY_RESET_PASSWORD_CODE_FAILURE';
export const RESETTING_PASSWORD = 'RESETTING_PASSWORD';
export const RESET_PASSWORD_SUCCESS = 'RESET_PASSWORD';
export const RESET_PASSWORD_FAILURE = 'RESET_PASSWORD_FAILURE';

export interface TAuthState {
  visible: boolean;
  onboardingVisible: boolean;

  isAuthenticating: boolean;
  loadedUser: boolean;
  user: TUser;
  authorized: boolean;

  isResetting: boolean;
  resetPasswordVisible: boolean;
  sentResetPasswordCode: boolean;
  validResetPasswordCode: boolean;
  resetPasswordError: boolean;
  resetPasswordErrorMessage: string;

  signUpVisible: boolean;
  signInVisible: boolean;

  signUpError: boolean;
  signInError: boolean;

  showSignUpConfirmationModal: boolean;
  showSignInConfirmationModal: boolean;

  confirmSignUpError: false;
  confirmSignInError: false;

  signInErrorMessage: string;
  signUpErrorMessage: string;

  signInBlame: TBlame;
  signUpBlame: TBlame;

  confirmSignInErrorMessage: string;
  confirmSignUpErrorMessage: string;
}

const initialState: TAuthState = {
  visible: false,
  onboardingVisible: false,

  isAuthenticating: false,
  loadedUser: false,
  user: initialUser,
  authorized: false,

  isResetting: false,
  resetPasswordVisible: false,
  sentResetPasswordCode: false,
  validResetPasswordCode: false,
  resetPasswordError: false,
  resetPasswordErrorMessage: '',

  signUpVisible: false,
  signInVisible: true,

  signUpError: false,
  signInError: false,

  showSignUpConfirmationModal: false,
  showSignInConfirmationModal: false,

  confirmSignUpError: false,
  confirmSignInError: false,

  signInErrorMessage: '',
  signUpErrorMessage: '',

  signInBlame: {},
  signUpBlame: {},

  confirmSignInErrorMessage: '',
  confirmSignUpErrorMessage: ''
};

export default (state = initialState, action: any): TAuthState => {
  switch (action.type) {
    case SHOW_ONBOARDING:
      return {
        ...state,
        onboardingVisible: true
      };
    case HIDE_ONBOARDING:
      return {
        ...state,
        onboardingVisible: false
      };
    case SHOW_MODAL:
      return {
        ...state,
        visible: true
      };
    case HIDE_MODAL:
      return {
        ...state,
        visible: false
      };
    case SHOW_SIGN_IN:
      return {
        ...state,
        signUpVisible: false,
        signInVisible: true,
        signInError: false,
        signInErrorMessage: '',
        signInBlame: {}
      };
    case SHOW_SIGN_UP:
      return {
        ...state,
        signUpVisible: true,
        signInVisible: false,
        signUpError: false,
        signUpErrorMessage: '',
        signUpBlame: {}
      };
    case RESET_BLAME:
      return {
        ...state,
        signUpBlame: {},
        signInBlame: {}
      };
    case LOADED_USER:
      return {
        ...state,
        loadedUser: true
      };
    case SET_USER:
      return {
        ...state,
        user: action.user,
        authorized: true
      };
    case SHOW_SIGN_IN_CONFIRMATION_MODAL:
      return {
        ...state,
        isAuthenticating: false,
        showSignInConfirmationModal: true
      };
    case SHOW_SIGN_UP_CONFIRMATION_MODAL:
      return {
        ...state,
        isAuthenticating: false,
        showSignUpConfirmationModal: true
      };
    case CONFIRM_SIGN_UP:
      return {
        ...state,
        isAuthenticating: true
      };
    case CONFIRM_SIGN_UP_SUCCESS:
      return {
        ...state,
        isAuthenticating: false,
        showSignUpConfirmationModal: false
      };
    case CONFIRM_SIGN_UP_FAILURE:
      return {
        ...state,
        isAuthenticating: false,
        confirmSignUpError: false,
        confirmSignUpErrorMessage: action.error.message
      };
    case SIGN_UP:
      return {
        ...state,
        isAuthenticating: true,
        signUpError: false,
        signUpBlame: {},
        signUpErrorMessage: ''
      };
    case SIGN_UP_SUCCESS:
      return {
        ...state,
        isAuthenticating: false,
        user: action.user,
        authorized: true,
        signUpError: false,
        signUpBlame: {},
        signUpErrorMessage: ''
      };
    case SIGN_UP_FAILURE:
      return {
        ...state,
        isAuthenticating: false,
        signUpError: true,
        signUpErrorMessage: action.error.message,
        signUpBlame: action.error.blame
      };
    case SIGN_IN:
      return {
        ...state,
        isAuthenticating: true,
        signInError: false,
        signInBlame: {},
        signInErrorMessage: ''
      };
    case SIGN_IN_SUCCESS:
      return {
        ...state,
        isAuthenticating: false,
        user: action.user,
        authorized: true,
        showSignInConfirmationModal: true,
        signInError: false,
        signInBlame: {},
        signInErrorMessage: ''
      };
    case SIGN_IN_FAILURE:
      return {
        ...state,
        isAuthenticating: false,
        signInError: true,
        signInErrorMessage: action.error.message,
        signInBlame: action.error.blame
      };
    case CONFIRM_SIGN_IN: {
      return {
        ...state,
        isAuthenticating: true
      };
    }
    case CONFIRM_SIGN_IN_SUCCESS:
      return {
        ...state,
        isAuthenticating: false,
        showSignInConfirmationModal: false
      };
    case CONFIRM_SIGN_IN_FAILURE:
      return {
        ...state,
        isAuthenticating: false
      };
    case SHOW_RESET_PASSWORD:
      return {
        ...state,
        resetPasswordVisible: true,
        isResetting: false,
        sentResetPasswordCode: false,
        validResetPasswordCode: false,
        resetPasswordError: false,
        resetPasswordErrorMessage: ''
      };
    case HIDE_RESET_PASSWORD:
      return {
        ...state,
        resetPasswordVisible: false
      };
    case SENDING_RESET_PASSWORD_CODE:
      return {
        ...state,
        isResetting: true,
        resetPasswordError: false,
        resetPasswordErrorMessage: ''
      };
    case SENT_RESET_PASSWORD_CODE:
      return {
        ...state,
        isResetting: false,
        sentResetPasswordCode: true
      };
    case VERIFYING_RESET_PASSWORD_CODE:
      return {
        ...state,
        isResetting: true,
        resetPasswordError: false,
        resetPasswordErrorMessage: ''
      };
    case VERIFY_RESET_PASSWORD_CODE_SUCCESS:
      return {
        ...state,
        isResetting: false,
        validResetPasswordCode: true
      };
    case VERIFY_RESET_PASSWORD_CODE_FAILURE:
      return {
        ...state,
        isResetting: false,
        validResetPasswordCode: false,
        resetPasswordError: true,
        resetPasswordErrorMessage: action.error.message
      };
    case RESETTING_PASSWORD:
      return {
        ...state,
        isResetting: true,
        resetPasswordError: false,
        resetPasswordErrorMessage: ''
      };
    case RESET_PASSWORD_SUCCESS:
      return {
        ...state,
        isResetting: false,
        user: action.user,
        resetPasswordVisible: false,
        authorized: true
      };
    case RESET_PASSWORD_FAILURE:
      return {
        ...state,
        isResetting: false,
        resetPasswordError: true,
        resetPasswordErrorMessage: action.error.message
      };
    case SIGN_OUT:
      return {
        ...initialState
      };
    default:
      return state;
  }
};
