const express = require('express')
const cors = require('cors')
const app = express()

const routes = require('./routes')

app
  .use(cors())
  .use(express.json())
  .use(routes)
  .listen(8081, () => console.log('Servidor rodando na porta 8081'))