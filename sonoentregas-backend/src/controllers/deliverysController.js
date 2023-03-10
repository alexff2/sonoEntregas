// @ts-check

/**
 * @typedef {Object} ISaleProd
 * @property {number} ID_SALES
 * @property {number} CODLOJA
 */

const Deliverys = require('../models/Deliverys')
const ViewDeliverys = require('../models/ViewDeliverys')
const DeliveryProd = require('../models/DeliveryProd')
const Sales = require('../models/Sales')
const SalesProd = require('../models/SalesProd')

const DeliveryService = require('../services/DeliveryService')
const MainService = require('../services/MainService')

const ObjDate = require('../functions/getDate')

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

      const dataTime = ObjDate.getDate()

      for(let i = 0; i < salesProd.length; i++) {
        var { ID_SALES, CODLOJA, COD_ORIGINAL, QUANTIDADE, QTD_DELIV, qtdDelivery } = salesProd[i]

        var valueProd = `${dataDelivery[0].ID}, ${ID_SALES}, ${CODLOJA}, ${qtdDelivery}, '${COD_ORIGINAL}', '${dataTime}', NULL, NULL`

        await DeliveryProd.creatorNotReturn(0, valueProd, true)

        if ((qtdDelivery + QTD_DELIV) === QUANTIDADE) {
          await SalesProd._query(0, `UPDATE SALES_PROD SET STATUS = 'Em lançamento' WHERE ID_SALES = ${ID_SALES} AND COD_ORIGINAL = '${COD_ORIGINAL}' AND CODLOJA = ${CODLOJA}`)
        }

        const prod = await SalesProd.findSome(0, `ID_SALES = ${ID_SALES} and STATUS = 'Enviado' AND CODLOJA = ${CODLOJA}`)

        if (prod.length === 0) {
          await Sales._query(0, `UPDATE SALES SET STATUS = 'Fechada' WHERE ID_SALES = ${ID_SALES} AND CODLOJA = ${CODLOJA}`)
        }
      }
      
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
  async updateHeader( req, res ) {
    try {
      const { id } = req.params
      const { id: user_id } = req.user
      const { description, ID_CAR, ID_DRIVER, ID_ASSISTANT } = req.body

      await Deliverys.updateAny(0, {
        description,
        ID_CAR,
        ID_DRIVER,
        ID_ASSISTANT
      }, id)

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
        await Deliverys._query(0, `UPDATE SALES SET STATUS = 'Aberta' WHERE ID_SALES = ${deliveryProd[i].ID_SALE} AND CODLOJA = ${deliveryProd[i].CODLOJA}`)
        
        await SalesProd._query(0, `UPDATE SALES_PROD SET STATUS = 'Enviado' WHERE ID_SALES = ${deliveryProd[i].ID_SALE} AND CODLOJA = ${deliveryProd[i].CODLOJA} AND COD_ORIGINAL = '${deliveryProd[i].COD_ORIGINAL}'`)
      }
      
      await Deliverys.deleteNotReturn(0, id)
      
      await DeliveryProd.deleteNotReturn(0, id, 'ID_DELIVERY')

      res.json({delete: true})
    } catch (error) {
      res.status(400).json(error)
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

    try {
      const maintenances = await MainService.findMain({
        codloja: 0,
        typeSeach: 'ID_DELIV_MAINT',
        search: id
      })

      await DeliveryService.updateDeliveryProd(delivery, id)

      await DeliveryService.finishDelivery({
        delivery,
        id,
        user_id,
        maintenances
      })

      return res.json(delivery)
    } catch (e) {
      console.log(e)
      res.status(400).json(e)
    }
  }
}