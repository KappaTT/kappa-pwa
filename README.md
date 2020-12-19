# kappa-mobile

<img src="assets/icon.png" width="256" />

## Secrets

Create a file `src/secrets.ts` as follows:

```javascript
export const API_URL = '<CHANGE ME>';

export const GOOGLE_CLIENT_IDS = {
  iosClientId: '<CHANGE ME>',
  androidClientId: '<CHANGE ME>',
  iosStandaloneAppClientId: '<CHANGE ME>',
  androidStandaloneAppClientId: '<CHANGE ME>'
};

export const SENTRY_DSN = '<CHANGE ME>';
```

## Development

| command      | description                                                  |
| ------------ | ------------------------------------------------------------ |
| `expo start` | run the development server. Add the `-c` flag to clear cache |

You can use the appropriate emulator depending on the platform you want to try. The expo CLI will automatically handle the process for building and running the development version without going through the build steps below.

**Remember to increment the appropriate `expo`, `ios` and `android` versions when releasing updates**

If no changes were made to native binaries, you can update OTA with `expo publish`.

## Building iOS

1. Run `expo build:ios -t archive` and follow the steps to sign in to developer account
2. Run `expo upload:ios`

Note: if the upload step fails with an iTunes Transporter error, use the Transporter app on MacOS to upload manually

## Building iOS Simulator

1. Run `expo build:ios -t simulator`
2. Run `tar -xvzf <your file>.tar.gz`
3. Run `xattr -cr <your app>.app`
4. Run `xcrun simctl install booted kappa-theta-tau.app`
5. Run `xcrun simctl launch booted kappa-theta-tau.app`

## Building Android

First time only:

1. Make sure automatic app signing is enabled in the developer console
2. Copy the SHA-1 from the developer console (this is the hash to use for credentials)
3. Run `expo build:android -t app-bundle`
4. If you do not have a keystore (first time building) have expo manage the creation. This will be the update key
5. Run `expo fetch:android:keystore` to get the keystore (you need this to update the app in the future)
6. Run `expo fetch:android:upload-cert` to get the upload cert
7. Upload the generated app bundle to the developer console

Regular process:

1. Run `expo build:android -t app-bundle`
2. Upload the generated app bundle to the developer console

## Building Android Simulator

1. Download a generic_x86 split APK's. It will be called "google emulator" and pick SDK 29
2. Unzip the file
3. Run a Pixel 3 configured with SDK 29 (Q)
4. Run `adb install-multiple ./*` inside the folder

Note: because the build will generate a new published bundle, it is recommended to build the android version before the iOS version due to the stricter iOS approval requirements.
