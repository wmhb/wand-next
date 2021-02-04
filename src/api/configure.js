/*
  shared server configuration for dev and prod env.
  dev: Webpack Dev Server -> vue.config.js
  prod: Express -> ./index.js
*/
const bodyParser = require('body-parser')
const morgan = require('morgan')
const SocketIO = require('socket.io')
const config = require('../../config')
const auth = require('./lib/auth')
const routeAuth = require('./routes/authentication')
const routeBase = require('./routes/base')

const stateMgr = require('./lib/stateMgr')
const twitter = require('./lib/twitter')
const audio = require('./lib/audio')

const isProd = process.env.NODE_ENV === 'production'

module.exports = (app, server) => {
  app.use(morgan(isProd ? 'combined' : 'dev'))
  app.use(auth.initialize())

  app.disable('x-powered-by')
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: false }))

  // Routes
  /**
   * Base Routes
   */
  app.use('/api', routeBase)
  /**
   * Authenticated Routes
   */
  app.use('/api/auth', routeAuth)

  // Error handler
  app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
      message: err.message
    })
    next()
  })

  const io = SocketIO(server, {
    cors: {
      origin: '*'
    }
  })

  io.on('connection', () => {
    io.emit('initialize', {
      config: {
        APIUrl: config.APIUrl,
        APIAuthBasePath: config.APIUrl + config.APIAuthBasePath,
        APICurrentEventUrl: `${config.APIUrl + config.APIEventsUrl}/current`,
        APINextEventUrl: `${config.APIUrl + config.APIEventsUrl}/next`,
        APILoginUrl: config.APIUrl + config.APILoginUrl,
        APIAuthUrl: config.APIUrl + config.APIAuthUrl,
        ports: config.ports,
        soundcloud: config.soundcloud
      },
      tweets: stateMgr.tweetStore.get(),
      state: stateMgr.get()
    })
  })

  stateMgr.init(io)
  twitter.init(io)
  audio.init(io)
}
