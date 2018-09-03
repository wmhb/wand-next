const _ = require('underscore')
const axios = require('axios')
const moment = require('moment')
const config = require('../config')
const logger = require('./logger')
let events = null;

const mapImgPath = (img) => {
  const regex = /[^\\/]+$/g
  const imgPath = regex.exec(img)
  return (imgPath) ? imgPath[0] : img
}

const mapTalkData = (talks, url) => {
  let mappedTalks = []
  _.each(talks, (talk, idx) => {
    if (talk.speaker === 'Du?' || talk.title === '?' || talk.speaker.includes('tba') || talk.title.includes('tba')) {
      return
    }

    talk.img = [`${url}/${mapImgPath(talk.img)}`]
    if (talk.img2) {
      talk.img.push(`${url}/${mapImgPath(talk.img2)}`)
    }
    delete talk.img2
    mappedTalks.push(talk)
  })
  return mappedTalks
}

const mapEventData = events => {
  let mappedEvents = {};
  const currentMoment = moment(`${events[0].date}${events[0].dateYear}`, 'DD.MM.YYYY').add('days', 1)
  const noNextEvent = moment().isAfter(currentMoment)
  const event = (noNextEvent && events[1]) ? events[1] : events[0]
  mappedEvents.current = _.mapObject(event, (v, k) => {
    if (k === 'talks') {
      return mapTalkData(v, event.url)
    } else {
      return v
    }
  })

  mappedEvents.next = (events.length > 1 && !noNextEvent) ? events[1] : undefined

  return mappedEvents
}

async function getEvents(force = false) {
  try {
    if (!!events || force) {
      let res = await axios.get(config.eventsAPIHost + config.eventsAPIPath)
      events = mapEventData(res.data)
    }
    return events
  } catch (err) {
    logger.error('[eventlist]', 'Events API responded with ', + err.response)
  }

}

module.exports = {
  getEvents: getEvents
}
