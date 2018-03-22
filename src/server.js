import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import routes from './routes'

if (!process.env.PORT) {
  require('dotenv').config()
}

if (!process.env.PORT) {
  console.log('[api][port] 7770 set as default')
  console.log('[api][header] Access-Control-Allow-Origin: * set as default')
} else {
  console.log('[api][node] Loaded ENV vars from .env file')
  console.log(`[api][port] ${process.env.PORT}`)
  console.log(`[api][header] Access-Control-Allow-Origin: ${process.env.ALLOW_ORIGIN}`)
}

const app = express()
const port = process.env.PORT || 7770
const allowOrigin = process.env.ALLOW_ORIGIN || '*'

app.listen(port, () => {
  console.log('[api][listen] http://localhost:' + port)
})

app.use(cors({
  origin: process.env.ALLOW_ORIGIN,
  credentials: true,
  allowedHeaders: 'X-Requested-With, Content-Type, Authorization',
  methods: 'GET, POST, PATCH, PUT, DELETE, OPTIONS'
}))

app.use(bodyParser.json())

routes(app)
