const { QueryTypes } = require('sequelize')
const Sequelize  = require('sequelize')
const Connections = require('../databases/MSSQL/connections/index')

module.exports = {
  async getTable(req, res) {
    const sonoEntregas = new Sequelize(Connections[0])
    const sono = new Sequelize(Connections[1])

    const tSonoEntregas = await sonoEntregas.transaction()
    const tSono = await sono.transaction()

    try {
      const cars = await sonoEntregas.query(
        `SELECT * FROM CARS`,
        { transaction: tSonoEntregas, type: QueryTypes.SELECT }
      )

      const empresas = await sono.query(
        'SELECT * FROM EMPRESA',
        { transaction: tSono, type: QueryTypes.SELECT }
      )

      const shops = await sonoEntregas.query(
        'SELECT * FROM LOJAS',
        { transaction: tSonoEntregas, type: QueryTypes.SELECT }
      )

      const clientes = await sono.query(
        'SELECT * FROM CLIENTES',
        { transaction: tSono, type: QueryTypes.SELECT }
      )

      await tSonoEntregas.commit()
      await tSono.commit()

      return res.status(200).json({
        shops,
        empresas,
        cars,
        clientes
      })
    } catch (error) {
      console.log(error)

      await tSonoEntregas.rollback()
      await tSono.rollback()

      throw new Error('Internal server error')
    }
  }
}
