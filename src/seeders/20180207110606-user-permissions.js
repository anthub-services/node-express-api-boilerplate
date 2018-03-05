'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      userPermission(queryInterface, 'admin@email.com', '*'),
      userPermission(queryInterface, 'admin_no_settings@email.com', '*'),
      userPermission(queryInterface, 'admin_no_settings@email.com', '/admin/settings', false),
      userPermission(queryInterface, 'user@email.com', '/my-profile'),
      userPermission(queryInterface, 'user@email.com', '/admin'),
      userPermission(queryInterface, 'user@email.com', '/admin/dashboard'),
      userPermission(queryInterface, 'referrer@email.com', '/my-profile'),
      userPermission(queryInterface, 'referrer@email.com', '/admin'),
      userPermission(queryInterface, 'referrer@email.com', '/admin/dashboard'),
      userPermission(queryInterface, 'redirect@email.com', '/my-profile'),
      userPermission(queryInterface, 'redirect@email.com', '/admin'),
      userPermission(queryInterface, 'redirect@email.com', '/admin/dashboard')
    ])
    .then(promises => {
      return queryInterface.bulkInsert('UserPermissions', promises, {})
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('UserPermissions', null, {})
  }
}

function userPermission(queryInterface, email, path, allowedPath=true) {
  return Promise
    .all([
      userId(queryInterface, email),
      permissionId(queryInterface, path)
    ])
    .then(promises => {
      const date = new Date()
      const data = {
        userId: promises[0],
        permissionId: promises[1],
        allowedPath: allowedPath,
        createdAt: date,
        updatedAt: date
      }

      console.log(`[User Permission, ${email}, ${path}] `, data)

      return data
    })
}

function userId(queryInterface, email) {
  return queryInterface
    .rawSelect('Users', {
      where: { email: email },
    }, ['userId'])
}

function permissionId(queryInterface, path) {
  return queryInterface
    .rawSelect('Permissions', {
      where: { path: path },
    }, ['permissionId'])
}
