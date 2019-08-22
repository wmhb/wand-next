const _ = require('underscore')
const router = require('express').Router()
const jwt = require('jsonwebtoken')
const config = require('../../../config')
const stateMgr = require('../lib/stateMgr')
const audio = require('../lib/audio')
const logger = require('../lib/logger')
const twitter = require('../lib/twitter')
const users = require('../model/user')
const auth = require('../lib/auth')

/*
 * AUTHENTICATION
 */

router.post('/login', (req, res) => {
  const userScheme = users.getUserScheme(req)
  let status
  let message

  if (!userScheme.username || !req.body.password) {
    status = 401
    message = 'no fields'
  }

  const user = users.getUserByName(userScheme.userSearch)

  if (!user || user.password !== req.body.password) {
    status = 401
    message = 'Ooops! Something went wrong!'
  }

  if (!status && !message) {
    const payload = _.omit(user, 'password')
    status = 201
    message = jwt.sign(payload, config.auth.secret, { expiresIn: config.auth.expiration })
    logger.info('[login]', `User ${payload.username} logged in successfully`)
  }

  res.status(status).send(message)
})

/*
 * INTERNAL STATE
 */
router.get('/check', auth.authenticate(), (req, res) => {
  res.status(200).send()
})

/*
 * SLIDES
 */
router.post('/slide', auth.authenticate(), (req, res) => {
  stateMgr.setSlide(req.body)
  res.status(200).send()
})

router.get('/slide/autoplay', auth.authenticate(), (req, res) => {
  stateMgr.toggleSlideAutoplay()
  res.status(200).send()
})
/*
 * TWITTER
 */

router.get('/twitter/toggle', auth.authenticate(), (req, res) => {
  stateMgr.setTwitter({ isStreaming: !stateMgr.all().twitter.isStreaming })
  if (stateMgr.all().twitter.isStreaming) {
    twitter.start()
  } else {
    twitter.pause()
  }
  res.status(200).send()
})

router.post('/twitter/hashtag', auth.authenticate(), (req, res) => {
  stateMgr.setTwitter(req.body)
  twitter.setHashtag(stateMgr.all().twitter.hashtag)
  res.status(200).send()
})

/*
 * AUDIO
 */
router.get('/audio/gong', auth.authenticate(), (req, res) => {
  audio.gong()
  res.status(200).send()
})

router.get('/audio/music/toggle', auth.authenticate(), (req, res) => {
  audio.sc.toggle()
  res.status(200).send()
})

router.get('/audio/music/data', (req, res) => {
  audio.sc.getTrackInfo(req.body.url)
    .then(() => {
      res.status(200).send(stateMgr.all().soundcloud)
    })
    .catch(() => {
      res.status(403).send()
    })
})

router.post('/audio/music/url', auth.authenticate(), (req, res) => {
  audio.sc.getTrackInfo(req.body.url)
    .then(() => {
      res.status(200).send(stateMgr.all().soundcloud)
    })
    .catch(() => {
      res.status(403).send()
    })
})

module.exports = router
