const _ = require('underscore')
const config = require('../config')
const users = config.users

const getUserByName = (user) => _.find(config.users, user)
const getUserByIdAndName = (id, name, opts) => {
  return _.omit(_.findWhere(users, { id: id, username: name }), 'password')
}
const getUserScheme = (req) => {
  let username
  let type
  let userSearch = {}

  if (req.body.username) { // The POST contains a username and not an email
    username = req.body.username
    type = 'username'
    userSearch = { username: username }
  } else if (req.body.email) { // The POST contains an email and not an username
    username = req.body.email
    type = 'email'
    userSearch = { email: username }
  }

  return {
    username: username,
    type: type,
    userSearch: userSearch
  }
}

module.exports = {
  getUserByName,
  getUserByIdAndName,
  getUserScheme
}
