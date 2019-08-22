const router = require('express').Router()
const config = require('../../../config')
const events = require('../lib/eventlist')

/**
 * Non-authenticated Routes
 */

/**
 * GET /
 */
router.get('/', (req, res) => res.status(200))

/**
 * GET config
 */
router.get('/config', (req, res) => {
  res.status(200).send({
    APIUrl: config.APIUrl,
    APIAuthBasePath: config.APIUrl + config.APIAuthBasePath,
    APICurrentEventUrl: `${config.APIUrl + config.APIEventsUrl}/current`,
    APINextEventUrl: `${config.APIUrl + config.APIEventsUrl}/next`,
    APILoginUrl: config.APIUrl + config.APILoginUrl,
    APIAuthUrl: config.APIUrl + config.APIAuthUrl,
    ports: config.ports,
    soundcloud: config.soundcloud
  })
})

/**
 * GET Events - Current
 */
router.get('/event/current', async (req, res) => {
  try {
    const ev = await events.getEvents(true)
    res.status(200).send(ev.current)
  } catch (err) {
    res.status(500, { error: err })
  }
})


/**
 * GET Events - Next
 */
router.get('/event/next', async (req, res) => {
  try {
    const ev = await events.getEvents(true)
    res.status(200).send(ev.next)
  } catch (err) {
    res.status(500, { error: err })
  }
})

module.exports = router
