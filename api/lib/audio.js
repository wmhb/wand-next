const Axios = require('axios')
const SoundCloudAudio = require('soundcloud-audio')
const config = require('../config')
const stateMgr = require('./stateMgr')
const logger = require('./logger')

let wand

const gong = () => {
  wand.emit('audio_gong')
  logger.info('[AUDIO][GONG]'.cyan, 'Toggle Playback')
}

const mapTrackData = (data) => {
  let mappedTrackData = {
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
  });

  return stateMgr.all().soundcloud
}

const sc = {
  init: () => {
    sc.resolve(stateMgr.all().soundcloud.url)
      .then(({ data })=> {
        mapAndSetState(data)
      })
      .catch((err) => {
        logger.warn('[AUDIO][SOUNDCLOUD]'.cyan, 'Resolver responded with Status:', err.response.status)
      })
  },
  getTrackInfo: (url) => {
    let scUrl = stateMgr.all().soundcloud.url
    let reqUrl = url || scUrl
    return new Promise((resolve, reject) => {
      if (scUrl !== reqUrl) {
        sc.resolve(reqUrl)
        .then(({ data })=> {
          mapAndSetState(data)
          resolve({success: true})
        })
        .catch(err => {
          logger.warn('[AUDIO][SOUNDCLOUD]'.cyan, 'Resolver responded with Error:', err.response)
          reject(err)
        })
      } else {
        resolve({success: true})
      }
    })
  },
  resolve: (url) => {
    return new Promise((resolve, reject) => {
      Axios.get(`https://api.soundcloud.com/resolve?url=${url}&client_id=${config.soundcloud.apiKey}`)
        .then((resp) => {
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  toggle: () => {
    let sc_state = stateMgr.all().soundcloud.isPlaying
    stateMgr.setSoundcloud({isPlaying: !sc_state})
    wand.emit('audio_sc_toggle', sc_state)
    logger.info('[AUDIO][SOUNDCLOUD]'.cyan, 'Toggle Playback')

  }
}

const init = (socket) => {
  wand = socket
  sc.init()
}

module.exports = {
  gong: gong,
  sc: sc,
  init: init
}
