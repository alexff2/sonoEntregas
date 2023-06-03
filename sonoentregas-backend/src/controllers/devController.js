const { QueryTypes } = require('sequelize')

const Model = require('../databases/MSSQL/Model')
const { dateTime } = require('../functions/getDate')

class DevModel extends Model {
  constructor(){
    super('CAT_DEFECT_MAIN', 'ID, DESCRIPTION')
  }
}


module.exports = {
  async getTable(req, res) {
    const DevMod = new DevModel()
    /* const DevMod = new DevModel()

    const forecast = await DevMod._query(0, 'SELECT * FROM FORECAST WHERE ID = 1', QueryTypes.SELECT)
    const objDateTime = dateTime(forecast[0].createdAt) */

    const script = `UPDATE FORECAST SET DATE = '2023-05-28' WHERE ID = 1\n`+
    `UPDATE FORECAST SET DATE = '2023-05-29' WHERE ID = 3`

    const response = await DevMod._query(0, script, QueryTypes.RAW)

    return res.json( response )
  }
}