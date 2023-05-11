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
    //const { table } = req.params
    const DevMod = new DevModel()

    //const times = getHours()
    const forecast = await DevMod._query(0, 'SELECT * FROM FORECAST WHERE ID = 1', QueryTypes.SELECT)
    const objDateTime = dateTime(forecast[0].createdAt)

    return res.json( objDateTime )
  }
}