const { QueryTypes } = require('sequelize')

const Model = require('../databases/MSSQL/Model')
const { getHours } = require('../functions/getDate')

class DevModel extends Model {
  constructor(){
    super('CAT_DEFECT_MAIN', 'ID, DESCRIPTION')
  }
}


module.exports = {
  async getTable(req, res) {
    const { table } = req.params
    const DevMod = new DevModel()

    const hotas = getHours()

    return res.json({hotas})
  }
}