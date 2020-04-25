import * as Google from 'expo-google-app-auth';

import { log } from '@services/logService';

export const login = async () => {
  try {
    const loginResult = await Google.logInAsync({
      iosClientId: '223233671218-ceilcecpn0t04ec5or3tk680pfoomf4v.apps.googleusercontent.com',
      androidClientId: '223233671218-joevmt53u95c0o70mttjrodcbd5nj23j.apps.googleusercontent.com',
      iosStandaloneAppClientId: '223233671218-v5meaa316pd8mgar3mgcvsmg3td7qnl6.apps.googleusercontent.com',
      androidStandaloneAppClientId: ''
    });

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
