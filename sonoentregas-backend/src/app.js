const express = require('express')
const cors = require('cors')
const path = require('path')

const app = express()

const routes = require('./routes')

app
  .use(cors())
  .use(express.json())
  .use('/imgs', express.static(path.resolve(__dirname, 'imgs')))
  .use(routes)
  .listen(8081, () => console.log('Servidor rodando na porta 8081'))