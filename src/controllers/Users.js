import * as Users from '../lib/Users'

export default {
  list(req, res) {
    Promise
      .all([
        Users.list({
          res,
          query: req.query,
          returnData: true,
          jsonData: true
        }),
        Users.pages({ query: req.query })
      ])
      .then(promises => {
        res.status(200).send({
          rows: promises[0],
          pages: promises[1]
        })
      })
      .catch(error => {
        res.status(400).send(error)
      })
  },

  create(req, res) {
    // TODO: Create promises for paths creation and
    // sending temporary password to the new user
    // after the user record has beend created

    Users.create({
      res,
      body: req.body
    })
  },

  find(req, res) {
    Users.find({
      res,
      where: {
        userId: req.params.userId
      }
    })
  },

  update(req, res) {
    Users.update({
      res,
      body: req.body,
      userId: req.params.userId
    })
  },

  destroy(req, res) {
    Users.destroy({
      res,
      userId: req.params.userId
    })
  }
}
