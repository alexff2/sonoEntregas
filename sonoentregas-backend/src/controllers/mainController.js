// @ts-check

/**
 * @typedef {Object} Params
 * @property {number} idMainAtt
 */

const Sales = require('../models/Sales')
const Maintenance = require('../models/tables/Maintenance')
const ViewDeliveryProdMaint = require('../models/views/ViewDeliveryProdMaint')
const ViewMaintenance = require('../models/views/ViewMaintenance')
const ViewCatDef = require('../models/views/ViewCatDefect')

const MainService = require('../services/MainService')

const { getDate, setDaysInDate } = require('../functions/getDate')

module.exports = {
  /**
   * @param {*} req 
   * @param {*} res 
   * @returns 
   */
  async index(req, res) {
    try {
      var { codloja } = req.params

      const maint = await MainService.getViewMaint(codloja)

      return res.json(maint)
    } catch (error) {
      console.log(error)
      return res.status(400).json(error)
    }
  },
  /**
   * @param {*} req 
   * @param {*} res 
   * @returns 
   */
  async findMain(req, res) {
    try {
      const params = req.params

      params.codloja = params.codloja !== 'null' ? params.codloja : 0

      const maint = await MainService.findMain(params)

      return res.json(maint)
    } catch (error) {
      console.log(error)
      return res.status(400).json(error)
    }
  },
  /**
   * @param {*} req 
   * @param {*} res 
   * @returns 
   */
  async create(req, res) {
    try {
      var { ID_DELIVERY, CODLOJA, ID_SALES, COD_ORIGINAL, WARRANTY, DEFECT, OUTHER_DEF, OBS, QUANTIDADE, ID_USER } = req.body
  
      const D_ENVIO = getDate()
      const D_PREV = setDaysInDate(D_ENVIO, 17) //Objetivo do sistema
      WARRANTY = WARRANTY ? 1 : 0

      const values = { ID_DELIVERY, CODLOJA, ID_SALE: ID_SALES, COD_ORIGINAL, QUANTIDADE, STATUS: 'Aguardando', WARRANTY, ID_CAT_DEF: DEFECT, OBS, D_ENVIO, D_PREV, ID_USER, OUTHER_DEF }

      OUTHER_DEF === 'NULL' && delete values.OUTHER_DEF
  
      await Maintenance.creatorAny(0, [values])
  
      const maint = await ViewMaintenance.findSome(0, `STATUS <> 'Finalizada'`)
      return res.json(maint)
    } catch (error) {
      console.log(error)
      return res.json(error)
    }
  },
  /**
   * @param {*} req 
   * @param {*} res 
   * @returns 
   */
  async delete(req, res) {
    const { id } = req.params
    try {
      const main = await Maintenance.findSome(0, `ID = ${id}`, 'ID, STATUS')
  
      if (main[0].STATUS === 'Aguardando') {
        await Maintenance.deleteNotReturn(0, id)
  
        return res.json({ sucess: 'Venda retornada com sucesso!'}) 
      } else {
        return res.status(400).json({ sucess: 'Venda com status diferente de Aguardando!'}) 
      }
    } catch (error) {
      console.log(error)
      return res.status(400).json(error) 
    }
  },
  /**
   * @param {*} req 
   * @param {*} res 
   * @returns 
   */
  async searchSaleToMaint(req, res) {
    try {
      const { idSale, codloja } = req.params

      const sale = await Sales.findSome(0, ` STATUS = 'Fechada' AND ID_SALES = ${idSale} AND CODLOJA = ${codloja}`, 'ID_SALES, NOMECLI, ID_CLIENT, Convert(varchar(10), EMISSAO, 103) EMISSAO, TOTAL_PROD')

      const products = await ViewDeliveryProdMaint.findSome(0, `ID_SALES = ${idSale} AND CODLOJA = ${codloja} AND DELIVERED = 0`)

      if (products.length === 0) return res.json([])

      sale[0]["products"] = products
      sale[0]["catDef"] = await ViewCatDef.findAll(0)

      return res.json(sale)
    } catch (error) {
      console.log(error)
      return res.status(400).json(error)
    }
  }
}