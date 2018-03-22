'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Permissions', [
      permission('Full Access', '*'),
      permission('My Profile', '/my-profile'),
      permission('Admin', '/admin'),
      permission('Admin > Dashboard', '/admin/dashboard'),
      permission('Admin > Users', '/admin/users'),
      permission('Admin > Users > Edit', '/admin/users/new'),
      permission('Admin > Users > Edit', '/admin/users/:userId'),
      permission('Admin > Users > Delete', '/admin/users/delete'),
      permission('Admin > Settings', '/admin/settings')
    ], {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Permissions', null, {})
  }
}

function permission(name, path) {
  const date = new Date()
  const data = {
    name,
    path,
    createdAt: date,
    updatedAt: date
  }

  console.log('[Permission] ', data)

  return data
}
