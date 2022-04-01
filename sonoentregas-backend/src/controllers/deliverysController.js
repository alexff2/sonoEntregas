// @ts-check
const Deliverys = require('../models/Deliverys')
const ViewDeliverys = require('../models/ViewDeliverys')
const DeliveryProd = require('../models/DeliveryProd')
const Sales = require('../models/Sales')
const SalesProd = require('../models/SalesProd')
const Produtos = require('../models/Produtos')

const DevService = require('../services/DevService')
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
      status === 'close' ? where = `STATUS = 'Finalizada' AND D_DELIVERED = '${date}'` : where = "STATUS <> 'Finalizada'"

      const deliverys = await ViewDeliverys.findSome(0, where)
      
      const dataDeliverys = await DevService.findSalesDev(deliverys)

      return res.json(dataDeliverys)
    } catch (error) {
      res.status(400).json(error)
    }
  },
  /**
   * @param {*} req 
   * @param {*} res 
   * @returns 
   */
  async create( req, res ){
    try {
      const { description, codCar, codDriver, codAssistant, salesProd, status } = req.body

      const valuesDelivery = `'${description}', ${codCar}, ${codDriver}, ${codAssistant}, '${status}'`

      const delivCreate = await Deliverys.creator(0, valuesDelivery)

      const dataDelivery = await ViewDeliverys.findSome(0, `ID = ${delivCreate.ID}`)

      const dataTime = getDate()

      for(let i = 0; i < salesProd.length; i++) {
        var { ID_SALES, CODLOJA, COD_ORIGINAL, QUANTIDADE, QTD_DELIV, qtdDeliv } = salesProd[i]

        var qtd = qtdDeliv === 0 ? (QUANTIDADE - QTD_DELIV) : parseInt(qtdDeliv)

        var valueProd = `${dataDelivery[0].ID}, ${ID_SALES}, ${CODLOJA}, ${qtd}, '${COD_ORIGINAL}', '${dataTime}', NULL, NULL, 0`

        await DeliveryProd.creatorNotReturn(0, valueProd, true)

        if ((QUANTIDADE - QTD_DELIV) === qtdDeliv || qtdDeliv === 0) {
          await SalesProd._query(0, `UPDATE SALES_PROD SET STATUS = '${status}' WHERE ID_SALES = ${ID_SALES} AND COD_ORIGINAL = '${COD_ORIGINAL}' AND CODLOJA = ${CODLOJA}`)
        }

        const prod = await SalesProd.findSome(0, `ID_SALES = ${ID_SALES} and STATUS = 'Enviado' AND CODLOJA = ${CODLOJA}`)

        if (prod.length === 0) {
          await Sales._query(0, `UPDATE SALES SET STATUS = 'Fechada' WHERE ID_SALES = ${ID_SALES} AND CODLOJA = ${CODLOJA}`)
        }
      }

      const dataDeliverys = await DevService.findSalesDev([dataDelivery[0]])

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
      const { description, codCar, codDriver, codAssistant, salesProd } = req.body

      const script = `DESCRIPTION = '${description}', ID_CAR = ${codCar}, ID_DRIVER = ${codDriver}, ID_ASSISTANT = ${codAssistant}`
      
      const delivery = await Deliverys.update(0, script, id)
      const dataDelivery = await ViewDeliverys.findSome(0, `ID = ${delivery.ID}`)

      //Buscando todas as vendas de delivProd para abri-las e deleta-las de delivProd
      const delivProdUpdateStatus = await DeliveryProd.findSome(0, `ID_DELIVERY = ${delivery.ID}`)

      for (let i = 0; i < delivProdUpdateStatus.length; i++) {
        await SalesProd._query(0, `UPDATE SALES_PROD SET STATUS = 'Enviado' WHERE ID_SALES = ${delivProdUpdateStatus[i].ID_SALE} AND COD_ORIGINAL = '${delivProdUpdateStatus[i].COD_ORIGINAL}' AND CODLOJA = ${delivProdUpdateStatus[i].CODLOJA}`)

        await Sales._query(0, `UPDATE SALES SET STATUS = 'Aberta' WHERE ID_SALES = ${delivProdUpdateStatus[i].ID_SALE} AND CODLOJA = ${delivProdUpdateStatus[i].CODLOJA}`)
      }

      await DeliveryProd.deleteNotReturn(0, delivery.ID, 'ID_DELIVERY')

      //Inserindo novas vendas em delivProd e fechando as vendas
      const dataTime = getDate()

      for (let i = 0; i < salesProd.length; i++) {
        var { ID_SALES, CODLOJA, COD_ORIGINAL, QUANTIDADE, QTD_DELIV, QTD_MOUNTING, qtdDeliv, checked } = salesProd[i]
        
        //var qtd = (qtdDeliv === 0 && checked) ? QTD_DELIV : qtdDeliv
        var qtd
        if (qtdDeliv === 0 && checked) qtd = QTD_DELIV
        else if (qtdDeliv === 0 && !checked) qtd = (QUANTIDADE - QTD_DELIV)
        else qtd = qtdDeliv
        
        var valueProd = `${dataDelivery[0].ID}, ${ID_SALES}, ${CODLOJA}, ${qtd}, '${COD_ORIGINAL}', '${dataTime}', NULL, NULL, 0`
        
        await DeliveryProd.creatorNotReturn(0, valueProd, true)
        
        if (checked){
          if (((QTD_MOUNTING - QTD_DELIV) + qtd) === QUANTIDADE) {
            await SalesProd._query(0, `UPDATE SALES_PROD SET STATUS = 'Em lançamento' WHERE ID_SALES = ${ID_SALES} AND COD_ORIGINAL = '${COD_ORIGINAL}' AND CODLOJA = ${CODLOJA}`)
          }
        } else {
          if ((QUANTIDADE - QTD_DELIV) === qtdDeliv || qtdDeliv === 0) {
            await SalesProd._query(0, `UPDATE SALES_PROD SET STATUS = 'Em lançamento' WHERE ID_SALES = ${ID_SALES} AND COD_ORIGINAL = '${COD_ORIGINAL}' AND CODLOJA = ${CODLOJA}`)
          }
        }
        
        const prod = await SalesProd.findSome(0, `CODLOJA = ${CODLOJA} AND ID_SALES = ${ID_SALES} and STATUS = 'Enviado'`)
        
        if (prod.length === 0) {
          await Sales._query(0, `UPDATE SALES SET STATUS = 'Fechada' WHERE ID_SALES = ${ID_SALES} AND CODLOJA = ${CODLOJA}`)
        }
        console.log('ALTERANDO NOVAMENTE PRODUTO VENDA ---------------------------------')
      }

      const dataDeliverys = await DevService.findSalesDev([dataDelivery[0]])
      res.json(dataDeliverys[0])
    } catch (e) {
      console.log(e)
      res.status(400).json(e)
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
  async updateSatus( req, res ){
    const { id } = req.params
    const delivery = req.body

    try {
      const maintenances = await MainService.findMain({
        codloja: 0,
        typeSeach: 'ID_DELIV_MAIN',
        search: delivery.ID
      })

      if (delivery.STATUS === 'Entregando') {
        for(let i = 0; i < maintenances.length; i++) {
          maintenances[i]["date"] = delivery.DATE
          await MainService.moveToMain(maintenances[i].ID_MAIN_ATTEMP, maintenances[i])
        }
      }

      for (let i = 0; i < delivery.sales.length; i++) {
        for (let j = 0; j < delivery.sales[i].products.length; j++) {

          var qtd = delivery.sales[i].products[j].QTD_DELIV
          var cod = delivery.sales[i].products[j].COD_ORIGINAL
          var reason = delivery.sales[i].products[j].REASON_RETURN
          var status = delivery.sales[i].products[j].STATUS
          var upSt = delivery.sales[i].products[j].UPST === undefined 
            ? true 
            : delivery.sales[i].products[j].UPST
          var DELIVERED = delivery.sales[i].products[j].DELIVERED
          var codLoja = delivery.sales[i].CODLOJA
          var idSales = delivery.sales[i].ID_SALES

          upSt && await Deliverys._query(0, `UPDATE SALES_PROD SET STATUS = '${status}' WHERE ID_SALES = ${idSales} AND CODLOJA = ${codLoja} AND COD_ORIGINAL = '${cod}'`)

          if (status === 'Entregando') {

            await Deliverys._query(0, `UPDATE DELIVERYS_PROD SET D_DELIVERING = '${delivery.DATE}' WHERE ID_DELIVERY = ${id} AND ID_SALE = ${idSales} AND CODLOJA = ${codLoja} AND COD_ORIGINAL = '${cod}'`)

            await Produtos._query(1,`UPDATE PRODLOJAS SET EST_ATUAL = EST_ATUAL - ${qtd}, EST_LOJA = EST_LOJA - ${qtd} FROM PRODLOJAS A INNER JOIN PRODUTOS B ON A.CODIGO = B.CODIGO WHERE A.CODLOJA = 1 AND B.ALTERNATI = '${cod}'`)
            
          } else if (status === 'Finalizada') {
            
            await Deliverys._query(0, `UPDATE DELIVERYS_PROD SET D_DELIVERED = '${delivery.dateDelivery}' WHERE ID_DELIVERY = ${id} AND ID_SALE = ${idSales} AND CODLOJA = ${codLoja} AND COD_ORIGINAL = '${cod}'`)
            
          } else if (DELIVERED) {
            await Deliverys._query(0, `UPDATE DELIVERYS_PROD SET DELIVERED = 1, D_DELIVERED = '${delivery.dateDelivery}', REASON_RETURN = '${reason}' WHERE ID_DELIVERY = ${id} AND ID_SALE = ${idSales} AND CODLOJA = ${codLoja} AND COD_ORIGINAL = '${cod}'`)

            await Deliverys._query(0, `UPDATE SALES_PROD SET STATUS = 'Enviado' WHERE ID_SALES = ${idSales} AND CODLOJA = ${codLoja} AND COD_ORIGINAL = '${cod}'`)

            await Produtos._query(1,`UPDATE PRODLOJAS SET EST_ATUAL = EST_ATUAL + ${qtd}, EST_LOJA = EST_LOJA + ${qtd} FROM PRODLOJAS A INNER JOIN PRODUTOS B ON A.CODIGO = B.CODIGO WHERE A.CODLOJA = 1 AND B.ALTERNATI = '${cod}'`)
            
            await Sales._query(0, `UPDATE SALES SET STATUS = 'Aberta' WHERE ID_SALES = ${idSales} AND CODLOJA = ${codLoja}`)
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