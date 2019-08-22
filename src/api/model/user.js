const _ = require('underscore')
const config = require('../../../config')

const { users } = config

const getUserByName = user => _.find(config.users, user)
const getUserByIdAndName = (id, name) => _.omit(_.findWhere(users, { id, username: name }), 'password')
const getUserScheme = (req) => {
  let { username } = req.body
  const { email } = req.body
  let type
  let userSearch = {}

  if (username) { // The POST contains a username and not an email
    type = 'username'
    userSearch = { username }
  } else if (email) { // The POST contains an email and not an username
    username = email
    type = 'email'
    userSearch = { email: username }
  }

  return {
    username,
    type,
    userSearch
  }
}

module.exports = {
  getUserByName,
  getUserByIdAndName,
  getUserScheme
}
