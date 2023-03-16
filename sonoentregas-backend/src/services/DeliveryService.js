//@ts-check
const { QueryTypes } = require('sequelize')
const Delivery = require('../models/Deliverys')
const DeliveryProd = require('../models/DeliveryProd')
const SalesProd = require('../models/SalesProd')
const ViewDeliverySales = require('../models/ViewDeliverySales')
const ViewDeliveryProd2 = require('../models/ViewDeliveryProd2')
const MainService = require('../services/MainService')
const Empresas = require('../models/Empresas')
const ObjDate = require('../functions/getDate')

module.exports = {
  async findSalesOfDelivery(deliveries){
    try {
      if (deliveries.length > 0) {
        var idDelivery = ''

        for (let i = 0; i < deliveries.length; i++){
          if ( i === 0 ){
            idDelivery+= deliveries[i].ID
          } else {
            idDelivery+= `, ${deliveries[i].ID}`
          }
        }

        const sales = await ViewDeliverySales.findSome(0, `ID_DELIVERY IN (${idDelivery})`)

        const vDeliveryProd2 = await ViewDeliveryProd2.findSome(0, `ID_DELIVERY IN (${idDelivery})`)

        const shops = await Empresas._query(0, 'SELECT * FROM LOJAS', QueryTypes.SELECT)

        deliveries.forEach(delivery => {
          delivery['sales'] = []

          sales.forEach(sale => {

            sale["products"] = []

            vDeliveryProd2.forEach(saleProd => {
              if (sale.ID_SALES === saleProd.ID_SALES && sale.CODLOJA === saleProd.CODLOJA && saleProd.ID_DELIVERY === sale.ID_DELIVERY) {
                sale.products.push(saleProd)
              }
            })

            if (sale.ID_DELIVERY === delivery.ID) {
              delivery.sales.push(sale)
            }

            shops.forEach( shops => {
              if (shops.CODLOJA === sale.CODLOJA) {
                sale['SHOP'] = shops.DESC_ABREV
              }
            })
          })
        })

        return deliveries
      } else {
        return []
      }
    } catch (error) {
      console.log(error)
    }
  },
  async finishDelivery({ delivery, id, user_id, maintenances }){
    if (delivery.STATUS === 'Entregando') {
      await Delivery.updateAny(0, {
        STATUS: delivery.STATUS,
        ID_USER_DELIVERING: user_id
      }, { id })

      for(let i = 0; i < maintenances.length; i++) {
        maintenances[i]["date"] = delivery.DATE
        await MainService.moveToMaint(maintenances[i].ID_MAINT_DELIV, maintenances[i])
      }
    } else if (delivery.STATUS === 'Finalizada') {
      await Delivery.updateAny(0, {
        STATUS: delivery.STATUS,
        ID_USER_DELIVERED: user_id
      }, { id })
    }
  },
  async updateDeliveryProd(delivery, id){
    for (let i = 0; i < delivery.sales.length; i++) {
      for (let j = 0; j < delivery.sales[i].products.length; j++) {

        let qtd = delivery.sales[i].products[j].QTD_DELIV
        let cod = delivery.sales[i].products[j].COD_ORIGINAL
        let reason = delivery.sales[i].products[j].REASON_RETURN
        let status = delivery.sales[i].products[j].STATUS
        let upSt = delivery.sales[i].products[j].UPST === undefined 
          ? true 
          : delivery.sales[i].products[j].UPST
        let DELIVERED = delivery.sales[i].products[j].DELIVERED
        let codLoja = delivery.sales[i].CODLOJA
        let idSales = delivery.sales[i].ID_SALES

        upSt && await Delivery._query(0, `UPDATE SALES_PROD SET STATUS = '${status}' WHERE ID_SALES = ${idSales} AND CODLOJA = ${codLoja} AND COD_ORIGINAL = '${cod}'`)

        if (status === 'Entregando') {

          await Delivery._query(0, `UPDATE DELIVERYS_PROD SET D_DELIVERING = '${delivery.DATE}' WHERE ID_DELIVERY = ${id} AND ID_SALE = ${idSales} AND CODLOJA = ${codLoja} AND COD_ORIGINAL = '${cod}'`)

          await Delivery._query(1,`UPDATE PRODLOJAS SET EST_ATUAL = EST_ATUAL - ${qtd}, EST_LOJA = EST_LOJA - ${qtd} FROM PRODLOJAS A INNER JOIN PRODUTOS B ON A.CODIGO = B.CODIGO WHERE A.CODLOJA = 1 AND B.ALTERNATI = '${cod}'`)

        } else if (status === 'Finalizada') {            

          await Delivery._query(0, `UPDATE DELIVERYS_PROD SET D_DELIVERED = '${delivery.dateDelivery}' WHERE ID_DELIVERY = ${id} AND ID_SALE = ${idSales} AND CODLOJA = ${codLoja} AND COD_ORIGINAL = '${cod}'`)

        } else if (DELIVERED) {

          await Delivery._query(0, `UPDATE DELIVERYS_PROD SET DELIVERED = 1, D_DELIVERED = '${delivery.dateDelivery}', REASON_RETURN = '${reason}' WHERE ID_DELIVERY = ${id} AND ID_SALE = ${idSales} AND CODLOJA = ${codLoja} AND COD_ORIGINAL = '${cod}'`)

          await Delivery._query(0, `UPDATE SALES_PROD SET STATUS = 'Enviado' WHERE ID_SALES = ${idSales} AND CODLOJA = ${codLoja} AND COD_ORIGINAL = '${cod}'`)

          await Delivery._query(1,`UPDATE PRODLOJAS SET EST_ATUAL = EST_ATUAL + ${qtd}, EST_LOJA = EST_LOJA + ${qtd} FROM PRODLOJAS A INNER JOIN PRODUTOS B ON A.CODIGO = B.CODIGO WHERE A.CODLOJA = 1 AND B.ALTERNATI = '${cod}'`)
          
          await Delivery._query(0, `UPDATE SALES SET STATUS = 'Aberta' WHERE ID_SALES = ${idSales} AND CODLOJA = ${codLoja}`)
        }
      }
    }
  },
  async addSale({ salesProd, idDelivery }){
    const dataTime = ObjDate.getDate()

    for(let i = 0; i < salesProd.length; i++) {
      var { ID_SALES, CODLOJA, COD_ORIGINAL, quantityForecast } = salesProd[i]

      var valueProd = `${idDelivery}, ${ID_SALES}, ${CODLOJA}, ${quantityForecast}, '${COD_ORIGINAL}', '${dataTime}', NULL, NULL, 0`

      await DeliveryProd.creatorNotReturn(0, valueProd, true)

      await SalesProd.updateAny(0, { STATUS: 'Em lançamento' }, {
        CODLOJA,
        ID_SALES,
        COD_ORIGINAL
      })
    }
  },
  async rmvSale({ salesProd }){
    const script = `DELETE DELIVERYS_PROD WHERE ID_DELIVERY = ${salesProd[0].ID_DELIVERY} AND ID_SALE = ${salesProd[0].ID_SALES} AND CODLOJA = ${salesProd[0].CODLOJA}`

    await DeliveryProd._query(0, script, QueryTypes.SELECT)

    for(let i = 0; i < salesProd.length; i++) {
      var { ID_SALES, CODLOJA, COD_ORIGINAL } = salesProd[i]

      await SalesProd.updateAny(0, { STATUS: 'Em Previsão' }, {
        CODLOJA,
        ID_SALES,
        COD_ORIGINAL
      })
    }
  }
}