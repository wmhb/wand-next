const path = require('path')
const bodyParser = require('body-parser')
const config = require('./config')
const auth = require('./lib/auth')
const routes = require('./routes')
const logger = require('./lib/logger')

const stateMgr = require('./lib/stateMgr')
const twitter = require('./lib/twitter')
const audio = require('./lib/audio')

const { SERVER_PORT = config.ports.node } = process.env
const { WS_PORT = config.ports.ws } = process.env

const app = require('express')()
const ws = require('http').Server(app)
  .listen(WS_PORT, function() {
    logger.info('[SYSTEM]'.cyan, `WebSocket listening on port %d" ${WS_PORT}`)
  })
const io = require('socket.io')(ws)


app.use(auth.initialize())

app.disable('x-powered-by')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// Routes
app.use('/', routes)

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

// Catch 401 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Unauthorized')
  err.status = 401
  next(err)
})

// Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message
  })
})

app.listen(SERVER_PORT, () => {
  logger.info('[SYSTEM]'.cyan, `Listening on port ${SERVER_PORT}`)
})

const wand = io.of('/wand')
stateMgr.init(wand)
twitter.init(wand)
audio.init(wand)
