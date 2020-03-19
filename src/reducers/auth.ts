import { TBlame } from '@backend/backend';
import { TUser, initialUser } from '@backend/auth';

export const SHOW_ONBOARDING = 'SHOW_ONBOARDING';
export const HIDE_ONBOARDING = 'HIDE_ONBOARDING';

export const SHOW_MODAL = 'SHOW_MODAL';
export const HIDE_MODAL = 'HIDE_MODAL';

export const LOADED_USER = 'LOADED_USER';
export const SET_USER = 'SET_USER';

export const SIGN_IN = 'SIGN_IN';
export const SIGN_IN_SUCCESS = 'SIGN_IN_SUCCESS';
export const SIGN_IN_FAILURE = 'SIGN_IN_FAILURE';
export const SIGN_OUT = 'SIGN_OUT';

export const SHOW_SIGN_IN = 'SHOW_SIGN_IN';

export interface TAuthState {
  visible: boolean;
  onboardingVisible: boolean;

  isAuthenticating: boolean;
  loadedUser: boolean;
  user: TUser;
  authorized: boolean;

  signInVisible: boolean;

  signInError: boolean;
  signInErrorMessage: string;
}

const initialState: TAuthState = {
  visible: false,
  onboardingVisible: false,

  isAuthenticating: false,
  loadedUser: false,
  user: initialUser,
  authorized: false,

  signInVisible: true,

  signInError: false,
  signInErrorMessage: ''
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
        signInVisible: true,
        signInError: false,
        signInErrorMessage: ''
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
    case SIGN_IN:
      return {
        ...state,
        isAuthenticating: true,
        signInError: false,
        signInErrorMessage: ''
      };
    case SIGN_IN_SUCCESS:
      return {
        ...state,
        isAuthenticating: false,
        user: action.user,
        authorized: true,
        signInError: false,
        signInErrorMessage: ''
      };
    case SIGN_IN_FAILURE:
      return {
        ...state,
        isAuthenticating: false,
        signInError: true,
        signInErrorMessage: action.error.message
      };
    case SIGN_OUT:
      return {
        ...initialState
      };
    default:
      return state;
  }
};
