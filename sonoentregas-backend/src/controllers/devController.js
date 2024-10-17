const { QueryTypes } = require('sequelize')
const Sequelize  = require('sequelize')
const Connections = require('../databases/MSSQL/connections/index')

module.exports = {
  async getTable(req, res) {
    const sonoEntregas = new Sequelize(Connections[0])
    const sono = new Sequelize(Connections[1])

    const scripUpdate = `
    BEGIN TRANSACTION
    ALTER TABLE SALES ADD D_ENTREGA DATETIME
    UPDATE SALES SET D_ENTREGA = D_ENTREGA1
    ALTER TABLE SALES DROP COLUMN D_ENTREGA1
    ALTER TABLE SALES ADD D_ENTREGA1 DATETIME
    UPDATE SALES SET D_ENTREGA1 = D_ENTREGA
    ALTER TABLE SALES DROP COLUMN D_ENTREGA
    COMMIT TRANSACTION`

    const tSonoEntregas = await sonoEntregas.transaction()
    const tSono = await sono.transaction()

    try {
      await sonoEntregas.query(
        scripUpdate,
        { transaction: tSonoEntregas, type: QueryTypes.SELECT }
      )
    } catch (error) {
      console.log(error)

      await tSonoEntregas.rollback()
      await tSono.rollback()

      throw new Error('Internal server error')
    }
  }
}
