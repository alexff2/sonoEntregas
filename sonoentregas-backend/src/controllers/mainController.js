// @ts-check

/**
 * @typedef {Object} Params
 * @property {number} idMainAtt
 */

const Sales = require('../models/Sales')
const Maintenance = require('../models/Maintenance')
const MainAttempt = require('../models/MaintenanceAttempt')
const ViewDeliveryProdMain = require('../models/ViewDeliveryProdMain')
const ViewMaintenance = require('../models/ViewMaintenance')
const ViewMainAttempt = require('../models/ViewMainAttempt')

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
      const { codloja } = req.params

      const where = codloja !== 'null' ? `AND CODLOJA = ${codloja}` : ''

      const main = await ViewMaintenance.findSome(0, `STATUS <> 'Finalizada' ${where}`)

      return res.json(main)
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

      const main = await MainService.findMain(params)

      return res.json(main)
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
      const { ID_DELIVERY, CODLOJA, ID_SALES, COD_ORIGINAL, OBS, QUANTIDADE } = req.body
  
      const D_ENVIO = getDate()
      const D_PREV = setDaysInDate(D_ENVIO, 10) //Objetivo do sistema
  
      await Maintenance.creator(0, `${ID_DELIVERY}, ${CODLOJA}, ${ID_SALES}, '${COD_ORIGINAL}', ${QUANTIDADE}, 'Enviado', '${OBS}', '${D_ENVIO}', '${D_PREV}'`)
  
      const main = await ViewMaintenance.findSome(0, `CODLOJA = ${CODLOJA} AND STATUS <> 'Finalizada'`)
  
      return res.json(main)
    } catch (error) {
      console.log(error)
      return res.json(error)
    }
  },
  async delete(req, res) {
    const { id } = req.params
    try {
      const main = await Maintenance.findSome(0, `ID = ${id}`, 'ID, STATUS')
  
      if (main[0].STATUS === 'Enviado') {
        await Maintenance.deleteNotReturn(0, id)
  
        return res.json({ sucess: 'Venda retornada com sucesso!'}) 
      } else {
        return res.status(400).json({ sucess: 'Venda com status diferente de enviado!'}) 
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
  async searchSaleToMain(req, res) {
    try {
      const { idSale, codloja } = req.params

      const sale = await Sales.findSome(0, ` STATUS = 'Fechada' AND ID_SALES = ${idSale} AND CODLOJA = ${codloja}`, 'ID_SALES, NOMECLI, ID_CLIENT, Convert(varchar(10), EMISSAO, 103) EMISSAO, TOTAL_PROD')

      const products = await ViewDeliveryProdMain.findSome(0, `ID_SALES = ${idSale} AND CODLOJA = ${codloja} AND DELIVERED = 0`)

      if (products.length === 0) return res.json([])

      sale[0]["products"] = products

      return res.json(sale)
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
  async findMainAttempt(req, res) {
    const { idMain } = req.params

    try {
      const mainAttempt = await ViewMainAttempt.findSome(0, `ID_MAIN = ${idMain}`)

      return res.json(mainAttempt)
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
  async createMainAtt(req, res) {
    try {
      var { ID, changeProd, idDriver, idAssist, idDelivMain } = req.body

      const D_MOUNTING = getDate()

      changeProd =  changeProd ? 1 : 0
      idDelivMain =  idDelivMain === 0 ? 'NULL' : idDelivMain

      await MainAttempt.creatorNotReturn(0, `${ID}, ${changeProd}, '${D_MOUNTING}', NULL, NULL, 1, NULL, ${idDriver}, ${idAssist}, ${idDelivMain}`)

      await Maintenance.update(0,`STATUS = 'Em lançamento'`, ID)

      const main = await ViewMaintenance.findSome(0, `STATUS <> 'Finalizada'`)

      return res.json(main)
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
  async updateMainAtt(req, res) {
    /** @type {Params} */
    const { idMainAtt } = req.params
    const main = req.body

    try {
      if (main.STATUS === 'Em lançamento') await MainService.moveToMain(idMainAtt, main)
      else if (main.STATUS === 'Em deslocamento') {
        if (!main.returnMain) {
          await MainService.finishToMainNotReturn(idMainAtt, main)
        } else {
          await MainService.finishToMainReturn(idMainAtt, main)
        }
      }

      const mains = await ViewMaintenance.findSome(0, `STATUS <> 'Finalizada'`)
      return res.json(mains)
    } catch (error) {
     console.log(error)
     res.status(401).json(error)
    }
  }
}