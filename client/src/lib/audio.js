import SoundCloudAudio from 'soundcloud-audio'
import Store from './../store'

let player
const url = {}
let playlist
const gong = new Audio('/assets/audio/gong.mp3')

const audio = {
  gong: {
    play: () => {
      if (gong.currentTime === 0) {
        const gongPlayPromise = gong.play()
        if (gongPlayPromise !== undefined) {
          gongPlayPromise
            .then(() => {})
            .catch((error) => {
              console.log('[audio][gong]', 'Gong responded with ', error)
            })
        }
      } else {
        gong.pause()
        gong.currentTime = 0
      }
    }
  },
  music: {
    init: () => {
      player = player || new SoundCloudAudio(Store.getters.config.soundcloud.apiKey)
    },
    getTrackInfo: (scUrl, isPlaying = false) => {
      audio.music.init()
      player.resolve(scUrl, (data) => {
        playlist = data
        if (playlist.kind === 'playlist') {
          player.on('ended', () => {
            player.next()
          })
        } else {
          player.off('ended', () => {
            player.next()
          })
        }

        audio.music.setTrack(scUrl)

        if (isPlaying) {
          audio.music.toggle()
        }
      })
    },
    setTrack: (scUrl) => {
      url.next = scUrl
    },
    play: () => {
      const audioPlayPromise = player.play()
      if (audioPlayPromise !== undefined) {
        audioPlayPromise
          .then(() => {})
          .catch((error) => {
            console.log('[audio][soundcloud]', 'Soundcloudplayer responded with ', error)
          })
      }
    },
    nextTrack: () => {
      player.next()
    },
    prevTrack: () => {
      player.previous()
    },
    pause: () => {
      player.pause()
    },
    stop: () => {
      player.off('ended', () => {
        player.next()
      })
      player.stop()
    },
    toggle: () => {
      if (Store.getters.soundcloud.isPlaying) {
        audio.music.play()
      } else {
        audio.music.pause()
      }
    }
  }
}

export default {
  gong: audio.gong,
  music: audio.music
}
