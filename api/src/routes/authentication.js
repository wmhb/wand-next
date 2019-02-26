const _ = require('underscore')
const config = require('../config')
const router = require('express').Router()
const jwt = require('jsonwebtoken')
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
  let userScheme = users.getUserScheme(req)

  if (!userScheme.username || !req.body.password) {
    return res.status(401).send('no fields')
  }

  let user = users.getUserByName(userScheme.userSearch)

  if (!user || user.password !== req.body.password) {
    return res.status(401).send('Ooops! Something went wrong!')
  }

  const payload = _.omit(user, 'password')
  logger.info('[login]', 'User ' + payload.username + ' logged in successfully')
  const token = jwt.sign(payload, config.auth.secret, { expiresIn: config.auth.expiration })

  res.status(201).send({token: token})
})

/*
 * INTERNAL STATE
 */

router.get('/tweets', (req, res) => {
  res.status(200).send(stateMgr.tweetStore.get())
})

router.get('/state', (req, res) => {
  stateMgr.get()
  res.status(200).send({})
})

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
  stateMgr.setTwitter({isStreaming: !stateMgr.all().twitter.isStreaming})
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
router.get('/audio/gong', auth.authenticate(),  (req, res) => {
  audio.gong()
  res.status(200).send()
})

router.get('/audio/music/toggle', auth.authenticate(),  (req, res) => {
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
    });
})

router.post('/audio/music/url', auth.authenticate(), (req, res) => {
  audio.sc.getTrackInfo(req.body.url)
    .then(() => {
      res.status(200).send(stateMgr.all().soundcloud)
    })
    .catch(() => {
      res.status(403).send()
    });
})

module.exports = router
