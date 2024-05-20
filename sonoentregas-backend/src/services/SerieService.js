//@ts-check
/**
 * @typedef {Object} InputCreate
 * @property {number} serialNumber
 * @property {number} productId
 * @property {string} module
 * 
 * @typedef {Object} IProdLojaSeries
 * @property {number} id
 * @property {number} serialNumber
 * @property {number} productId
 * @property {string} dateEntered
 * @property {string} moduleEntered
 */

const { QueryTypes } = require('sequelize')
const ProdLojaSeriesModel = require('../models/tables/ProdLojaSeries')

class SerieService {
  /**@param {InputCreate} props */
  async create({productId, serialNumber, module}) {
    /**@type {IProdLojaSeries} */
    const prodLojasSeries = {
      id: serialNumber,
      productId: productId,
      dateEntered: new Date().toISOString(),
      moduleEntered: module,
      serialNumber
    }

    await ProdLojaSeriesModel.create(1, [prodLojasSeries], false)

    return prodLojasSeries
  }

  async findOpenSerieByProduct(code){
    const script = 
      `SELECT id FROM PRODLOJAS_SERIES
      WHERE productId = ${code}
      AND dateIsOut IS NULL`

      const products = await ProdLojaSeriesModel._query(1, script, QueryTypes.SELECT)

      if (products.length === 0) {
        return []  
      }

      return products.map(product => product.id)
  }
}

module.exports = new SerieService()