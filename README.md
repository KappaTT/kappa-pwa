# kappa-pwa

[![Netlify Status](https://api.netlify.com/api/v1/badges/2958af6c-cac7-434f-a345-064f5df5b01d/deploy-status)](https://app.netlify.com/sites/kappa-pwa/deploys) ![GitHub](https://img.shields.io/github/license/kappatt/kappa-pwa) [![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/jtaylorchang/kappa-pwa.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/jtaylorchang/kappa-pwa/context:javascript) [![Lines of Code](https://tokei.rs/b1/github/jtaylorchang/kappa-pwa)](https://github.com/jtaylorchang/kappa-pwa)

<img src="assets/icon.png" width="256" />

## Secrets

Create a file `src/secrets.ts` as follows:

```javascript
export const API_URL = '<CHANGE ME>';

export const GOOGLE_CLIENT_IDS = {
  dev: '<CHANGE ME>',
  prod: '<CHANGE ME>'
};
```

## Development

| command      | description                                                  |
| ------------ | ------------------------------------------------------------ |
| `expo start` | run the development server. Add the `-c` flag to clear cache |

You can use the appropriate emulator depending on the platform you want to try. The expo CLI will automatically handle the process for building and running the development version without going through the build steps below.

## Deploy

1. `npm install -g netlify-cli` if you don't have netlify installed
2. `yarn deploy`

## License

This project is [GPLv2 licensed](./LICENSE)
