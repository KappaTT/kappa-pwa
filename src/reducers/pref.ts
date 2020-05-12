import { TPrefs, initialPrefs } from '@services/prefService';

export const LOADING_PREFERENCES = 'LOADING_PREFERENCES';
export const LOADED_PREFERENCES = 'LOADED_PREFERENCES';

export const SAVING_PREFERENCE = 'SAVING_PREFERENCE';
export const SAVED_PREFERENCE = 'SAVED_PREFERENCE';

export interface TPrefState {
  loading: boolean;
  loaded: boolean;
  saving: boolean;

  data: TPrefs;
}

const initialState: TPrefState = {
  loading: false,
  loaded: false,
  saving: false,

  data: initialPrefs
};

export default (state = initialState, action: any): TPrefState => {
  switch (action.type) {
    case LOADING_PREFERENCES:
      return {
        ...state,
        loading: true
      };
    case LOADED_PREFERENCES:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.prefs
      };
    case SAVING_PREFERENCE:
      return {
        ...state,
        saving: true,
        data: {
          ...state.data,
          ...action.prefs
        }
      };
    case SAVED_PREFERENCE:
      return {
        ...state,
        saving: false
      };
    default:
      return state;
  }
};
