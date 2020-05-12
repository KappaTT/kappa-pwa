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

const savingPreferences = (prefs) => {
  return {
    type: SAVING_PREFERENCE,
    prefs
  };
};

const savedPreference = (success: boolean) => {
  return {
    type: SAVED_PREFERENCE,
    success
  };
};

export const savePref = (prefs: Partial<Prefs.TPrefs>) => {
  return (dispatch) => {
    dispatch(savingPreferences(prefs));

    Prefs.savePref(prefs).then((res) => {
      dispatch(savedPreference(res.success));
    });
  };
};
