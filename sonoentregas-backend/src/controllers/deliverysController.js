// @ts-check

/**
 * @typedef {Object} ISaleProd
 * @property {number} ID_SALES
 * @property {number} CODLOJA
 */

const Deliverys = require('../models/Deliverys')
const ViewDeliverys = require('../models/ViewDeliverys')
const DeliveryProd = require('../models/DeliveryProd')
const SalesProd = require('../models/SalesProd')

const DeliveryService = require('../services/DeliveryService')

module.exports = {
  /**
   * @param {*} req 
   * @param {*} res 
   * @returns 
   */
  async index( req, res ){
    try {
      const { status, date } = req.params

      var where
      where = status === 'close' 
        ? `STATUS = 'Finalizada' AND D_DELIVERED = '${date}'` 
        : "STATUS <> 'Finalizada'"

      const deliverys = await ViewDeliverys.findSome(0, where)
      
      const dataDeliverys = await DeliveryService.findSalesOfDelivery(deliverys)

      return res.json(dataDeliverys)
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
  async create( req, res ){
    try {
      const { id: user_id } = req.user
      const { description, ID_CAR, ID_DRIVER, ID_ASSISTANT, salesProd } = req.body

      const deliveryCreateId = await Deliverys.creatorAny(0, [{
        description,
        ID_CAR,
        ID_DRIVER,
        ID_ASSISTANT,
        STATUS: 'Em lançamento',
        ID_USER_MOUNT: user_id,
      }])

      const dataDelivery = await ViewDeliverys.findSome(0, `ID = ${deliveryCreateId}`)

      await DeliveryService.addSale({ salesProd, idDelivery: dataDelivery[0].ID })

      const dataDeliverys = await DeliveryService.findSalesOfDelivery([dataDelivery[0]])

      return res.json(dataDeliverys[0])
    } catch (error) {
      console.log(error)
      res.status(400).json(error)
    }
  },
  /**
   * @param {*} req 
   * @param {*} res 
   */
  async addSale( req, res ) {
    try {
      const { id } = req.params
      const { id: user_id } = req.user
      const { salesProd } = req.body

      await DeliveryService.addSale({ salesProd, idDelivery: id })

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
  async rmvSale( req, res ) {
    try {
      const { id: user_id } = req.user
      const { salesProd } = req.body

      await DeliveryService.rmvSale({ salesProd })

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
  async delete( req, res ) {
    try {
      const { id } = req.params
      
      const deliveryProd = await DeliveryProd.findSome(0, `ID_DELIVERY = ${id}`)
      
      for (let i = 0; i < deliveryProd.length; i++) {        
        await SalesProd._query(0, `UPDATE SALES_PROD SET STATUS = 'Em Previsão' WHERE ID_SALES = ${deliveryProd[i].ID_SALE} AND CODLOJA = ${deliveryProd[i].CODLOJA} AND COD_ORIGINAL = '${deliveryProd[i].COD_ORIGINAL}'`)
      }

      await Deliverys.deleteNotReturn(0, id)

      await DeliveryProd.deleteNotReturn(0, id, 'ID_DELIVERY')

      res.json({delete: true})
    } catch (error) {
      res.status(400).json(error)
    }
  }
}