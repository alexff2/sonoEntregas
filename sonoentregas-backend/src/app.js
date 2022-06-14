const express = require('express')
const cors = require('cors')
const path = require('path')

const app = express()

const routes = require('./routes')

const port = 8081

app
  .use(cors())
  .use(express.json())
  .use('/imgs', express.static(path.resolve(__dirname, 'imgs')))
  .use(routes)
  .listen(port, () => console.log('Servidor rodando na porta '+port))