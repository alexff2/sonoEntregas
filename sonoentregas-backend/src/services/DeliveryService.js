//@ts-check

/**
* @typedef {Object} IProduct
* @property {number} ID_SALE_ID
* @property {string} COD_ORIGINAL
* @property {number} QUANTIDADE
* @property {number} QTD_MOUNTING
* @property {number} qtdDelivery
*
* @typedef {Object} IDeliveryProductsToBeep
* @property {number} id
* @property {string} mask
* @property {string} nameFull
* @property {number} quantity
* @property {number} quantityBeep
* @property {number} quantityPedding
* @property {number} subGroupId
* @property {number} moduleId
* 
* @typedef {Object} IValueDelivery
* @property {number} ID_DELIVERY
* @property {number} PRICE
* @property {number} COST
* 
* @typedef {Object} ISale
* @property {number} ID
* @property {number} ID_SALES
* @property {number} CODLOJA
* @property {string} whoReceived
* @property {boolean} isWithdrawal
* @property {IProduct[]} products
*/

const { QueryTypes } = require('sequelize')

const Delivery = require('../models/Deliverys')
const DeliveryProd = require('../models/DeliveryProd')
const SalesProd = require('../models/SalesProd')
const ViewDeliverySales = require('../models/ViewDeliverySales')
const ViewDeliveryProd2 = require('../models/ViewDeliveryProd2')
const Empresas = require('../models/ShopsSce')
const Sales = require('../models/Sales')

const scripts = require('../scripts/delivery')
const MainService = require('../services/MainService')
const Date = require('../class/Date')

