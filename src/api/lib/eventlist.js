const _ = require('underscore')
const axios = require('axios')
const config = require('../../../config')
const logger = require('./logger')

let events = null

const mapImgPath = (img) => {
  const regex = /[^\\/]+$/g
  const imgPath = regex.exec(img)
  return (imgPath) ? imgPath[0] : img
}

const mapTalkData = (talks, url) => {
  const mappedTalks = []
  _.map(talks, (talk) => {
    if (talk.speaker === 'Du?' || talk.title === '?' || talk.speaker.includes('tba') || talk.title.includes('tba')) {
      return
    }
    const t = talk
    t.img = [`${url}/${mapImgPath(talk.img)}`]
    if (t.img2) {
      t.img.push(`${url}/${mapImgPath(talk.img2)}`)
    }
    delete t.img2
    mappedTalks.push(t)
  })
  return mappedTalks
}

const mapEventData = (ev) => {
  const mappedEvents = {
    current: _.mapObject(ev[0], (v, k) => {
      if (k === 'talks') {
        return mapTalkData(v, ev[0].url)
      }
      return v
    }),
    next: (ev.length > 1) ? ev[1] : undefined
  }

  return mappedEvents
}

async function getEvents(force = false) {
  try {
    if (!!events || force) {
      const res = await axios.get(config.eventsAPIHost + config.eventsAPIPath)
      events = mapEventData(res.data)
    }
  } catch (err) {
    logger.error('[eventlist]', 'Events API responded with ', +err.response)
  }

  return events
}

module.exports = {
  getEvents
}
