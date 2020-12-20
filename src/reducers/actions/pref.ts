import { LOADING_PREFERENCES, LOADED_PREFERENCES, SAVING_PREFERENCE, SAVED_PREFERENCE } from '@reducers/pref';
import * as Prefs from '@services/prefService';

/**
 * Is loading user preferences.
 */
const loadingPreferences = () => {
  return {
    type: LOADING_PREFERENCES
  };
};

/**
 * Finished loading user preferences successfully.
 */
const loadedPreferences = (prefs: Prefs.TPrefs) => {
  return {
    type: LOADED_PREFERENCES,
    prefs
  };
};

/**
 * Load user preferences from local storage.
 */
export const loadPrefs = () => {
  return (dispatch) => {
    dispatch(loadingPreferences());

    Prefs.loadPrefs().then((res) => {
      dispatch(loadedPreferences(res.data.prefs));
    });
  };
};

/**
 * Is saving user preferences.
 */
const savingPreferences = (prefs) => {
  return {
    type: SAVING_PREFERENCE,
    prefs
  };
};

/**
 * Finished saving user preferences successfully.
 */
const savedPreference = (success: boolean) => {
  return {
    type: SAVED_PREFERENCE,
    success
  };
};

/**
 * Save user preferences to local storage.
 */
export const savePref = (prefs: Partial<Prefs.TPrefs>) => {
  return (dispatch) => {
    dispatch(savingPreferences(prefs));

    Prefs.savePref(prefs).then((res) => {
      dispatch(savedPreference(res.success));
    });
  };
};
