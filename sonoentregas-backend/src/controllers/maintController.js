// @ts-check

/**
 * @typedef {Object} Params
 * @property {number} idMainAtt
 */

const Maintenance = require('../models/tables/Maintenance')
const ViewMaintenance = require('../models/views/ViewMaintenance')

const MainService = require('../services/MainService')

const ObjDate = require('../functions/getDate')
const errCatch = require('../functions/error')

module.exports = {
  /**
   * @param {*} req 
   * @param {*} res 
   * @returns 
   */
  async index(req, res) {
    try {
      var { codloja } = req.params

      const maint = await MainService.getViewMaint(codloja, 'Shop', null)

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

      const maint = await MainService.findMain(params, false,  null)

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
      var { ID_DELIVERY, CODLOJA, ID_SALES, COD_ORIGINAL, WARRANTY, DEFECT, OTHER_DEF, OBS, MANUFACTURING_DATE, QTD_DELIV, ID_USER } = req.body

      if (!MANUFACTURING_DATE || MANUFACTURING_DATE === '') {
        throw new Error('manufacturing date unknown!')
      }
  
      const D_ENVIO = ObjDate.getDate()
      const D_PREV = ObjDate.setDaysInDate(D_ENVIO, 17) //Objetivo do sistema
      WARRANTY = WARRANTY ? 1 : 0

      const values = { ID_DELIVERY, CODLOJA, ID_SALE: ID_SALES, COD_ORIGINAL, QUANTIDADE: QTD_DELIV, STATUS: 'Aguardando', WARRANTY, ID_CAT_DEF: DEFECT, OBS, D_ENVIO, D_PREV, ID_USER, OTHER_DEF, MANUFACTURING_DATE }

      OTHER_DEF === 'NULL' && delete values.OTHER_DEF
  
      await Maintenance.creatorAny(0, [values])
  
      const maint = await ViewMaintenance.findSome(0, `STATUS <> 'Finalizada'`)
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
  async saleToMaintenance(req, res) {
    try {
      const { saleId, storeId } = req.query
      if(!saleId) throw new Error('saleId is required')
      if(!storeId) throw new Error('storeId is required')

      const sale = await MainService.findSaleToMaintenance({saleId, storeId})
      return res.json(sale)
    } catch (error) {
      errCatch(error, res)
    }
  }
}