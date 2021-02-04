const fs = require('fs')
const { resolve } = require('path')
const _ = require('underscore')
const moment = require('moment')
const sanitize = require('sanitize-html')
const Twitter = require('twit')
const config = require('../../../config')
const logger = require('./logger')
const stateMgr = require('./stateMgr')

const T = new Twitter({ ...config.twitter.keys })

let hashtag = ''
let tweetsLastId = ''
let stream
let wand

const isNoRetweet = (tweet) => tweet.retweeted === false && (tweet.text || '').substring(0, 2) !== 'RT'
const hasKey = (object, ...keys) => keys.reduce((a, b) => (a || { })[b], object) !== undefined
const isExtended = (tweet) => 'extended_tweet' in tweet
const getTweetMedia = (tweet) => {
  let mediaEntity = {}
  if (!isExtended(tweet) && hasKey(tweet, 'extended_entities', 'media')) {
    [mediaEntity] = tweet.extended_entities.media
  }

  if (isExtended(tweet) && hasKey(tweet, 'extended_tweet', 'extended_entities', 'media')) {
    [mediaEntity] = tweet.extended_tweet.extended_entities.media
  }

  return mediaEntity
}
const sanitizeAndHighlightHashtags = (text) => sanitize(text.replace(/((?:https):\/\/[\S]+)/gm, ''))
  .replace(/(#[a-zA-Z0-9\-_]+)/g, '<span class="hashtag">$1</span>')
  .replace(/(@[a-zA-Z0-9\-_]+)/g, '<span class="mention">$1</span>')
const processTweet = (tweet) => {
  const text = (isExtended(tweet)) ? tweet.extended_tweet.full_text : tweet.full_text || tweet.text
  const media = getTweetMedia(tweet)
  const isText = media.type !== 'photo' && media.type !== 'animated_gif'
  const entry = {
    id: tweet.id_str,
    created_at: moment(tweet.created_at, 'dd MMM DD HH:mm:ss ZZ YYYY'),
    name: sanitize(tweet.user.name),
    screen_name: sanitize(tweet.user.screen_name),
    avatarUrl: tweet.user.profile_image_url,
    text: sanitizeAndHighlightHashtags(text),
    type: isText ? 'text' : media.type,
    class: isText ? `tweet--text ${tweet.id}` : `tweet--photo ${tweet.id}`
  }

  if (media.type === 'photo') { // Tweet contains image
    entry.image = {
      url: media.media_url,
      width: media.sizes.large.w,
      height: media.sizes.large.h
    }
  }

  if (media.type === 'animated_gif') { // Tweet contains animated-gif (MP4)
    entry.image = {
      url: media.video_info.variants[0].url,
      width: media.video_info.aspect_ratio[0],
      height: media.video_info.aspect_ratio[1]
    }
  }
  return entry
}

const getLastTweets = () => {
  const tweetsDB = resolve(__dirname, '../../../tweets-db.json')
  let tweets
  try {
    tweets = fs.readFileSync(tweetsDB, 'utf8')
    tweets = JSON.parse(tweets).results
  } catch (readParseError) {
    tweets = {}
  }

  return tweets
}

const setLastTweets = async () => {
  let tweets = await getLastTweets()
  tweets = _.first(_.filter(tweets, (tweet) => isNoRetweet(tweet)), 6).reverse()
  tweets.map((tweet) => {
    if (isNoRetweet(tweet) && parseInt(tweet.id_str, 10) !== tweetsLastId) {
      const processedTweet = processTweet(tweet)
      stateMgr.tweetStore.add(processedTweet)
    }
    return tweet
  })
}

const initStream = () => {
  logger.info('[TWITTER]'.cyan, `${'Tracking'.green} ${hashtag.bold}`)
  stream = T.stream('statuses/filter', { track: `${hashtag}` })

  stream.on('tweet', (tweet) => {
    try {
      if (isNoRetweet(tweet) && parseInt(tweet.id_str, 10) !== tweetsLastId) {
        const processedTweet = processTweet(tweet)
        stateMgr.tweetStore.add(processedTweet)
        logger.info('[TWITTER]'.cyan, `New tweet: ${processedTweet.id}`)
        wand.emit('tweet', processedTweet)
      }
      tweetsLastId = tweet.id_str
    } catch (err) {
      logger.error('[TWITTER - PROCESSTWEET]'.cyan.red, err)
    }
  })

  stream.on('error', (err) => {
    logger.error('[TWITTER]'.cyan.red, err)
  })
}

const init = (socket) => {
  /*
   * To use this feature you have to have a valid premium twitter api dev account with a set up app and env
   * see:   https://developer.twitter.com/en/docs/tweets/search/api-reference
   * usage: https://developer.twitter.com/en/docs/tweets/search/api-reference/premium-search.html#DataEndpoint
   */
  wand = socket
  if (config.twitter.isPremium && stateMgr.tweetStore.get().length <= 0) {
    logger.info('[TWITTER]'.cyan, 'TweetStore Empty. Getting the last 6 tweets from twitter...')
    setLastTweets()
  }
  stateMgr.setTwitter({ hashtag: config.twitter.default_hashtag, isStreaming: true })
  hashtag = config.twitter.default_hashtag

  initStream()
}

const pause = () => {
  logger.info('[TWITTER]'.cyan, `${'Untracking'.green} ${hashtag.bold}`)
  stream.stop()
  stateMgr.setTwitter({ isStreaming: false, hashtag })
}

const start = () => {
  logger.info('[TWITTER]'.cyan, `${'Tracking'.green} ${hashtag.bold}`)
  stream.start()
  stateMgr.setTwitter({ isStreaming: true, hashtag })
}

const setHashtag = (newHashtag) => {
  logger.info('[TWITTER]'.cyan, `${'Setting hashtag to'.yellow} ${newHashtag.bold}`)
  stream.stop()
  hashtag = newHashtag
  initStream()
}

module.exports = {
  init,
  pause,
  start,
  setHashtag
}
