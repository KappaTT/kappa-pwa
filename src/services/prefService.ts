import { getBatch, setItem, setBatch } from '@services/secureStorage';

export interface TPrefs {
  onboarded: boolean;
  agreedToTerms: boolean;
  usernameVisible: boolean;
}

export const initialPrefs: TPrefs = {
  onboarded: false,
  agreedToTerms: false,
  usernameVisible: true
};

/**
 * Load user preferences from storage.
 */
export const loadPrefs = async () => {
  const prefs = await getBatch('preferences', initialPrefs, true);

  return {
    success: true,
    data: {
      prefs
    }
  };
};

/**
 * Save user preferences to storage.
 */
export const savePref = async (prefs: Partial<TPrefs>) => {
  await setBatch('preferences', prefs);

  return {
    success: true,
    data: {
      prefs
    }
  };
};
