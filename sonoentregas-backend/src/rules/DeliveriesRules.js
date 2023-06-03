//@ts-check
/**
 * @typedef {Object} ISaleProd
 * @property {number} ID_SALE_ID
 * @property {string} COD_ORIGINAL
 * @property {number} QUANTIDADE
 * @property {number} QTD_MOUNTING
 * @property {number} qtdDelivery
 * 
 * @typedef {Object} ISale
 * @property {number} ID
 * @property {number} ID_SALES
 * @property {number} CODLOJA
 * @property {string} whoReceived 
 * @property {boolean} isWithdrawal
 * @property {ISaleProd[]} products
 */
const { QueryTypes } = require('sequelize')
const Sales = require('../models/Sales')
const SalesProd = require('../models/SalesProd')

class DeliveriesRules {
  /**
   * @param {number} idSale
   */
  constructor(idSale){
    this.idSale = idSale
  }

  async find() {
    /**@type {ISale[]} */
    const sale = await Sales.findAny(0, { ID: this.idSale })

    if (sale.length === 0) {
      throw {
        status: 400,
        error: {
          message: 'Sales not found!'
        }
      }
    }

    const script = `SELECT COD_ORIGINAL, QUANTIDADE qtdDelivery, STATUS FROM SALES_PROD WHERE ID_SALE_ID = ${this.idSale}`

    /** @type {ISaleProd[]} */
    const products = await SalesProd._query(0, script, QueryTypes.SELECT)

    if (products.length === 0) {
      throw {
        status: 400,
        error: {
          message: 'Error: this sale does not contain products!'
        }
      }
    }

    sale[0].products = products

    this.sale = sale[0]
    this.checkStatusSaleIsWithdrawal()
  }

  async checkStatusSaleIsWithdrawal(){
    if (this.sale === undefined) {
      throw {
        status: 400,
        error: {
          message: 'Sale does not read!'
        }
      }
    }

    if (!this.sale.isWithdrawal) {
      throw {
        status: 400,
        error: {
          message: 'Not allowed to finalize sale with withdrawal!'
        }
      }
    }
  }
}

module.exports = DeliveriesRules