// @ts-check

/**
 * @typedef {Object} ISaleProd
 * @property {number} ID_SALES
 * @property {number} CODLOJA
 */
const Deliveries = require('../models/Deliverys')
const ViewDeliveries = require('../models/ViewDeliverys')
const DeliveryProd = require('../models/DeliveryProd')
const SalesProd = require('../models/SalesProd')

const Date = require('../class/Date')
const DeliveriesService = require('../services/DeliveryService')
const ForecastService = require('../services/ForecastService')
const errorCath = require('../functions/error')
const { validateFields } = require('../functions/validateFields')

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

      const deliveries = await ViewDeliveries.findSome(0, where)

      deliveries.forEach((delivery) => {
        delivery.D_MOUNTING = new Date(delivery.D_MOUNTING+'T00:00:00')
          .getBRDateTime()
          .date
      })

      return res.json(deliveries)
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
  async findDeliveryByShop( req, res ){
    try {
      const { idShop } = req.params
      
      const deliveries =  await DeliveriesService.findDeliveriesByShop(idShop)

      return res.json(deliveries)
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
  async findDelivery( req, res ){
    try {
      const { id } = req.params
      
      const delivery =  await DeliveriesService.findDelivery(id)

      return res.json(delivery)
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
      const { DESCRIPTION, ID_CAR, ID_DRIVER, ID_ASSISTANT, ID_ASSISTANT2, D_MOUNTING } = req.body

      if (!validateFields([DESCRIPTION, ID_CAR, ID_DRIVER, ID_ASSISTANT, D_MOUNTING])) {
        console.log('Preencha todos os campos obrigatórios')
        return res.status(400).json({ message: 'Preencha todos os campos obrigatórios' })
      }

      const dataCreate = {
        DESCRIPTION,
        ID_CAR,
        ID_DRIVER,
        ID_ASSISTANT,
        STATUS: 'Em lançamento',
        ID_USER_MOUNT: user_id,
        dateCreated: new Date().getISODateTimeBr().dateTime,
        D_MOUNTING,
      }

      const deliveryCreateId = await Deliveries.creatorAny(0, [
        ID_ASSISTANT2 === 0 ? dataCreate : { ...dataCreate, ID_ASSISTANT2 },
      ])

      const delivery =  await DeliveriesService.findDelivery(deliveryCreateId)

      return res.json({ delivery })
    } catch (error) {
      console.log(error)
      return res.status(400).json(error)
    }
  },
  /**
   * @param {*} req 
   * @param {*} res 
   */
  async addSale( req, res ) {
    const connectionEntrega = await Deliveries._query(0)

    try {
      const { id } = req.params
      const { id: user_id } = req.user
      const { sale } = req.body

      await DeliveriesService.addSale({ sale, userId: user_id, idDelivery: id, connectionEntrega })

      await connectionEntrega.transaction.commit()
      return res.json({ message: `Update by${user_id}` })
    } catch (e) {
      console.log(e)
      await connectionEntrega.transaction.rollback()
      return res.status(400).json(e)
    }
  },
  /**
   * @param {*} req 
   * @param {*} res 
   */
  async rmvSale( req, res ) {
    const connectionEntrega = await Deliveries._query(0)

    try {
      const { id: user_id } = req.user
      const { salesProd } = req.body

      await DeliveriesService.rmvSale({ salesProd }, connectionEntrega)

      await ForecastService.setIdDeliveryNullInForecastSales(
        { idDelivery: salesProd[0].ID_DELIVERY, idSale: salesProd[0].ID_SALE_ID },
        connectionEntrega
      )

      await connectionEntrega.transaction.commit()
      return res.json({ message: `Update by${user_id}` })
    } catch (e) {
      await connectionEntrega.transaction.rollback()
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

      await ForecastService.setIdDeliveryNullInAllForecastSales({ idDelivery: id })
      
      for (let i = 0; i < deliveryProd.length; i++) {        
        await SalesProd._query(0, `UPDATE SALES_PROD SET STATUS = 'Em Previsão' WHERE ID_SALES = ${deliveryProd[i].ID_SALE} AND CODLOJA = ${deliveryProd[i].CODLOJA} AND COD_ORIGINAL = '${deliveryProd[i].COD_ORIGINAL}'`)
      }

      await Deliveries.deleteNotReturn(0, id)

      await DeliveryProd.deleteNotReturn(0, id, 'ID_DELIVERY')

      res.json({delete: true})
    } catch (error) {
      res.status(400).json(error)
    }
  },
  /**
   * @param {*} request
   * @param {*} response
   */
  async findToBeep(request, response) {
    try {
      const {id} = request.query
      const delivery = await DeliveriesService.findUnique(id)

      const status = delivery.DESCRIPTION === 'Retiradas' ? 'Em lançamento' : delivery.STATUS

      const deliveryProducts = await DeliveriesService.findToBeep(
        id,
        status
      )

      return response.json({deliveryProducts, status})
    } catch (error) {
      errorCath(error, response)
    }
  },
}