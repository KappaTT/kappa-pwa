import * as Google from 'expo-google-app-auth';

import { log } from '@services/logService';

export const login = async () => {
  try {
    const loginResult = await Google.logInAsync({
      iosClientId: '223233671218-ceilcecpn0t04ec5or3tk680pfoomf4v.apps.googleusercontent.com',
      androidClientId: '223233671218-joevmt53u95c0o70mttjrodcbd5nj23j.apps.googleusercontent.com'
    });

    if (loginResult.type === 'success') {
      log(loginResult);
      return loginResult;
    } else {
      return undefined;
    }
  } catch (error) {
    return undefined;
  }
};
