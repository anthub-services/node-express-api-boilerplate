'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      userRedirect(queryInterface, 'referrer@email.com', '/redux'),
      userRedirect(queryInterface, 'redirect@email.com', 'https://github.com/anthub-services/create-react-app-boilerplate')
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      userRedirect(queryInterface, 'referrer@email.com', null),
      userRedirect(queryInterface, 'redirect@email.com', null)
    ])
  }
}

function userRedirect(queryInterface, email, redirect) {
  console.log('[User Redirect] ', redirect)
  return queryInterface.sequelize.query(`UPDATE "Users" SET "redirect"='${redirect}' WHERE "email"='${email}'`)
}
