'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [
      user('Super Admin', 'User', 'admin@email.com'),
      user('Admin', 'User', 'admin_no_settings@email.com'),
      user('Default', 'User', 'user@email.com'),
      user('Referrer', 'User', 'referrer@email.com'),
      user('Redirect', 'User', 'redirect@email.com'),
      user('Blocked', 'User', 'blocked@email.com', 'blocked'),
    ], {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {})
  }
}

const bcrypt = require('bcrypt')

function user(firstName, lastName, email, status='active') {
  const date = new Date()
  const salt = bcrypt.genSaltSync(10)
  const password = bcrypt.hashSync('password', salt)
  const data = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: password,
    status: status,
    createdAt: date,
    updatedAt: date
  }

  console.log('[User] ', data)

  return data
}
