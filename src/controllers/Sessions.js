import * as Sessions from '../lib/Sessions'

export default {
  authenticate(req, res) {
    Sessions
      .auth(req, res)
      .then(auth => {
        res.status(auth.status).send(auth.data)
      })
      .catch(error => {
        res.status(400).send(error)
      })
  },

  signOut(req, res) {
    Sessions.signOut(req)
      .then(() => {
        res.status(200).send()
      })
  },

  verifyToken(req, res) {
    res.status(200).send()
  }
}
