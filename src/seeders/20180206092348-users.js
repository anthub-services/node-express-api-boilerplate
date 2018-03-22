'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [
      user('Super Admin', 'User', 'superadmin@email.com', 'Super Admin'),
      user('Admin', 'User', 'admin@email.com', 'Admin'),
      user('Default', 'User', 'user@email.com', 'User'),
      user('Referrer', 'User', 'referrer@email.com', 'User'),
      user('Redirect', 'User', 'redirect@email.com', 'User'),
      user('Blocked', 'User', 'blocked@email.com', 'User', 'blocked'),
    ], {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {})
  }
}

const bcrypt = require('bcrypt')

function user(firstName, lastName, email, role, status='active') {
  const date = new Date()
  const salt = bcrypt.genSaltSync(10)
  const password = bcrypt.hashSync('password', salt)
  const data = {
    firstName,
    lastName,
    email,
    role,
    password,
    status,
    createdAt: date,
    updatedAt: date
  }

  console.log('[User] ', data)

  return data
}
