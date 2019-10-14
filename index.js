require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const { promisify } = require('util')
var cors = require('cors')


var auth = require('./auth')
const tokenVerifyMiddleware = require('./token-verify')
const {initializeDatabase} = require('./database')
var customEndpoint = require('./route')

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use('/auth', auth)
app.use(tokenVerifyMiddleware)
app.use('/',customEndpoint)

const startServer = async () => {
  await initializeDatabase(app)

  const port = process.env.SERVER_PORT || 3000
  await promisify(app.listen).bind(app)(port)
  console.log(`Server started at: localhost:${port}`)
}
startServer();

