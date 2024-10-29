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
  },
  async findProductsWithSerials(req, res) {
    const {productId} = req.query
    const sonoCd = new Sequelize(Connections[1])

    const scriptProducts = `
    SELECT CODIGO id, NOME name, ALTERNATI alternativeCode FROM PRODUTOS WHERE CODIGO = ${productId}`

    const scriptSerials = `
    SELECT id, serialNumber FROM PRODLOJAS_SERIES_MOVIMENTOS A
    WHERE outputBeepDate IS NULL AND productId = ${productId}`

    try {
      const product = await sonoCd.query(
        scriptProducts,
        { type: QueryTypes.SELECT }
      )

      const serials = await sonoCd.query(
        scriptSerials,
        { type: QueryTypes.SELECT }
      )

      return res.json({product: product[0], serials})
    } catch (error) {
      console.log(error)

      throw new Error('Internal server error')
    }
  },
  async deleteSerial(req, res) {
    const {serialId} = req.query
    const sonoCd = new Sequelize(Connections[1])

    const scriptDelete = `
    DELETE FROM PRODLOJAS_SERIES_MOVIMENTOS WHERE id = ${serialId}`

    try {
      await sonoCd.query(
        scriptDelete,
        { type: QueryTypes.SELECT }
      )

      return res.json({message: 'Serial deleted'})
    } catch (error) {
      console.log(error)

      throw new Error('Internal server error')
    }
  }
}
