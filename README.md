[![Build Status](https://travis-ci.org/wmhb/wand-next.svg?branch=master)](https://travis-ci.org/wmhb/wand-next)
# wand-next

> A Webmontag Bremen twitterwall

## First things first...
This project is a WIP and should be treated as such.
There are *many* things that need to be refined, in terms of best, no, any practices, yet.

Nevertheless, any feedback is greatly appreciated. :)

## Build Setup

WAND-NEXT consists of two parts / folders. ``api`` and ``client``.
The following steps are required for a dev & prod build.

### Server / API
``` bash
# switch to api directory
cd api

# install dependencies
npm install

# start nodejs server locally
LOG_LEVEL=info node index.js

# build for production with minification
npm run build
```

### Client / Frontend
``` bash
# switch to client directory
cd client

# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run serve

# build for production with minification
npm run build
```

This client side of this project is build with the vue-cli.
The server side is build using plain webpack and express.

For further explanation on how things work with the vue-cli, checkout the [docs](https://cli.vuejs.org/).

