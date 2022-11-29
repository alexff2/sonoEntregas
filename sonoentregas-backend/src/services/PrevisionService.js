//@ts-check

/**
 * @typedef {Object} Product
 * @property {number} ID_SALE_ID
 * @property {string} COD_ORIGINAL
 * 
 * @typedef {Object} Sale
 * @property {number} ID
 * @property {Product[]} product
 * 
 * @typedef {Object} PropsPrevision
 * @property {number} id
 * @property {string} date
 * @property {string} status
 * 
 * @typedef {Object} PropsPrevisionSales
 * @property {number} id
 * @property {number} idPrevision
 * @property {number} idSale
 * 
 * @typedef {Object} PropsCreatePrevision
 * @property {string} datePrevision
 * @property {string} userId
 * @property {Sale[]} sales
 * 
 * @typedef {Object} PropsValidation
 * @property {number} id
 * @property {string} validationStatus
 * @property {string} contact
 * @property {string} userId
 */

const Prevision = require('../models/tables/Prevision')
const PrevisionSales = require('../models/tables/Prevision/PrevisionSales')
const PrevisionProduct = require('../models/tables/Prevision/PrevisionProduct')
const Sale = require('../models/Sales')
const PrevisionsRules = require('../rules/PrevisionsRules')

const { setDaysInDate } = require('../functions/getDate')
const { concatIdToWhereIn } = require('../functions/concatIdToWhereIn')

module.exports = {
  /**
   * @param {PropsCreatePrevision} param0 
   */
  async createPrevision({ datePrevision, userId, sales }) {
    //Business Rules tab Previsions
    const currentDate = new Date().setHours(0,0,0,0)

    const datePrevisionTimezone = new Date(datePrevision).setHours(0,0,0,0)

    if (datePrevisionTimezone <= currentDate) {
      throw {
        status: 400,
        error: {
          message: 'Data da previsão deve ser maior que a data atual!'
        }
      }
    }

    //Business Rules Tab Prevision_sales
    const idSalesPrevision = concatIdToWhereIn(sales)

    const salesClosed = await Sale.findSome(0, `STATUS = 'Fechada' AND ID IN (${idSalesPrevision})`)

    if (salesClosed.length > 0) {
      throw {
        status: 400,
        error: {
          message: 'Vendas com STATUS fechada',
          salesClosed
        },
      }
    }

    //Business Rules Tab Prevision_product
    sales = await PrevisionsRules.checkStatusProduct(sales, idSalesPrevision)
    
    const datePrevisionSqlType = setDaysInDate(datePrevision, 0)

    await Prevision.creatorAny(0, [{
      date: datePrevisionSqlType,
      idUserCreated: userId
    }], true)

    /**@type {PropsPrevision[]} */
    const idPrevision = await Prevision.findAny(0, { date: datePrevisionSqlType }, 'id')

    const previsionSales = sales.map(sale => ({
      idPrevision: idPrevision[0].id,
      idSale: sale.ID
    }))

    await PrevisionSales.creatorAny(0, previsionSales, true)

    /**@type {PropsPrevisionSales[]} */
    const previsionSalesCreated = await PrevisionSales.findAny(0, { idPrevision: idPrevision[0].id })

    let previsionProduct = []

    previsionSalesCreated.forEach( salesCreated => {
      sales.forEach(sale => {
        if(sale.ID === salesCreated.idSale){
          sale.product.forEach( saleProd => previsionProduct.push({
            idPrevisionSale: salesCreated.id,
            COD_ORIGINAL: saleProd.COD_ORIGINAL
          }))
        }
      })
    })

    await PrevisionProduct.creatorAny(0, previsionProduct, true)
  },
  /**
   * 
   * @param {PropsValidation} props 
   */
  async validationSale(props){
    /*
    Rules: 
    
     */
  }
}