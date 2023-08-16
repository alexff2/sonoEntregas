const { QueryTypes } = require('sequelize')
const connections = require('../databases/MSSQL/connections')
const Shops = require('../models/tables/Shops')

module.exports = {
  async findConnections(req, res) {
    return res.send(connections)
  },
  async findShops(req, res) {
    try {
      const shops = await Shops.findAll(0)

      return res.send(shops)
    } catch (error) {
      console.log(error)      
    }
  }
}