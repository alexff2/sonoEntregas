// @ts-check

/**
 * @typedef {Object} ISaleProd
 * @property {number} ID_SALES
 * @property {number} CODLOJA
 */

const Deliveries = require('../models/Deliverys')

const DeliveryService = require('../services/DeliveryService')
const MainService = require('../services/MainService')
const ForecastsRules = require('../rules/forecastRules')
const DeliveriesRules = require('../rules/DeliveriesRules')

module.exports = {
  /**
   * @param {*} req 
   * @param {*} res 
   */
  async updateHeader( req, res ) {
    try {
      const { id } = req.params
      const { id: user_id } = req.user
      const { description, D_MOUNTING, ID_CAR, ID_DRIVER, ID_ASSISTANT } = req.body

      await Deliveries.updateAny(0, {
        description,
        D_MOUNTING,
        ID_CAR,
        ID_DRIVER,
        ID_ASSISTANT
      }, { id })

      return res.json({ message: `Update by${user_id}` })
    } catch (e) {
      console.log(e)

      return res.status(400).json(e)
    }
  },
  /**
   * @param {*} req 
   * @param {*} res 
   */
  async updateStatus( req, res ){
    const { id } = req.params
    const delivery = req.body
    const { id: user_id } = req.user

    const sce = await Deliveries._query(1)
    const entrega = await Deliveries._query(0)

    try {
      const maintenances = await MainService.findMain({
        codloja: 0,
        typeSeach: 'ID_DELIV_MAINT',
        search: id
      }, false, entrega)

      await DeliveryService.updateDeliveryProd(delivery, id, { entrega, sce })

      await DeliveryService.updateDelivery({
        delivery,
        id,
        user_id,
        maintenances
      }, { entrega, sce })

      await sce.transaction.commit()
      await entrega.transaction.commit()

      return res.json(delivery)
    } catch (e) {
      console.log(e)
      await sce.transaction.rollback()
      await entrega.transaction.rollback()
      res.status(400).json(e)
    }
  },
  /**
   * @param {*} req 
   * @param {*} res 
   */
  async delivering(req, res){},
  /**
   * @param {*} req 
   * @param {*} res 
   */
  async finish(req, res){},
  /**
   * @param {*} req 
   * @param {*} res 
   */
  async withdrawalSale(req, res) {
    try {
      const { id: user_id } = req.user
      const { idSale, date, whoWithdrew } = req.body
      console.log(req.body)

      if (!date || !whoWithdrew) {
        throw {
          status: 401,
          error: 'date not exist!'
        }
      }

      const SaleRules = new DeliveriesRules(idSale)
      await SaleRules.find()

      if (SaleRules.sale === undefined) {
        throw {
          status: 400,
          error: {
            message: 'Sale does not read!'
          }
        }
      }

      await ForecastsRules.checkStatusProduct([SaleRules.sale])

      await ForecastsRules.checkAvailableStock([SaleRules.sale])

      await DeliveryService.saleAndProductsWithdrawal( SaleRules.sale, date, user_id, whoWithdrew)

      return res.json({ message: `Update by${user_id}` })
    } catch (e) {
      console.log(e)

      let status = e.status ? e.status : 400
      let error = e.error ? e.error : e

      return res.status(status).json(error)
    }
  }
}