import * as Sessions from '../lib/Sessions'

export default {
  list(req, res) {
    Promise
      .all([
        Sessions.list({
          res,
          query: req.query,
          returnData: true,
          jsonData: true
        }),
        Sessions.pages({ query: req.query })
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

  authenticate(req, res) {
    Sessions
      .auth(req, res)
      .then(auth => {
        res.status(auth.status).send(auth.responseData)
      })
      .catch(error => {
        res.status(400).send(error)
      })
  },

  signOut(req, res) {
    Sessions
      .signOut(req)
      .then(() => {
        res.status(200).send()
      })
  },

  verifyToken(req, res) {
    res.status(200).send()
  }
}
