'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      userRedirect(queryInterface, 'referrer@email.com', { url: '/redux' }),
      userRedirect(queryInterface, 'redirect@email.com', { external: true, url: 'https://github.com/rickyhurtado/node-api-and-client-boilerplate' })
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
  return queryInterface.sequelize.query(`UPDATE "Users" SET "redirect"='${JSON.stringify(redirect)}' WHERE "email"='${email}'`)
}
