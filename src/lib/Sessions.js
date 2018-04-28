import _ from 'lodash'
import Sequelize from 'sequelize'
import JWT from 'jsonwebtoken'
import Passport from 'passport'
import HttpBearerStrategy from 'passport-http-bearer'
import { filters, pageCount, orderBy, parseEncodedQuery } from '../helpers/ActiveRecord'
import DB from '../models'
import * as Users from './Users'

const Op = Sequelize.Op
const FILTER_OPTIONS = {
  dateFrom: { col: 'createdAt', type: 'minDate' },
  dateTo:   { col: 'createdAt', type: 'maxDate' },
  regexp:   ['userAgent']
}

Passport.use(new HttpBearerStrategy(
  { passReqToCallback: true },
  function(req, token, done) {
    const { userId } = verifyToken(null, { token, key: process.env.JWT_SECRET, returnData: true })
    const ipAddress = getIpAddress(req)
    const userAgent = req.headers['user-agent']

    if (!userId) return done(null, false)

    return find(null, {
      where: { token, ipAddress, userAgent },
      returnData: true
    })
    .then(Session => {
      let result = Session

      if (!Session || (Session && Session.signedOut)) result = false

      return done(null, result)
    })
  }
))

export function list(options) {
  const { res, query, returnData, jsonData } = options
  const { filtered, sorted, limit, page } = query
  const orderOptions = {
    sorted: true,
    replace: {
      user: Sequelize.literal('\"User\".\"firstName\"'),
      updatedAt: Sequelize.literal([
        '\"Session\".\"signedOut\" DESC',
        '\"Session\".\"updatedAt\"'
      ].join(',')),
    }
  }

  return DB.Session
    .findAll({
      where: filters(setQuery(filtered), FILTER_OPTIONS),
      include: [setIncludeUser(filtered)],
      offset: (page - 1) * limit,
      order: orderBy(
        setQuery(sorted, true),
        ['sessionId', 'desc'],
        orderOptions
      ),
      limit
    })
    .then(Sessions => {
      const data = jsonData ? jsonSessions(Sessions) : Sessions

      if (returnData) return data

      return res.status(data ? 200 : 404).send(data)
    })
    .catch(error => {
      console.log(error)

      return returnData ? error : res.status(400).send(error)
    })
}

export function pages({ query }) {
  return DB.Session
    .count({
      col: 'sessionId',
      where: filters(setQuery(query.filtered), FILTER_OPTIONS),
      include: [setIncludeUser(query.filtered)]
    })
    .then(count => {
      return pageCount(query, count)
    })
}

export function find(res, options) {
  const { where, returnData } = options

  return DB.Session
    .findOne({
      where,
      include: [{
        model: DB.User,
        as: 'User',
        attributes: ['userId']
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
  const { token, tkid } = req.body
  const { email, password } = verifyToken(res, { token, key: hash(tkid)[0], returnData: true })
  const authResponse = {
    invalid: {
      status: 404,
      responseData: { message: "The email or password you entered doesn't match any account." }
    },
    blocked: {
      status: 401,
      responseData: { message: 'Your account is blocked. Please contact the administrator.' }
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
      const key = hash()
      const token = JWT.sign({ userId: User.json.userId, date }, process.env.JWT_SECRET, { expiresIn: 86400 })
      const data = JWT.sign(_.merge({}, User.json, { date }), key[0], { expiresIn: 86400 })
      const sessionData = {
        userId: User.json.userId,
        userAgent: req.headers['user-agent'],
        ipAddress: getIpAddress(req),
        token
      }

      return DB.Session
        .create(sessionData)
        .then(() => {
          const responseData = { token, data, redirect: User.json.redirect, tkid: key[1] }

          return { status, responseData }
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

function verifyToken(res, { token, key, returnData }) {
  return JWT.verify(token, key,
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

function jsonSessions(Sessions) {
  return _.map(Sessions, Session => {
      return {
        sessionId: Session.sessionId,
        user: {
          userId: Session.User.userId,
          name: Session.User.fullName()
        },
        userAgent: Session.userAgent,
        ipAddress: Session.ipAddress,
        createdAt: Session.createdAt,
        signedOutAt: Session.signedOutAt()
      }
    })
}

function setQuery(query, sorted=false) {
  const parsed = query ? parseEncodedQuery(query) : []
  const newQuery = _.compact(
    _.map(parsed, p => {
      if (p[0] === 'signedOutAt') return ['updatedAt', p[1]].join(':')
      if (p[0] !== 'user' || (p[0] === 'user' && sorted)) return p.join(':')
    })
  ).join(',')

  return newQuery
}

function setIncludeUser(filtered) {
  const parsed = filtered ? parseEncodedQuery(filtered) : []

  let includeUser = {
    model: DB.User,
    as: 'User',
    attributes: ['userId', 'firstName', 'lastName']
  }

  _.map(parsed, p => {
    if (p[0] === 'user')
      return includeUser['where'] = whereUser(p[1])
  })

  return includeUser
}

function whereUser(values) {
  const decodedValues  = decodeURIComponent(decodeURIComponent(values))
  const userSQLFnArray = _.map(decodedValues.split(' '), value => {
    return { [Op.or]: [
      userSQLFn('firstName', value),
      userSQLFn('lastName', value)
    ]}
  })

  return { [Op.and]: userSQLFnArray }
}

function userSQLFn(column, value) {
  return Sequelize.where(
    Sequelize.fn(
      'lower',
      Sequelize.col(column)
    ),
    { [Op.regexp]: ['\\y', value.toLowerCase(), '\\y'].join('') }
  )
}

function hash(index) {
  const hashList = process.env.HASH.split('.')

  if (index) index = parseInt(index.toString().charAt(index.toString().length - 1), 10)
  else index = _.random(0, hashList.length - 1)

  return [
    hashList[index],
    [_.random(1111111, 9999999), index].join('')
  ]
}
