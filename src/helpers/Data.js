import _ from 'lodash'
import Sequelize from 'sequelize'

const DEFAULT_LIMIT = 20

export function filters(filtered, options={}) {
  if (!filtered) return {}

  const filterArray = []

  decodeURIComponent(filtered).split(',').map(filter => {
    const array = filter.split(':')

    filterArray.push(filterType(array[0], decodeURIComponent(array[1]), options))
  })

  return { $and: filterArray }
}

export function orderBy(sorted, defaultOrder=[]) {
  if (!sorted) return [defaultOrder]

  return sorted.split(',').map(sort => {
    return sort.split(':')
  })
}

export function pageCount({ limit }, count) {
  return Math.ceil(count / (limit ? limit : DEFAULT_LIMIT))
}

function filterType(key, value, options) {
  const optionKeys = Object.keys(options)

  if (_.indexOf(optionKeys, key) > -1) {
    const filterObject = {}
    const type = options[key].type
    const col = options[key].col

    if (type === 'integer')
      filterObject[key] = parseInt(value)

    if (type === 'minDate')
      filterObject[col] = { $gte: new Date(value) }

    if (type === 'maxDate')
      filterObject[col] = { $lte: new Date(value) }

    return filterObject
  }

  return Sequelize.where(
    Sequelize.fn(
      'lower',
      Sequelize.col(key)
    ),
    {
      $like: value.toLowerCase()
    }
  )
}
