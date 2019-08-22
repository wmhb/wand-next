const passport = require('passport')
const passportJWT = require('passport-jwt')
const config = require('../../../config')

const JwtStrategy = passportJWT.Strategy
const { ExtractJwt } = passportJWT
const User = require('../model/user')

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.auth.secret
}

const strategy = new JwtStrategy(opts, (payload, next) => {
  const match = User.getUserByIdAndName(payload.id, payload.username, opts)
  if (match) {
    return next(null, match)
  }
  return next(null, false)
})

module.exports = {
  initialize: () => {
    passport.use(strategy)
    return passport.initialize()
  },
  authenticate() {
    return passport.authenticate('jwt', { session: false })
  }
}
