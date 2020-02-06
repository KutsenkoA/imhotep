// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

const CLIENT_ID = '7c474e27de89589114f9';

export const environment = {
  production: false,
  auth: {
    github: {
      url: 'https://github.com/login/oauth/authorize',
      exchange_url: 'https://github.com/login/oauth/access_token',
      client_id: CLIENT_ID,
      scope: 'repo',
      redirect: {
        code_url: 'https://067201c0-88f6-42d2-b99b-07c71b84726f.jexia.app/token',
        token_url: ''
      },
      settings: `https://github.com/settings/connections/applications/${CLIENT_ID}`
    }
  },
  repos: [
    'yggi-modules',
    'rakshak',
    'imhotep'
  ]
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
