import { authBearer } from '../lib/Sessions'
import C from '../controllers'

export default (app) => {
  app.get('/', (req, res) => res.status(200).send({
    message: 'Welcome to Node Express API Boilerplate!'
  }))

  /* Sessions */
  app.post('/sign-in', C.Sessions.authenticate)
  app.post('/sign-out', C.Sessions.signOut)
  app.get('/verify-token', authBearer(), C.Sessions.verifyToken)

  /* Tests */
  app.get('/tests', C.Tests.list)
  app.get('/tests/custom-method', C.Tests.customMethod) // Should be placed before other requests with dynamic values
  app.post('/tests', C.Tests.create)
  app.get('/tests/:id', C.Tests.find)
  app.patch('/tests/:id', C.Tests.update)
  app.put('/tests/:id', C.Tests.update)
  app.delete('/tests/:id', C.Tests.destroy)
}
