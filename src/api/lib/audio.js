const Axios = require('axios')
const config = require('../../../config')
const stateMgr = require('./stateMgr')
const logger = require('./logger')

let wand

const gong = () => {
  wand.emit('audio_gong')
  logger.info('[AUDIO][GONG]'.cyan, 'Toggle Playback')
}

const mapTrackData = (data) => {
  const mappedTrackData = {
    kind: data.kind,
    title: data.title,
    artist: data.user.username
  }

  if (data.kind === 'track') {
    mappedTrackData.artwork_url = ((data.artwork_url) ? data.artwork_url : '').replace('large.jpg', 't500x500.jpg')
    mappedTrackData.waveform_url = data.waveform_url
  } else {
    mappedTrackData.title = `${data.title} Playlist`
    mappedTrackData.artwork_url = data.tracks[0].artwork_url.replace('large.jpg', 't500x500.jpg')
    mappedTrackData.waveform_url = data.tracks[0].waveform_url
    mappedTrackData.tracks = data.tracks
  }

  return mappedTrackData
}

const mapAndSetState = (data) => {
  const mappedTrackData = mapTrackData(data)

  stateMgr.setSoundcloud({
    url: data.permalink_url,
    data: mappedTrackData,
    isPlaying: stateMgr.all().soundcloud.isPlaying
  })

  return stateMgr.all().soundcloud
}

const sc = {
  init: () => {
    sc.resolve(stateMgr.all().soundcloud.url)
      .then(({ data }) => {
        mapAndSetState(data)
      })
      .catch((err) => {
        logger.warn('[AUDIO][SOUNDCLOUD]'.cyan, 'Resolver responded with Status:', err.response.status)
      })
  },
  getTrackInfo: (url) => {
    const scUrl = stateMgr.all().soundcloud.url
    const reqUrl = url || scUrl
    // eslint-disable-next-line consistent-return
    return new Promise((resolve, reject) => {
      if (scUrl !== reqUrl) {
        sc.resolve(reqUrl)
          .then(({ data }) => {
            mapAndSetState(data)
            return resolve({ success: true })
          })
          .catch((err) => {
            logger.warn('[AUDIO][SOUNDCLOUD]'.cyan, 'Resolver responded with Error:', err.response.status)
            return reject(err)
          })
      } else {
        return resolve({ success: true })
      }
    })
  },
  resolve: url => new Promise((resolve, reject) => {
    Axios.get(`https://api.soundcloud.com/resolve?url=${url}&client_id=${config.soundcloud.apiKey}`)
      .then(resp => resolve(resp))
      .catch(err => reject(err))
  }),
  toggle: () => {
    const scState = stateMgr.all().soundcloud.isPlaying
    stateMgr.setSoundcloud({ isPlaying: !scState })
    wand.emit('audio_sc_toggle', scState)
    logger.info('[AUDIO][SOUNDCLOUD]'.cyan, 'Toggle Playback')
  }
}

const init = (socket) => {
  wand = socket
  sc.init()
}

module.exports = {
  gong,
  sc,
  init
}
