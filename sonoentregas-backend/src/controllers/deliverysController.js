// @ts-check
const Deliverys = require('../models/Deliverys')
const ViewDeliverys = require('../models/ViewDeliverys')
const DeliveryProd = require('../models/DeliveryProd')
const Sales = require('../models/Sales')
const SalesProd = require('../models/SalesProd')

const DeliveryService = require('../services/DeliveryService')
const MainService = require('../services/MainService')

const { getDate } = require('../functions/getDate')

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
      const { description, ID_CAR, ID_DRIVER, ID_ASSISTANT, D_PREVISION, salesProd, STATUS } = req.body

      const deliveryCreateId = await Deliverys.creatorAny(0, [{
        description,
        ID_CAR,
        ID_DRIVER,
        ID_ASSISTANT,
        STATUS,
        ID_USER_MOUNT: user_id,
        D_PREVISION
      }])

      const dataDelivery = await ViewDeliverys.findSome(0, `ID = ${deliveryCreateId}`)

      const dataTime = getDate()

      for(let i = 0; i < salesProd.length; i++) {
        var { ID_SALES, CODLOJA, COD_ORIGINAL, QUANTIDADE, QTD_DELIV, qtdDeliv } = salesProd[i]

        var valueProd = `${dataDelivery[0].ID}, ${ID_SALES}, ${CODLOJA}, ${qtdDeliv}, '${COD_ORIGINAL}', '${dataTime}', NULL, NULL`

        await DeliveryProd.creatorNotReturn(0, valueProd, true)

        if ((qtdDeliv + QTD_DELIV) === QUANTIDADE) {
          await SalesProd._query(0, `UPDATE SALES_PROD SET STATUS = '${STATUS}' WHERE ID_SALES = ${ID_SALES} AND COD_ORIGINAL = '${COD_ORIGINAL}' AND CODLOJA = ${CODLOJA}`)
        }

        const prod = await SalesProd.findSome(0, `ID_SALES = ${ID_SALES} and STATUS = 'Enviado' AND CODLOJA = ${CODLOJA}`)

        if (prod.length === 0) {
          await Sales._query(0, `UPDATE SALES SET STATUS = 'Fechada' WHERE ID_SALES = ${ID_SALES} AND CODLOJA = ${CODLOJA}`)
        }
      }
      
      const dataDeliverys = await DeliveryService.findSalesOfDelivery([dataDelivery[0]])

      if (ID_CAR === 0) {
        await DeliveryService.createSaleOfPrevision(dataDeliverys[0].sales)
      }

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
  async update( req, res ) {
    try {
      const { id } = req.params
      const { description, ID_CAR, ID_DRIVER, ID_ASSISTANT, D_PREVISION, salesProd } = req.body

      await Deliverys.updateAny(0, {
        description,
        ID_CAR,
        ID_DRIVER,
        ID_ASSISTANT,
        D_PREVISION
      }, id)

      const dataDelivery = await ViewDeliverys.findSome(0, `ID = ${id}`)

      //Buscando todas as vendas de deliveryProd para abri-las e deleta-las de deliveryProd
      const productsDelivery = await DeliveryProd.findSome(0, `ID_DELIVERY = ${id}`)

      for (let i = 0; i < productsDelivery.length; i++) {
        await SalesProd._query(0, `UPDATE SALES_PROD SET STATUS = 'Enviado' WHERE ID_SALES = ${productsDelivery[i].ID_SALE} AND COD_ORIGINAL = '${productsDelivery[i].COD_ORIGINAL}' AND CODLOJA = ${productsDelivery[i].CODLOJA}`)

        await Sales._query(0, `UPDATE SALES SET STATUS = 'Aberta' WHERE ID_SALES = ${productsDelivery[i].ID_SALE} AND CODLOJA = ${productsDelivery[i].CODLOJA}`)
      }

      await DeliveryProd.deleteNotReturn(0, id, 'ID_DELIVERY')

      //Inserindo novas vendas em deliveryProd e fechando as vendas
      const dataTime = getDate()

      for (let i = 0; i < salesProd.length; i++) {
        let { ID_SALES, CODLOJA, COD_ORIGINAL, QUANTIDADE, QTD_DELIV, QTD_MOUNTING, qtdDeliv: newQtdDelivery, checked } = salesProd[i]
       
        let valueProd = `${dataDelivery[0].ID}, ${ID_SALES}, ${CODLOJA}, ${newQtdDelivery}, '${COD_ORIGINAL}', '${dataTime}', NULL, NULL, 0`

        await DeliveryProd.creatorNotReturn(0, valueProd, true)

        if (checked){
          if (((QTD_MOUNTING - QTD_DELIV) + newQtdDelivery) === QUANTIDADE) {
            await SalesProd._query(0, `UPDATE SALES_PROD SET STATUS = 'Em lançamento' WHERE ID_SALES = ${ID_SALES} AND COD_ORIGINAL = '${COD_ORIGINAL}' AND CODLOJA = ${CODLOJA}`)
          }
        } else {
          if ((QUANTIDADE - QTD_DELIV) === newQtdDelivery) {
            await SalesProd._query(0, `UPDATE SALES_PROD SET STATUS = 'Em lançamento' WHERE ID_SALES = ${ID_SALES} AND COD_ORIGINAL = '${COD_ORIGINAL}' AND CODLOJA = ${CODLOJA}`)
          }
        }

        const prod = await SalesProd.findSome(0, `CODLOJA = ${CODLOJA} AND ID_SALES = ${ID_SALES} and STATUS = 'Enviado'`)

        if (prod.length === 0) {
          await Sales._query(0, `UPDATE SALES SET STATUS = 'Fechada' WHERE ID_SALES = ${ID_SALES} AND CODLOJA = ${CODLOJA}`)
        }
      }

      const dataDeliverys = await DeliveryService.findSalesOfDelivery([dataDelivery[0]])

      return res.json(dataDeliverys[0])
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
  },
  /**
   * @param {*} req 
   * @param {*} res 
   */
  async updateSalePrevision(req, res) {
    const { id } = req.params
    return res.send(id)
  }
}