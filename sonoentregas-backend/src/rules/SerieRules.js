
const { QueryTypes } = require('sequelize')
const ProdLojaSeriesModel = require('../models/tables/ProdLojaSeries')
//const ProductModel = require('../models/Produtos')

class SerieRules {
  async createIfDoesNotExist({serialNumber}){
    const isAlreadySerialNumber = await ProdLojaSeriesModel.findAny(1, {
      serialNumber
    })

    if (isAlreadySerialNumber.length > 0) {
      throw {
        error: 'serial number is already!'
      }
    }
  }
}

module.exports = new SerieRules()
