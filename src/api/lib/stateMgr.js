const config = require('../../../config')
const logger = require('./logger')

const state = {
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

const init = (socket) => {
  wand = socket
}

const all = () => state

const get = () => state

const tweetStore = {
  tweets: [],
  add: (tweet) => {
    if (tweetStore.tweets.length > 5) {
      tweetStore.tweets.pop() // Last one out
    }
    tweetStore.tweets.unshift(tweet) // New one on top
  },
  get: () => tweetStore.tweets
}

const setTwitter = (val) => {
  Object.assign(state.twitter, val)
  wand.emit('stateChange', state)
}

const setSoundcloud = (val) => {
  Object.assign(state.soundcloud, val)
  wand.emit('stateChange', state)
}

const setSlide = (val) => {
  Object.assign(state.slides, val)
  wand.emit('stateChange', state)
}

const setActiveAutoplaySlide = () => {
  const slides = all().slides.autoplay
  const { active } = all().slides
  const activeIdx = slides.indexOf(active)
  const nextSlide = (activeIdx !== -1 && slides[activeIdx + 1]) ? slides[activeIdx + 1] : slides[0]
  logger.info('[AUTOPLAY]'.cyan, `Advancing to: /${nextSlide}`)
  setSlide({ active: nextSlide })
}

const toggleSlideAutoplay = () => {
  setSlide({ isAutoplay: !all().slides.isAutoplay })

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
