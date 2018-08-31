const config = require('../config')
const logger = require('./logger')

let state = {
  twitter: {},
  slides: {
    isAutoplay: false,
    active: 'tweets',
    autoplay: ['tweets', 'supporter', 'next', 'playing'],
    available: ['tweets', 'speakers', 'supporter', 'next', 'playing']
  },
  soundcloud: {
    url: config.soundcloud.url,
    isPlaying: false
  }
}
let wand = null
let autoplayInterval = null

init = (socket) => {
  wand = (wand) ? wand : socket
}

all = () => state

get = () => {
  wand.emit('stateChange', state)
}

tweetStore = {
  tweets: [],
  add: (tweet) => {
    tweetStore.tweets
    if (tweetStore.tweets.length > 5) {
      tweetStore.tweets.pop() // Last one out
      tweetStore.tweets.unshift(tweet) // New one on top
    } else {
      tweetStore.tweets.unshift(tweet) // New one on top
    }
  },
  get: () => tweetStore.tweets
}

setTwitter = (val) => {
  Object.assign(state.twitter, val)
  wand.emit('stateChange', state)
}

setSoundcloud = (val) => {
  Object.assign(state.soundcloud, val)
  wand.emit('stateChange', state)
}

setSlide = (val) => {
  Object.assign(state.slides, val)
  wand.emit('stateChange', state)
}

setActiveAutoplaySlide = () => {
  let slides = all().slides.autoplay
  let active = all().slides.active
  let activeIdx = slides.indexOf(active)
  let nextSlide = (activeIdx !== -1 && slides[activeIdx + 1]) ? slides[activeIdx + 1] : slides[0]
  logger.info('[AUTOPLAY]'.cyan, 'Advancing to: /' + nextSlide)
  setSlide({ active: nextSlide})
}

toggleSlideAutoplay = () => {
  setSlide({isAutoplay: !all().slides.isAutoplay})

  if (all().slides.isAutoplay) {
    logger.info('[AUTOPLAY]'.cyan, 'Autoplay Started'.green)

    autoplayInterval = setInterval(() => {
      setActiveAutoplaySlide()
    }, config.slides.duration)
  } else {
    logger.info('[AUTOPLAY]'.cyan, 'Autoplay Stopped'.yellow)
    clearInterval(autoplayInterval)
  }
}

module.exports = {
  all,
  get,
  tweetStore,
  setTwitter,
  setSoundcloud,
  setSlide,
  toggleSlideAutoplay,
  init
}
