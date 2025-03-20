const Sequelize  = require('sequelize')

async function connectWithRetry(connectionConfig, maxAttempts = 5, delay = 5000) {
  let attempts = 0
  let sequelize

  while (attempts < maxAttempts) {
    try {
      sequelize = new Sequelize(connectionConfig)
      await sequelize.authenticate()
      return sequelize
    } catch (error) {
      attempts++
      console.error(`Tentativa ${attempts}: Falha na conexão com ${connectionConfig.database}. Erro: ${error.message}`)

      if (attempts < maxAttempts) {
          console.log(`Tentando novamente em ${delay / 1000} segundos...`)
          await new Promise(res => setTimeout(res, delay))
      } else {
          console.error(`Número máximo de tentativas atingido para ${connectionConfig.database}.`)
          throw error // Lança o erro se todas as tentativas falharem
      }
    }
  }
}

module.exports = connectWithRetry