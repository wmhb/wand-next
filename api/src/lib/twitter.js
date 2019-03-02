const _ = require('underscore')
const axios = require('axios')
const config = require('../config')
const moment = require('moment')
const sanitize = require('sanitize-html')
const Twitter = require('node-tweet-stream')
const logger = require('./logger')
const stateMgr = require('./stateMgr')
const t = new Twitter(config.twitter.keys)

let hashtag = ''
let tweetsLastId = ''

const isNoRetweet = (tweet) => tweet.retweeted === false && (tweet.text || '').substring(0, 2) !== 'RT'
const hasKey = (object, ...keys) => {
  return keys.reduce((a, b) => (a || { })[ b ], object) !== undefined
}
const isExtended = (tweet) => 'extended_tweet' in tweet
const getTweetMedia = tweet => {
  let media = {}
  if (!isExtended(tweet) && hasKey(tweet, 'extended_entities', 'media')) {
    media = tweet.extended_entities.media[0]
  } else if (isExtended(tweet) && hasKey(tweet, 'extended_tweet', 'extended_entities', 'media')) {
    media = tweet.extended_tweet.extended_entities.media[0]
  }
  return media
}
const sanitizeAndHighlightHashtags = (text) => sanitize(text.replace(/(?:https):\/\/[\n\S]+/g, ''))
                                               .replace(/(\#[a-zA-Z0-9\-\_]+)/g,"<span class=\"hashtag\">$1</span>")
                                               .replace(/(\@[a-zA-Z0-9\-\_]+)/g,"<span class=\"mention\">$1</span>")
const processTweet = (tweet) => {
  const text = (isExtended(tweet)) ? tweet.extended_tweet.full_text : tweet.full_text || tweet.text
  const media = getTweetMedia(tweet)
  let entry = {
    id: tweet.id_str,
    created_at: moment(tweet.created_at, 'dd MMM DD HH:mm:ss ZZ YYYY'),
    name: sanitize(tweet.user.name),
    screen_name: sanitize(tweet.user.screen_name),
    avatarUrl: tweet.user.profile_image_url,
    text: sanitizeAndHighlightHashtags(text),
    type: (media.type !== 'photo' && media.type !== 'animated_gif') ? 'text' : media.type,
    class: (media.type !== 'photo' && media.type !== 'animated_gif') ? 'tweet--text ' + tweet.id : 'tweet--photo ' + tweet.id
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

const getToken = async () => {
  try {
    const token = await axios.post(config.twitter.urls.token,
      'grant_type=client_credentials',
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          'Authorization': 'Basic ' + Buffer.from(`${config.twitter.keys.consumer_key}:${config.twitter.keys.consumer_secret}`, 'binary').toString('base64')
        }
      }
    )

    return token.data.access_token
  } catch (err) {
    logger.error('[TWITTER-API:AUTH]'.cyan.red, err)
  }
}

const getLastTweets = async (token) => {
  try {
    const tweets = await axios.post(config.twitter.urls.search,
      {"query": "#wmhb", "maxResults": 10},
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    )

    return tweets.data.results
  } catch (err) {
    logger.error('[TWITTER-API:SEARCH]'.cyan.red, err)
  }
}

const setLastTweets = async () => {
  let token = await getToken()
  if (token) {
    let tweets = await getLastTweets(token)
    tweets = _.first(_.filter(tweets, (tweet) => isNoRetweet(tweet)), 6).reverse()
    tweets.map(tweet => {
      if (isNoRetweet(tweet) && tweet.id_str != tweetsLastId) {
        let processedTweet = processTweet(tweet)
        stateMgr.tweetStore.add(processedTweet)
      }
    })
  }
}

const init = (wand) => {

  /*
   * To use this feature you have to have a valid premium twitter api dev account with a set up app and env
   * see:   https://developer.twitter.com/en/docs/tweets/search/api-reference
   * usage: https://developer.twitter.com/en/docs/tweets/search/api-reference/premium-search.html#DataEndpoint
   */

  if (config.twitter.isPremium && stateMgr.tweetStore.get().length <= 0) {
    logger.info('[TWITTER]'.cyan, `TweetStore Empty. Getting the last 6 tweets from twitter...`)
    setLastTweets()
  }
  stateMgr.setTwitter({hashtag: config.twitter.default_hashtag, isStreaming: true})
  hashtag = config.twitter.default_hashtag


  t.on('tweet', (tweet) => {
    if (isNoRetweet(tweet) && tweet.id_str != tweetsLastId) {
      let processedTweet = processTweet(tweet)
      stateMgr.tweetStore.add(processedTweet)
      logger.info('[TWITTER]'.cyan, `New tweet: ${processedTweet.id}`)
      wand.emit('tweet', processedTweet)
    }
    tweetsLastId = tweet.id_str
  })

  t.on('error', (err) => {
    logger.error('[TWITTER]'.cyan.red, 'err')
  })

  logger.info('[TWITTER]'.cyan, 'Tracking'.green + ' ' + hashtag.bold)
  t.track(hashtag)
}

const pause = () => {
  logger.info('[TWITTER]'.cyan, 'Untracking'.green + ' ' + hashtag.bold)
  t.untrack(hashtag)
  stateMgr.setTwitter({isStreaming: false, hashtag: hashtag})
}

const start = () => {
  logger.info('[TWITTER]'.cyan, 'Tracking'.green + ' ' + hashtag.bold)
  t.track(hashtag)
  stateMgr.setTwitter({isStreaming: true, hashtag: hashtag})
}

const setHashtag = newHashtag => {
  logger.info('[TWITTER]'.cyan, 'Setting hashtag to'.yellow + ' ' + newHashtag.bold)
  t.untrack(hashtag)
  hashtag = newHashtag
  start()
}

module.exports = {
  init: init,
  pause: pause,
  start: start,
  setHashtag: setHashtag
}
