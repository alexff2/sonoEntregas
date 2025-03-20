//@ts-check
const { findByIdDateName } = require('../scripts/returnsSce')
const Model = require('../databases/MSSQL/Model')
const { QueryTypes } = require('sequelize')

/**
 * @typedef {Object} InputFind
 * @property {string} typeSearch
 * @property {string | Object} search
 * @property {number} shopId
 */

module.exports = {
  /**
   * @param {InputFind} param0 
   */
  async find({ typeSearch, search, shopId}){
    const ModelDefault = new Model('', '')

    const scriptReturn = findByIdDateName({
      originalSaleId: typeSearch === 'returnShopId' ? search : '',
      name: typeSearch === 'client' ? search : '',
      dateStart: typeSearch === 'dateStart' ? search.dateStart : '',
      dateFinish: typeSearch === 'dateFinish' ? search.dateFinish : '',
    })

    const returnShop = ModelDefault._query(shopId, scriptReturn, QueryTypes.SELECT)

    return returnShop
  }
}