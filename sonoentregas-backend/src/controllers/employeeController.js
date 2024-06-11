const { QueryTypes } = require('sequelize')
const Sequelize  = require('sequelize')
const Connections = require('../databases/MSSQL/connections/index')
const { createWhereScript } = require('../functions/createWhereScript')

module.exports = {
  async index(req, res) {
    const sono = new Sequelize(Connections[1])

    const whereField = {
      code: 'CODIGO',
      name: 'NOME'
    }

    try {
      const employee = await sono.query(
        `SELECT CODIGO id, NOME name FROM FUNCIONARIO WHERE DEMISSAO IS NULL ${createWhereScript(req.query, whereField)}`,
        { type: QueryTypes.SELECT }
      )

      return res.status(200).json(employee)
    } catch (error) {
      console.log(error)

      throw new Error('Internal server error')
    }
  }
}
