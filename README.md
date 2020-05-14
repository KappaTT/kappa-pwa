# ktt-frontend

<img src="assets/icon.png#rounded" style="border-radius: 25%; overflow: hidden;" width="256" />

## Development

| command      | description                                                  |
| ------------ | ------------------------------------------------------------ |
| `expo start` | run the development server. Add the `-c` flag to clear cache |

## Building iOS

1. Run `expo build:ios`
2. Run `expo upload:ios`

## Building iOS Simulator

1. Run `expo build:ios -t simulator`
2. Run `tar -xvzf <your file>.tar.gz`
3. Run `xattr -cr <your app>.app`
4. Run `xcrun simctl install booted kappa-theta-tau.app`
5. Run `xcrun simctl launch booted kappa-theta-tau.app`

## Building Android

1. Make sure automatic app signing is enabled in the developer console
2. Copy the SHA-1 from the developer console (this is the hash to use for credentials)
3. Run `expo build:android` and select app-bundle
4. If you do not have a keystore (first time building) have expo manage the creation. This will be the update key
5. Run `expo fetch:android:keystore` to get the keystore (you need this to update the app in the future)
6. Run `expo fetch:android:upload-cert` to get the upload cert
7. Upload the generated app bundle to the developer console

## Testing Android

1. Download a generic_x86 split APK's. It will be called "google emulator" and pick SDK 29
2. Unzip the file
3. Run a Pixel 3 configured with SDK 29 (Q)
4. Run `adb install-multiple ./*` inside the folder
