const config = {
  name: 'My Wand Server',
  version: '1.0.0',
  users: [
    {
      id: 0,
      username: 'admin',
      password: 'admin',
      role: 'admin'
    }
  ],
  twitter: {
      keys: {
        'consumer_key': 'YOUR_CONSUMER_KEY',
        'consumer_secret': 'YOUR_CONSUMER_SECRET',
        'access_token': 'YOUR_ACCESS_TOKEN',
        'access_token_secret': 'YOUR_ACCESS_TOKEN_SECRET'
      },
      'timeout_ms': 60 * 1000,
      'default_hashtag': '#twitter'
  },
  soundcloud: {
      apiKey: 'SOUNDCLOUD_API_KEY',
      url: 'https://SOUNDCLOUD_DEFAULT_TRACK_OR_PLAYLIST_URL'
  },
  slides: {
      duration: 5000
  },
  SiteHost: 'localhost',
  APIUrl: '/api',
  APIEventsUrl: '/events/all',
  APIAuthBasePath: '/auth',
  APIAuthUrl: '/auth/check/',
  APILoginUrl: '/auth/login/',
  eventsAPIHost: 'http://MYAPIHOST.COM',
  eventsAPIPath: '/api/events',
  auth: {
    secret: 'MY_SUPER_PRIVATE_SECRET',
    issuer: 'ISSUER_URL',
    expiration: '2h'
  },
  ports: {
      node: 61000
  }
}

module.exports = config