module.exports = {
  async findUnique(/** @type {number} */id){
    const delivery = await Delivery.findAny(0, { id })

    if (delivery.length === 0) {
      throw {
        error: 'delivery not found'
      }
    }

    return delivery[0]
  },
  /**
   * @param {Object[]} deliveries
   */
  async findSalesOfDelivery(deliveries){
    try {
      if (deliveries.length > 0) {
        var idDeliveries = deliveries.map(delivery => delivery.ID)

        const sales = await ViewDeliverySales.findSome(0, `ID_DELIVERY IN (${idDeliveries})`)

        const vDeliveryProd2 = await ViewDeliveryProd2.findSome(0, `ID_DELIVERY IN (${idDeliveries})`)

        const shops = await Empresas._query(0, 'SELECT * FROM LOJAS', QueryTypes.SELECT)

        const scriptValuesByDelivery =`
        SELECT C.ID_DELIVERY, SUM(C.QTD_DELIV * B.PCO_COMPRA) COST, SUM(C.QTD_DELIV * D.UNITARIO1) PRICE FROM SONO..PRODUTOS A
        INNER JOIN ${process.env.CD_BASE}..PRODLOJAS B ON A.CODIGO = B.CODIGO
        INNER JOIN DELIVERYS_PROD C ON C.COD_ORIGINAL = A.ALTERNATI
        INNER JOIN SALES_PROD D ON C.ID_SALE = D.ID_SALES AND C.CODLOJA = D.CODLOJA AND C.COD_ORIGINAL = D.COD_ORIGINAL
        WHERE B.CODLOJA = 1
        AND C.ID_DELIVERY IN (${idDeliveries})
        GROUP BY C.ID_DELIVERY`

        /**@type {IValueDelivery[]} */
        const valuesByDelivery = await ViewDeliverySales._query(0, scriptValuesByDelivery, QueryTypes.SELECT)

        deliveries.forEach( delivery => {
          delivery['sales'] = []

          delivery.D_MOUNTING = new Date(delivery.D_MOUNTING+'T00:00:00').getBRDateTime().date
          delivery.D_DELIVERING = new Date(delivery.D_DELIVERING+'T00:00:00').getBRDateTime().date
          delivery.D_DELIVERED = new Date(delivery.D_DELIVERED+'T00:00:00').getBRDateTime().date

          const valuesDelivery = valuesByDelivery.find(value => value.ID_DELIVERY === delivery.ID)

          if (valuesDelivery) {
            delivery.COST = valuesDelivery.COST
            delivery.PRICE = valuesDelivery.PRICE
          }

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
  async updateDelivery({ delivery, id, user_id, maintenances }, conditions){
    const dateTimeNow = new Date().getISODateTimeBr().dateTime

    if (delivery.STATUS === 'Entregando') {
      await Delivery.updateAny(0, {
        STATUS: delivery.STATUS,
        ID_USER_DELIVERING: user_id,
        dateUpdateDelivering: dateTimeNow,
        D_DELIVERING: delivery.date
      }, { id }, conditions.entrega)

      for(let i = 0; i < maintenances.length; i++) {
        maintenances[i]["date"] = delivery.date

        await MainService.moveToMaint(maintenances[i].ID_MAINT_DELIV, maintenances[i], conditions)
      }
    } else if (delivery.STATUS === 'Finalizada') {
      await Delivery.updateAny(0, {
        STATUS: delivery.STATUS,
        ID_USER_DELIVERED: user_id,
        dateUpdateDelivered: dateTimeNow,
        D_DELIVERED: delivery.date
      }, { id }, conditions.entrega)
    }
  },
  /**
   * @param {{ sales: string | any[]; }} delivery
   * @param {number} id
   * @param {Object} conditions
   */
  async updateDeliveryProd(delivery, id, conditions){
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

        upSt && await Delivery._query(0, `UPDATE SALES_PROD SET STATUS = '${status}' WHERE ID_SALES = ${idSales} AND CODLOJA = ${codLoja} AND COD_ORIGINAL = '${cod}'`, QueryTypes.UPDATE, conditions.entrega)

        if (status === 'Entregando') {
          await Delivery._query(1,`UPDATE PRODLOJAS SET EST_ATUAL = EST_ATUAL - ${qtd}, EST_LOJA = EST_LOJA - ${qtd} FROM PRODLOJAS A INNER JOIN PRODUTOS B ON A.CODIGO = B.CODIGO WHERE A.CODLOJA = 1 AND B.ALTERNATI = '${cod}'`, QueryTypes.UPDATE, conditions.sce)

        } else if (DELIVERED) {

          await Delivery._query(0, `UPDATE DELIVERYS_PROD SET DELIVERED = 1, REASON_RETURN = '${reason}' WHERE ID_DELIVERY = ${id} AND ID_SALE = ${idSales} AND CODLOJA = ${codLoja} AND COD_ORIGINAL = '${cod}'`, QueryTypes.UPDATE, conditions.entrega)

          await Delivery._query(0, `UPDATE SALES_PROD SET STATUS = 'Enviado' WHERE ID_SALES = ${idSales} AND CODLOJA = ${codLoja} AND COD_ORIGINAL = '${cod}'`, QueryTypes.UPDATE, conditions.entrega)

          await Delivery._query(1,`UPDATE PRODLOJAS SET EST_ATUAL = EST_ATUAL + ${qtd}, EST_LOJA = EST_LOJA + ${qtd} FROM PRODLOJAS A INNER JOIN PRODUTOS B ON A.CODIGO = B.CODIGO WHERE A.CODLOJA = 1 AND B.ALTERNATI = '${cod}'`, QueryTypes.UPDATE, conditions.sce)
          
          await Delivery._query(0, `UPDATE SALES SET STATUS = 'Aberta' WHERE ID_SALES = ${idSales} AND CODLOJA = ${codLoja}`, QueryTypes.UPDATE, conditions.entrega)
        }
      }
    }
  },
  /**
   * @param {number} idDelivery
   */
  async updateStockByIdDelivery(idDelivery){ // No used
    const script = `UPDATE ${process.env.CD_BASE}..PRODLOJAS SET EST_ATUAL = EST_ATUAL - C.QTD, EST_LOJA = EST_LOJA - C.QTD
    FROM ${process.env.CD_BASE}..PRODLOJAS A INNER JOIN ${process.env.CD_BASE}..PRODUTOS B ON A.CODIGO = B.CODIGO 
    INNER JOIN (
      SELECT COD_ORIGINAL, SUM(QTD_DELIV) QTD
      FROM DELIVERYS_PROD 
      WHERE ID_DELIVERY = ${idDelivery}
      GROUP BY COD_ORIGINAL) C
    ON B.ALTERNATI = C.COD_ORIGINAL
    WHERE A.CODLOJA = 1`

    await SalesProd._query(0, script, QueryTypes.UPDATE)
  },
  async addSale({ salesProd, idDelivery }){
    for(let i = 0; i < salesProd.length; i++) {
      var { ID_SALES, CODLOJA, COD_ORIGINAL, quantityForecast } = salesProd[i]

      var valueProd = `${idDelivery}, ${ID_SALES}, ${CODLOJA}, ${quantityForecast}, '${COD_ORIGINAL}', 0`

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

    await DeliveryProd._query(0, script, QueryTypes.DELETE)

    for(let i = 0; i < salesProd.length; i++) {
      var { ID_SALES, CODLOJA, COD_ORIGINAL } = salesProd[i]

      await SalesProd.updateAny(0, { STATUS: 'Em Previsão' }, {
        CODLOJA,
        ID_SALES,
        COD_ORIGINAL
      })
    }
  },
  /**
   * @param {ISale} sale
   * @param {string} date
   * @param {number} user_id
   * @param {string} whoWithdrew
   */
  async saleAndProductsWithdrawal( sale, date, user_id, whoWithdrew ){
    const deliveryId = await Delivery.findAny(0, { D_MOUNTING: date, ID_DRIVER: 48 }, 'ID')

    if (deliveryId.length === 0) {
      var deliveryCreateId = await Delivery.creatorAny(0, [{
        description: 'Retiradas',
        ID_CAR: 0,
        ID_DRIVER: 48,
        ID_ASSISTANT: 49,
        STATUS: 'Finalizada',
        ID_USER_MOUNT: user_id,
        dateCreated: new Date().getISODateTimeBr().dateTime,
        D_MOUNTING: date,
        ID_USER_DELIVERING: user_id,
        dateUpdateDelivering: new Date().getISODateTimeBr().dateTime,
        D_DELIVERING: date,
        ID_USER_DELIVERED: user_id,
        dateUpdateDelivered: new Date().getISODateTimeBr().dateTime,
        D_DELIVERED: date,
      }])
    }

    const idDelivery = deliveryId.length > 0 ? deliveryId[0].ID : deliveryCreateId

    await Sales.updateAny(0, { STATUS: 'Fechada', whoWithdrew }, { ID: sale.ID})

    await SalesProd.updateAny(0, { STATUS: 'Finalizada' }, { ID_SALE_ID: sale.ID })

    let arraySaleProducts = []
    let scriptUpdateSaleProd = ''

    sale.products.filter( product => {
      arraySaleProducts = [...arraySaleProducts, {
        ID_DELIVERY: idDelivery,
        ID_SALE: sale.ID_SALES,
        CODLOJA: sale.CODLOJA,
        QTD_DELIV: product.qtdDelivery,
        COD_ORIGINAL: product.COD_ORIGINAL,
        DELIVERED: 0
      }]

      scriptUpdateSaleProd += `UPDATE PRODLOJAS SET EST_ATUAL = EST_ATUAL - ${product.qtdDelivery}, EST_LOJA = EST_LOJA - ${product.qtdDelivery} FROM PRODLOJAS A INNER JOIN PRODUTOS B ON A.CODIGO = B.CODIGO WHERE A.CODLOJA = 1 AND B.ALTERNATI = '${product.COD_ORIGINAL}' \n`
    })

    await DeliveryProd.creatorAny(0, arraySaleProducts, true)

    await DeliveryProd._query(1, scriptUpdateSaleProd)
  },
  /**
  *@param {number} id 
  *@param {string} status
  */
  async findToBeep(id, status) {
    const script = status === 'Finalizada'
      ? scripts.findToBeepDeliveryReturn(id)
      : scripts.findToBeepDelivery(id)
    /**@type {IDeliveryProductsToBeep[]} */
    const deliveryProduct = await DeliveryProd._query(1, script, QueryTypes.SELECT)

    if (deliveryProduct.length === 0) {
      throw {
        error: 'Delivery already beeped'
      }
    }

    const scriptGroup = `
    SELECT CODIGO id, NOME name
    FROM SUB_GRUPOS WHERE CODIGO IN (${deliveryProduct.map(product => product.subGroupId)})`

    /**@type {import('./ProductsService').IGroup[]} */
    const groups = await Delivery._query(1, scriptGroup, QueryTypes.SELECT)

    const products = groups.map(group => ({
      group: group.name,
      products: deliveryProduct.filter(product => group.id === product.subGroupId)
    }))

    return products
  },
  /**
   * @param {string} dateStart
   * @param {string} dateEnd
   */
  async deliveriesByAssistants(dateStart, dateEnd){
    const script = scripts.deliveriesByAssistants(dateStart, dateEnd)

    const deliveries = await Delivery._query(0, script, QueryTypes.SELECT)

    return deliveries
  },
  /**
   * @param {string} dateStart
   * @param {string} dateEnd
   */
  async deliveriesByDriver(dateStart, dateEnd){
    const script = scripts.deliveriesByDriver(dateStart, dateEnd)

    const deliveries = await Delivery._query(0, script, QueryTypes.SELECT)

    return deliveries
  },
  /**
   * @param {string} dateStart
   * @param {string} dateEnd
   */
  async deliveriesByStore(dateStart, dateEnd){
    const script = scripts.deliveriesByStore(dateStart, dateEnd)

    const deliveries = await Delivery._query(0, script, QueryTypes.SELECT)

    return deliveries
  }
}