// @ts-check

/**
 * @typedef {Object} ISaleProd
 * @property {number} ID_SALES
 * @property {number} CODLOJA
 */

const Deliveries = require('../models/Deliverys')

const DeliveryService = require('../services/DeliveryService')
const ForecastsRules = require('../rules/forecastRules')
const DeliveriesRules = require('../rules/DeliveriesRules')

module.exports = {
  /**
   * @param {*} req 
   * @param {*} res 
   */
  async updateHeader( req, res ) {
    try {
      const {id} = req.params
      const {id: user_id} = req.user
      const {description, D_MOUNTING, ID_CAR, ID_DRIVER, ID_ASSISTANT, ID_ASSISTANT2} = req.body

      const dataCreate = {
        description,
        D_MOUNTING,
        ID_CAR,
        ID_DRIVER,
        ID_ASSISTANT,
        ID_ASSISTANT2: ID_ASSISTANT2 === 0 ? 'NULL' : ID_ASSISTANT2
      }

      await Deliveries.updateAny(0, dataCreate, {id})

      return res.json({message: `Update by${user_id}`})
    } catch (e) {
      console.log(e)

      return res.status(400).json(e)
    }
  },
  /**
   * @param {*} req 
   * @param {*} res 
   */
  async delivering(req, res){
    const {id} = req.params
    const {date} = req.body
    const {id: userId} = req.user
    const sce = await Deliveries._query(1)
    const entrega = await Deliveries._query(0)

    try {
      await DeliveryService.delivering({
        id,
        date,
        userId,
        connections: {sce, entrega}
      })

      await sce.transaction.commit()
      await entrega.transaction.commit()
      return res.json({ message: `Delivery updated by ${userId}` })
    } catch (e) {
     try {
        await sce.transaction.rollback()
        await entrega.transaction.rollback()
      } catch (rollbackError) {
        console.error('Rollback failed:', rollbackError)
      }
      console.error('Error during delivery:', e)
      return res.status(400).json({
        error: e.message || 'An error occurred during delivery.'
      })
    }
  },
  /**
   * @param {*} req 
   * @param {*} res 
   */
  async returns(req, res){
    const {id} = req.params
    const {product} = req.body
    const connectionEntrega = await Deliveries._query(0)

    try {
      await DeliveryService.returns({
        id,
        connectionEntrega,
        product
      })

      await connectionEntrega.transaction.commit()
      return res.json({message: 'Done'})
    } catch (e) {
      try {
        await connectionEntrega.transaction.rollback()
      } catch (rollbackError) {
        console.error('Rollback failed:', rollbackError)
      }
      console.error('Error during returns delivery:', e)
      return res.status(400).json({
        error: e.message || 'An error occurred while returns the delivery.'
      })
    } 
  },
  async returnsDelete(req, res){
    const {id} = req.params
    const {product} = req.body
    const connectionEntrega = await Deliveries._query(0)

    try {
      await DeliveryService.returnsDelete({
        id,
        connectionEntrega,
        product
      })

      await connectionEntrega.transaction.commit()
      return res.json({message: 'Done'})
    } catch (e) {
      try {
        await connectionEntrega.transaction.rollback()
      } catch (rollbackError) {
        console.error('Rollback failed:', rollbackError)
      }
      console.error('Error during delivery returns delete:', e)
      return res.status(400).json({
        error: e.message || 'An error occurred while returns delete the delivery.'
      })
    } 
  },
  /**
   * @param {*} req 
   * @param {*} res 
   */
  async finish(req, res){
    const {id} = req.params
    const {id: userId} = req.user
    const {date} = req.body
    const sce = await Deliveries._query(1)
    const entrega = await Deliveries._query(0)

    try {
      await DeliveryService.finish({
        id,
        userId,
        date,
        connections: {sce, entrega}
      })

      await sce.transaction.commit()
      await entrega.transaction.commit()
      return res.json({ message: `Delivery finished by ${userId}` })
    } catch (e) {
      try {
        await sce.transaction.rollback()
        await entrega.transaction.rollback()
      } catch (rollbackError) {
        console.error('Rollback failed:', rollbackError)
      }
      console.error('Error during delivery finish:', e)
      return res.status(400).json({
        error: e.message || 'An error occurred while finishing the delivery.'
      })
    }
  },
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

      await ForecastsRules.checkStatusProduct(SaleRules.sale)

      await ForecastsRules.checkAvailableStock(SaleRules.sale)

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