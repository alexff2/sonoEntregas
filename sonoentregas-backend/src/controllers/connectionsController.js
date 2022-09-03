const { QueryTypes } = require('sequelize')
const connections = require('../databases/MSSQL/connections')
const Empresa = require('../models/Empresas')

module.exports = {
  async findConnections(req, res) {
    return res.send(connections)
  },
  async findShops(req, res) {
    try {
      const empresas = await Empresa._query(0, 'SELECT * FROM LOJAS', QueryTypes.SELECT)

      return res.send(empresas)
    } catch (error) {
      console.log(error)      
    }
  }
}