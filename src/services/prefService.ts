import { getBatch, setItem } from '@services/secureStorage';

export interface TPrefs {
  onboarded: boolean;
  usernameVisible: boolean;
}

export const initialPrefs: TPrefs = {
  onboarded: false,
  usernameVisible: true
};

export const loadPrefs = async () => {
  const prefs = await getBatch('preferences', initialPrefs, true);

  return {
    success: true,
    data: {
      prefs
    }
  };
};

export const savePref = async (prefKey: string, prefValue: string) => {
  await setItem(`preferences.${prefKey}`, prefValue);

  return {
    success: true
  };
};
