//@ts-check
/**
 * @typedef {Object} IProdLojaSeries
 * @property {number} id
 * @property {number} productId
 * @property {string} dateEntered
 * @property {string} moduleEntered
 */

const { QueryTypes } = require('sequelize')
const ProductModel = require('../models/Produtos')
const ProdLojaSeriesModel = require('../models/tables/ProdLojaSeries')
const DateTime = require('../class/Date')

module.exports = {
  barCode: async (request, response) => {
    try {
      const { barCode, code } = request.body

      const product = await ProductModel._query(1, `SELECT CBARRA FROM PRODUTOS WHERE CBARRA = '${barCode}'`, QueryTypes.SELECT)

      if (product.length > 0) {
        return response.status(200).json('barCode already')
      }

      await ProductModel._query(1, `UPDATE PRODUTOS SET CBARRA = '${barCode}' WHERE CODIGO = ${code}`)

      return response.status(200).json(barCode)
    } catch (error) {
      console.log(error)

      return response.status(400).json('Error')
    }
  },
  findSerialNumberValid: async (request, response) => {
    try {
      const { code } = request.query

      const script = 
      `SELECT id FROM PRODLOJAS_SERIES
      WHERE productId = ${code}
      AND dateIsOut IS NULL`

      const products = await ProductModel._query(1, script, QueryTypes.SELECT)

      if (products.length === 0) {
        return response.status(200).json(products)  
      }

      const serialNumbers = products.map(product => product.id)

      return response.status(200).json(serialNumbers)
    } catch (error) {
      console.log(error)

      return response.status(400).json('Error')
    }
  },
  serialCreate: async(request, response) => {
    try {
      const { serial, code } = request.body

      /**@type {IProdLojaSeries[]} */
      const isAlreadyBeep = await ProdLojaSeriesModel.findAny(1, {
        id: serial,
        productId: code,
      })

      if (isAlreadyBeep.length > 0) {
        return response.status(200).json('alreadyBeep')
      }

      /**@type {IProdLojaSeries} */
      const prodLojasSeries = {
        id: serial,
        productId: code,
        dateEntered: new DateTime().getISODateTimeBr().dateTimeIso,
        moduleEntered: 'INICIAL'
      }

      await ProdLojaSeriesModel.create(1, [prodLojasSeries], false)

      return response.status(200).json(serial)
    } catch (error) {
      console.log(error)

      return response.status(400).json('Error')
    }
  }
}