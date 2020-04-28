import { LOADING_PREFERENCES, LOADED_PREFERENCES, SAVING_PREFERENCE, SAVED_PREFERENCE } from '@reducers/pref';
import * as Prefs from '@services/prefService';

const loadingPreferences = () => {
  return {
    type: LOADING_PREFERENCES
  };
};

const loadedPreferences = (prefs: Prefs.TPrefs) => {
  return {
    type: LOADED_PREFERENCES,
    prefs
  };
};

export const loadPrefs = () => {
  return (dispatch) => {
    dispatch(loadingPreferences());

    Prefs.loadPrefs().then((res) => {
      dispatch(loadedPreferences(res.data.prefs));
    });
  };
};

const savingPreference = (prefKey: string, prefValue: any) => {
  return {
    type: SAVING_PREFERENCE,
    prefKey,
    prefValue
  };
};

const savedPreference = () => {
  return {
    type: SAVED_PREFERENCE
  };
};

export const savePref = (prefKey: string, prefValue: any) => {
  return (dispatch) => {
    dispatch(savingPreference(prefKey, prefValue));

    Prefs.savePref(prefKey, prefValue).then((res) => {
      dispatch(savedPreference());
    });
  };
};
