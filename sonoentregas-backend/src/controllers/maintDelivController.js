// @ts-check

/**
 * @typedef {Object} Params
 * @property {number} id
 */

const Maintenance = require('../models/tables/Maintenance')
const ViewMaintDeliv = require('../models/views/ViewMaintDeliv')

const MainService = require('../services/MainService')

module.exports = {
  /**
   * @param {*} req 
   * @param {*} res 
   * @returns 
   */
  async findIfExistMaintenanceDeliveryOpenByDeliveryId(req, res) {
    const { id } = req.params
    try {
      const maintenanceDelivery = await MainService.findIfExistMaintenanceDeliveryOpenByDeliveryId(id)

      return res.json(maintenanceDelivery.length > 0)
    } catch (error) {
      console.log(error)
      return res.status(400).json(error)
    }
  },
  /**
   * @param {*} _req 
   * @param {*} res 
   * @returns 
   */
  async index(_req, res) {
    try {
      const maint = await MainService.getViewMaint('null', 'CD', null)

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
  async findMaintDeliv(req, res) {
    try {
      const params = req.params

      params.codloja = 0

      const maint = await MainService.findMain(params, true, null)

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
  async findMaintId(req, res) {
    const { idMain } = req.params

    try {
      const mainDeliv = await ViewMaintDeliv.findSome(0, `ID_MAINT = ${idMain} ORDER BY ID`)
      const maintVisit = await MainService.findMaintenanceVisit(idMain)

      return res.json({mainDeliv, maintVisit})
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
  async update(req, res) {
    /** @type {Params} */
    const { id } = req.params
    const maint = req.body

    const connectionSce = await Maintenance._query(1)
    const connectionEntrega = await Maintenance._query(0)

    try {
      if (maint.STATUS === 'Em lançamento') await MainService.moveToMaint(id, maint, {
       sce: connectionSce,
       entrega: connectionEntrega,
      })
      else if (maint.STATUS === 'Em deslocamento') {
        if (!maint.returnMaint) {
          await MainService.finishToMaintNotReturn(id, maint, connectionEntrega)
        } else {
          await MainService.finishToMaintReturn(id, maint, {
           sce: connectionSce,
           entrega: connectionEntrega,
          })
        }
      }

      const maintenanceResponse = await MainService.getViewMaint('null', 'CD', connectionEntrega)

      await connectionSce.transaction.commit()
      await connectionEntrega.transaction.commit()
      return res.json(maintenanceResponse)
     } catch (error) {
      await connectionSce.transaction.rollback()
      await connectionEntrega.transaction.rollback()
     console.log(error)
     res.status(401).json(error)
    }
  }
}