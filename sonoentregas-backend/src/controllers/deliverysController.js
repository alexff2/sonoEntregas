const Deliverys = require('../models/Deliverys')
const ViewDeliverys = require('../models/ViewDeliverys')
const DeliveryProd = require('../models/DeliveryProd')
const Sales = require('../models/Sales')
const SalesProd = require('../models/SalesProd')
const Produtos = require('../models/Produtos')

const DevService = require('../services/DevService')

const { getDate } = require('../functions/getDate')

module.exports = {
  async index( req, res ){
    try {
      const { status, date } = req.params
      var where
      status === 'close' ? where = `STATUS = 'Finalizada' AND D_DELIVERED = '${date}'` : where = "STATUS <> 'Finalizada'"

      const deliverys = await ViewDeliverys.findSome(0, where)
      
      const dataDeliverys = await DevService.findDev(deliverys, status)

      return res.json(dataDeliverys)
    } catch (error) {
      res.status(400).json(error)
    }
  },
  async create( req, res ){
    try {
      const { description, codCar, codDriver, codAssistant, salesProd, status } = req.body

      const valuesDelivery = `'${description}', ${codCar}, ${codDriver}, ${codAssistant}, '${status}'`

      const dataTime = getDate()
      
      const delivCreate = await Deliverys.creator(0, valuesDelivery)
      
      const dataDelivery = await ViewDeliverys.findSome(0, `ID = ${delivCreate.ID}`)

      await salesProd.forEach( async produto => {
        var { ID_SALES, CODLOJA, COD_ORIGINAL, QUANTIDADE, QTD_DELIV, qtdDeliv } = produto

        var qtd = qtdDeliv === 0 ? (QUANTIDADE - QTD_DELIV) : qtdDeliv
        
        var valueProd = `${dataDelivery[0].ID}, ${ID_SALES}, ${CODLOJA}, ${qtd}, '${COD_ORIGINAL}', '${dataTime}', NULL, NULL, 0`
        
        await DeliveryProd.creatorNotReturn(0, valueProd, true)

        if ((QUANTIDADE - QTD_DELIV) == qtdDeliv || qtdDeliv === 0) {
          await SalesProd._query(0, `UPDATE SALES_PROD SET STATUS = '${status}' WHERE ID_SALES = ${ID_SALES} AND COD_ORIGINAL = '${COD_ORIGINAL}' AND CODLOJA = ${CODLOJA}`)
        }
        
        produto.STATUS = 'Em lançamento'

        const prod = await SalesProd.findSome(0, `ID_SALES = ${ID_SALES} and STATUS = 'Enviado'`)

        if (prod.length === 0) {
          await Sales._query(0, `UPDATE SALES SET STATUS = 'Fechada' WHERE ID_SALES = ${ID_SALES} AND CODLOJA = ${CODLOJA}`)
        }
      })
      
      const dataDeliverys = await DevService.findDev([dataDelivery[0]])
      
      return res.json(dataDeliverys[0])
    } catch (error) {
      res.status(400).json(error)
    }
  },
  async update( req, res ) {
    try {
      const { id } = req.params
      const { description, codCar, codDriver, codAssistant, salesProd } = req.body

      const script = `DESCRIPTION = '${description}', ID_CAR = ${codCar}, ID_DRIVER = ${codDriver}, ID_ASSISTANT = ${codAssistant}`
      
      const delivery = await Deliverys.update(0, script, id)
      const dataDelivery = await ViewDeliverys.findSome(0, `ID = ${delivery.ID}`)

      const delivUpdateStatus = await DeliveryProd.findSome(0, `ID_DELIVERY = ${delivery.ID}`)

      delivUpdateStatus.forEach(async deliv => {
        await SalesProd._query(0, `UPDATE SALES_PROD SET STATUS = 'Enviado' WHERE ID_SALES = ${deliv.ID_SALE} AND COD_ORIGINAL = '${deliv.COD_ORIGINAL}' AND CODLOJA = ${deliv.CODLOJA}`)
        
        await Sales._query(0, `UPDATE SALES SET STATUS = 'Aberta' WHERE ID_SALES = ${deliv.ID_SALE} AND CODLOJA = ${deliv.CODLOJA}`)
      })

      await DeliveryProd.deleteNotReturn(0, delivery.ID, 'ID_DELIVERY')
      
      const dataTime = getDate()

      await salesProd.forEach( async produto => {
        var { ID_SALES, CODLOJA, COD_ORIGINAL, QUANTIDADE, QTD_DELIV, qtdDeliv } = produto

        var qtd = qtdDeliv === 0 ? (QUANTIDADE - QTD_DELIV) : qtdDeliv
        
        var valueProd = `${dataDelivery[0].ID}, ${ID_SALES}, ${CODLOJA}, ${qtd}, '${COD_ORIGINAL}', '${dataTime}', NULL, NULL, 0`
        
        await DeliveryProd.creatorNotReturn(0, valueProd, true)

        //if ((QUANTIDADE - QTD_DELIV) == qtdDeliv || qtdDeliv === 0) {//Ajustar quantidade entrega
          await SalesProd._query(0, `UPDATE SALES_PROD SET STATUS = 'Em lançamento' WHERE ID_SALES = ${ID_SALES} AND COD_ORIGINAL = '${COD_ORIGINAL}' AND CODLOJA = ${CODLOJA}`)
        //}

        produto.STATUS = 'Em lançamento'

        const prod = await SalesProd.findSome(0, `ID_SALES = ${ID_SALES} and STATUS = 'Enviado'`)

        if (prod.length === 0) {
          await Sales._query(0, `UPDATE SALES SET STATUS = 'Fechada' WHERE ID_SALES = ${ID_SALES} AND CODLOJA = ${CODLOJA}`)
        }
      })

      const dataDeliverys = await DevService.findDev([dataDelivery[0]])
      res.json(dataDeliverys[0])
    } catch (e) {
      res.status(400).json(e)
    }
  },
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
  async updateSatus( req, res ){
    const { id } = req.params
    const delivery = req.body

    try {

      for (let i = 0; i < delivery.sales.length; i++) {
        for (let j = 0; j < delivery.sales[i].products.length; j++) {
          
          var qtd = delivery.sales[i].products[j].QUANTIDADE
          var cod = delivery.sales[i].products[j].COD_ORIGINAL
          var reason = delivery.sales[i].products[j].REASON_RETURN
          var status = delivery.sales[i].products[j].STATUS
          var codLoja = delivery.sales[i].CODLOJA
          var idSales = delivery.sales[i].ID_SALES

          await Deliverys._query(0, `UPDATE SALES_PROD SET STATUS = '${status}' WHERE ID_SALES = ${idSales} AND CODLOJA = ${codLoja} AND COD_ORIGINAL = '${cod}'`)

          if (status === 'Entregando') {

            await Deliverys._query(0, `UPDATE DELIVERYS_PROD SET D_DELIVERING = '${delivery.DATE}' WHERE ID_DELIVERY = ${id} AND ID_SALE = ${idSales} AND CODLOJA = ${codLoja} AND COD_ORIGINAL = '${cod}'`)

            await Produtos._query(1,`UPDATE PRODLOJAS SET EST_ATUAL = EST_ATUAL - ${qtd}, EST_LOJA = EST_LOJA - ${qtd} FROM PRODLOJAS A INNER JOIN PRODUTOS B ON A.CODIGO = B.CODIGO WHERE A.CODLOJA = 1 AND B.ALTERNATI = '${cod}'`)
            
          } else if (status === 'Finalizada') {
            
            await Deliverys._query(0, `UPDATE DELIVERYS_PROD SET D_DELIVERED = '${delivery.dateDelivery}' WHERE ID_DELIVERY = ${id} AND ID_SALE = ${idSales} AND CODLOJA = ${codLoja} AND COD_ORIGINAL = '${cod}'`)
            
          } else if (status === 'Enviado') {
            
            await Deliverys._query(0, `UPDATE DELIVERYS_PROD SET DELIVERED = 1, D_DELIVERED = '${delivery.dateDelivery}', REASON_RETURN = '${reason}' WHERE ID_DELIVERY = ${id} AND ID_SALE = ${idSales} AND CODLOJA = ${codLoja} AND COD_ORIGINAL = '${cod}'`)

            await Produtos._query(1,`UPDATE PRODLOJAS SET EST_ATUAL = EST_ATUAL + ${qtd}, EST_LOJA = EST_LOJA + ${qtd} FROM PRODLOJAS A INNER JOIN PRODUTOS B ON A.CODIGO = B.CODIGO WHERE A.CODLOJA = 1 AND B.ALTERNATI = '${cod}'`)
            
            await Sales.updateNotReturn(0, `STATUS = 'Aberta'`, idSales, 'ID_SALES')
          }
        }
      }

      await Deliverys.updateNotReturn(0, `STATUS = '${delivery.STATUS}'`, id)

      res.json(delivery)
    } catch (e) {
      console.log(e)
      res.status(400).json(e)
    }
  }
}