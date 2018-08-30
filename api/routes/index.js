const config = require('../config')
const router = require('express').Router();
const auth = require('./authentication')
const events = require('../lib/eventlist')

/**
 * Non-authenticated Routes
 */

/**
 * GET /
 */
router.get('/', (req, res) => res.status(200));

/**
 * GET config
 */
router.get('/config',
  function (req, res) {
    res.status(200).send({
      SiteHost: config.SiteHost,
      APIUrl: config.APIUrl,
      APIAuthBasePath: config.APIUrl + config.APIAuthBasePath,
      APISpeakersUrl: config.APIUrl + config.APIEventsUrl + '/speakers',
      APINextUrl: config.APIUrl + config.APIEventsUrl + '/next',
      APILoginUrl: config.APIUrl + config.APILoginUrl,
      APIAuthUrl: config.APIUrl + config.APIAuthUrl,
      ports: config.ports,
      soundcloud: config.soundcloud
    })
  }
)

/**
 * GET Events - Current
 */
router.get('/event/speakers', async (req, res) => {
  try {
    let ev = await events.getEvents(true)
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
    let ev = await events.getEvents(true)
    res.status(200).send(ev.next)
  } catch (err) {
    res.status(500, { error: err })
  }
})

/**
 * Authenticated Routes
 */
router.use('/auth', auth);

module.exports = router;
