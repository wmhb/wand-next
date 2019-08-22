# wand-next

> A Webmontag Bremen twitterwall

[![Build Status](https://travis-ci.org/wmhb/wand-next.svg?branch=master)](https://travis-ci.org/wmhb/wand-next)

## First things first…

This project is a WIP and should be treated as such.
There are *many* things that need to be refined, in terms of best, no, any practices, yet.

Nevertheless, any feedback is greatly appreciated. :)

## Build Setup

WAND-NEXT consists of two parts:

- `src/api`: The server side, using [Express](https://expressjs.com/).
- `src/vue`: The client side, build with [vue-cli](https://cli.vuejs.org/).

The following steps are required for a dev & prod build.

``` bash
# install dependencies
npm install

# create and adapt config - insert your API keys, etc.
cp config{.example,}.js

# start nodejs server locally
npm start

# build for production with minification
npm run build
```
