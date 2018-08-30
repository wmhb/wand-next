const config = require('../config')
const passport = require('passport')
const passportJWT = require('passport-jwt')
const JwtStrategy = passportJWT.Strategy
const ExtractJwt = passportJWT.ExtractJwt
const User = require('../model/user')

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.auth.secret
}

const strategy = new JwtStrategy(opts, (payload, next) => {
  let match = User.getUserByIdAndName(payload.id, payload.username, opts)
  if (match) {
    return next(null,match)
  } else {
    return next(null, false)
  }
})

module.exports = {
  initialize: () => {
    passport.use(strategy)
    return passport.initialize()
  },
  authenticate: function() {
      return passport.authenticate("jwt", { session: false })
  }
}
