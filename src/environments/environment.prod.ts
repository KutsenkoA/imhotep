const CLIENT_ID = '7c474e27de89589114f9';

export const environment = {
  production: true,
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
