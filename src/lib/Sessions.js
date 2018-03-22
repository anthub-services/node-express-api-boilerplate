import JWT from 'jsonwebtoken'
import Passport from 'passport'
import HttpBearerStrategy from 'passport-http-bearer'
import DB from '../models'
import * as Users from './Users'

Passport.use(new HttpBearerStrategy(
  function(token, done) {
    const { userId } = verifyToken(null, { token, returnData: true })

    return find(null, {
      where: { userId, token },
      returnData: true
    })
    .then(Session => {
      let result = Session

      if (!Session || (Session && Session.signedOut)) result = false

      return done(null, result)
    })
  }
))

export function find(res, options) {
  const { where, returnData } = options

  return DB.Session
    .findOne({
      where,
      include: [{
        model: DB.User,
        as: 'User',
        attributes: ['userId', 'firstName', 'lastName', 'email', 'role', 'status', 'redirect']
      }]
    })
    .then(Session => {
      if (returnData) return Session

      return res.status(Session ? 200 : 404).send(Session)
    })
    .catch(error => {
      console.log(error)

      return returnData ? error : res.status(400).send(error)
    })
}

export function auth(req, res) {
  let status = 200, data = {}
  const { email, password } = verifyToken(res, { token: req.body.token, returnData: true })
  const authResponse = {
    invalid: {
      status: 404,
      data: { message: "The email or password you entered doesn't match any account." }
    },
    blocked: {
      status: 401,
      data: { message: 'Your account is blocked. Please contact the administrator.' }
    }
  }

  return Users
    .find({ where: { email }, returnData: true })
    .then(User => {
      if (!User.object || !(User.object && User.object.authenticate(password)))
        return authResponse.invalid

      if (User.json.status === 'blocked')
        return authResponse.blocked

      const date = new Date()
      const token = JWT.sign(Object.assign({}, User.json, { date }), process.env.JWT_SECRET, { expiresIn: 86400 })
      const sessionData = {
        userId: User.json.userId,
        userAgent: req.headers['user-agent'],
        ipAddress: getIpAddress(req),
        token
      }

      return DB.Session
        .create(sessionData)
        .then(() => {
          data = Object.assign({}, { token }, data, { redirect: User.json.redirect })
          return { status, data }
        })
    })
}

export function signOut(req) {
  const token = req.headers['authorization'].split(' ')[1]
  const updatedAt = new Date()

  return DB.Session
    .update({ signedOut: true, updatedAt }, { where: { token } })
    .then(() => {
      return true
    })
}

export function authBearer() {
  return Passport.authenticate('bearer', { session: false })
}

function verifyToken(res, { token, returnData }) {
  return JWT.verify(
    token,
    process.env.JWT_SECRET,
    function(errors, decoded) {
      if (errors) return returnData ? {} : res.status(401).end()

      return decoded
    }
  )
}

function getIpAddress(req) {
  return (
    req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress
  ).split(',')[0]
}
