import _ from 'lodash'
import Sequelize from 'sequelize'

const Op = Sequelize.Op
const DEFAULT_LIMIT = 20

export function filters(filtered, options={}) {
  if (!filtered) return {}

  const filterArray = []

  _.map(decodeURIComponent(filtered).split(','), filter => {
    const optionKeys = Object.keys(options)
    const array      = filter.split(':')
    const column     = array[0]
    const value      = array[1]

    if (_.indexOf(optionKeys, 'regexp') > -1 && _.indexOf(options.regexp, column) > -1)
      _.map(decodeURIComponent(value).split(' '), decodedValue => {
        filterArray.push(whereSQLFn(column, decodedValue, 'regexp'))
      })
    else
      filterArray.push(filterType(column, decodeURIComponent(value), options))
  })

  return { [Op.and]: filterArray }
}

export function orderBy(sorted, defaultOrder=[], options) {
  if (!sorted) return [defaultOrder]

  return parseEncodedQuery(sorted, options)
}

export function pageCount({ limit }, count) {
  return Math.ceil(count / (limit ? limit : DEFAULT_LIMIT))
}

export function parseEncodedQuery(query, options) {
  return _.map(query.split(','), q => {
    let kv = q.split(':')

    if (options && options.replace && options.replace[kv[0]])
      return [options.replace[kv[0]], kv[1]]

    return kv
  })
}

function filterType(key, value, options) {
  const optionKeys = Object.keys(options)

  if (_.indexOf(optionKeys, key) > -1) {
    const filterObject = {}
    const type = options[key].type
    const col = options[key].col

    if (type === 'integer')
      filterObject[key] = isNaN(parseInt(value)) ? 0 : parseInt(value)

    if (type === 'minDate')
      filterObject[col] = { [Op.gte]: new Date(value) }

    if (type === 'maxDate')
      filterObject[col] = { [Op.lte]: new Date(value) }

    return filterObject
  }

  return whereSQLFn(key, value)
}

function whereSQLFn(key, value, type='equal') {
  let op = {}

  value = value.toLowerCase()

  if (type === 'equal') op = { [Op.eq]: value }
  if (type === 'regexp') op = { [Op.regexp]: ['\\y', value, '\\y'].join('') }

  return Sequelize.where(
    Sequelize.fn(
      'lower',
      Sequelize.col(key)
    ),
    op
  )
}
