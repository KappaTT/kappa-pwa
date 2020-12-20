import * as Google from 'expo-google-app-auth';

import { log } from '@services/logService';
import * as secrets from 'secrets';

/**
 * Attempt to sign in with google.
 */
export const login = async () => {
  try {
    const loginResult = await Google.logInAsync(secrets.GOOGLE_CLIENT_IDS);

    if (loginResult.type === 'success') {
      log(loginResult);

      return {
        success: true,
        data: {
          accessToken: loginResult.accessToken,
          refreshToken: loginResult.refreshToken,
          idToken: loginResult.idToken,
          email: loginResult.user.email,
          familyName: loginResult.user.familyName,
          givenName: loginResult.user.givenName,
          id: loginResult.user.id,
          photoUrl: loginResult.user.photoUrl
        }
      };
    } else {
      log(loginResult);

      return {
        success: false
      };
    }
  } catch (error) {
    log(error.message);

    return {
      success: false
    };
  }
};
