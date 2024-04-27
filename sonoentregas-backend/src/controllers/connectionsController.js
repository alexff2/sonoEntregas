const connections = require('../databases/MSSQL/connections')
const Shops = require('../models/tables/Shops')
const ShopsSceService = require('../services/ShopSceService')

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
  },
  async findShopsSce(_req, res) {
    try {
      const shops = await ShopsSceService.find()

       return res.send(shops)
    } catch (error) {
      console.log(error)      
    }
  },
}