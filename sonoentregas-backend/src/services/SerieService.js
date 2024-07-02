//@ts-check
/**
 * @typedef {Object} InputProps
 * @property {number} serialNumber
 * @property {number} productId
 * @property {string} module
 * @property {number} moduleId
 * @property {number} userId
 * @property {Object} connection
 * 
 * @typedef {Object} OutputProps
 * @property {number} serialNumber
 * @property {string} module
 * @property {number} moduleId
 * @property {number} userId
 * @property {Object} connection
 * 
 * @typedef {Object} IProdLojaSeries
 * @property {number} productId
 * @property {number} serialNumber
 * @property {string} inputModule
 * @property {number} inputModuleId
 * @property {string} inputBeepDate
 * @property {number} inputUserId
 */

const ProdLojaSeriesMovimentosModel = require('../models/tables/ProdLojaSeriesMovimentos')

class SerieService {
  /**@param {InputProps} props */
  async create({productId, serialNumber, module, moduleId, userId, connection}) {
    /**@type {IProdLojaSeries} */
    const prodLojasSeries = {
      productId: productId,
      serialNumber,
      inputModule: module,
      inputModuleId: moduleId,
      inputBeepDate: new Date().toISOString(),
      inputUserId: userId
    }

    const prodLojasSeriesResponse = await ProdLojaSeriesMovimentosModel.create(1, [prodLojasSeries], true, connection)

    return prodLojasSeriesResponse.serialNumber
  }

  /**@param {OutputProps} props */
  async output({ serialNumber, module, moduleId, userId, connection}) {
    await ProdLojaSeriesMovimentosModel.updateAny(
      1,
      {
        outputModule: module,
        outputModuleId: moduleId,
        outputBeepDate: new Date().toISOString(),
        outputUserId: userId
      },
      {
        serialNumber,
        isNull: 'outputBeepDate'
      },
      connection
    )
  }

  async findOpenSerieByProduct(code){
      const products = await ProdLojaSeriesMovimentosModel.findAny(1, {
        productId: code,
        isNull: 'outputBeepDate'
      })

      if (products.length === 0) {
        return []  
      }

      return products.map(product => product.serialNumber)
  }
}

module.exports = new SerieService()