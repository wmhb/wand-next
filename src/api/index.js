/*
  this file is used to start the server in production mode:
  uses the shared server config for the API, adds production
  config, mounts the UI and launches an express app.
*/
const { join, resolve } = require('path')
const { createServer } = require('http')
const express = require('express')
const history = require('connect-history-api-fallback')
const configure = require('./configure')
const config = require('../../config')
const logger = require('./lib/logger')

const { SERVER_PORT = config.ports.node } = process.env
const app = express()
const server = createServer(app)

configure(app, server)

// Security
app.disable('x-powered-by')

// Single Page App
app.use(history())

// WAND Frontend Build
// https://cli.vuejs.org/guide/deployment.html
const publicPath = resolve(__dirname, '../../dist')
const staticConf = { maxAge: '1y', etag: false };

['assets'].forEach((dir) => {
  app.use(express.static(join(publicPath, dir), staticConf))
})
app.use(express.static(publicPath))

server.listen(SERVER_PORT, () => {
  logger.info('[SYSTEM]'.cyan, `Listening on port ${SERVER_PORT}`)
})
