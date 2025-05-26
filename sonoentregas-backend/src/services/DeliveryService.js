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
const ViewDeliveries = require('../models/ViewDeliverys')
const ViewDeliverySales = require('../models/ViewDeliverySales')
const ViewDeliveryProd2 = require('../models/ViewDeliveryProd2')
const ForecastSales = require('../models/tables/Forecast/ForecastSales')
const MaintenanceModel = require('../models/tables/Maintenance')
const MaintenanceDeliveryModel = require('../models/tables/MaintenanceDeliv')
const SalesProd = require('../models/SalesProd')
const Empresas = require('../models/ShopsSce')
const Sales = require('../models/Sales')

const scripts = require('../scripts/delivery')
const MainService = require('../services/MainService')
const Date = require('../class/Date')

module.exports = {
  async findUnique(/** @type {number} */id){
    const deliveries = await Delivery.findAny(0, { id })

    if (deliveries.length === 0) {
      throw {
        error: 'delivery not found'
      }
    }

    const delivery = deliveries[0]

    delivery.D_MOUNTING = new Date(delivery.D_MOUNTING+'T00:00:00')
      .getBRDateTime()
      .date

    delivery.D_DELIVERING = new Date(delivery.D_DELIVERING+'T00:00:00')
      .getBRDateTime()
      .date

    delivery.D_DELIVERED = new Date(delivery.D_DELIVERED+'T00:00:00')
      .getBRDateTime()
      .date

    return delivery
  },
  /**
   * @param {number} id
   */
  async findDelivery(id){
    try {
      const deliveries = await ViewDeliveries.findAny(0, { id })

      if (deliveries.length === 0) {
        throw {
          error: 'delivery not found'
        }
      }

      const delivery = deliveries[0]

      delivery.D_MOUNTING = new Date(delivery.D_MOUNTING+'T00:00:00')
        .getBRDateTime()
        .date

      delivery.D_DELIVERING = new Date(delivery.D_DELIVERING+'T00:00:00')
        .getBRDateTime()
        .date

      delivery.D_DELIVERED = new Date(delivery.D_DELIVERED+'T00:00:00')
        .getBRDateTime()
        .date

      /**@type {IValueDelivery[]} */
      const deliveryMonetaryValues = await ViewDeliverySales._query(0, scripts.deliveryMonetaryValues(id), QueryTypes.SELECT)
      delivery.COST = deliveryMonetaryValues.length > 0 ? deliveryMonetaryValues[0].COST : 0
      delivery.PRICE = deliveryMonetaryValues.length > 0 ? deliveryMonetaryValues[0].PRICE : 0

      const sales = await ViewDeliverySales.findSome(0, `ID_DELIVERY = ${id}`)
      const products = await ViewDeliveryProd2.findSome(0, `ID_DELIVERY = ${id}`)
      const shops = await Empresas._query(0, 'SELECT * FROM LOJAS', QueryTypes.SELECT)
      sales.forEach(sale => {
        sale['products'] = products.filter(saleProd => sale.ID === saleProd.ID_SALE_ID)
        sale['SHOP'] = shops.filter( shops => shops.CODLOJA === sale.CODLOJA).map( shop => shop.DESC_ABREV)
      })

      const salesMaintenance = await ViewDeliverySales._query(0, scripts.maintenanceSale(id), QueryTypes.SELECT)
      const productsMaintenance = await ViewDeliverySales._query(0, scripts.maintenanceProducts(id), QueryTypes.SELECT)
      salesMaintenance.forEach(sale => {
        sale['products'] = productsMaintenance.filter(product => product.ID_SALE_ID === sale.ID)
        sale['isMaintenance'] = true
        sale['SHOP'] = shops.filter( shops => shops.CODLOJA === sale.CODLOJA).map( shop => shop.DESC_ABREV)
      })

      delivery.sales = [...sales, ...salesMaintenance]

      return delivery
    } catch (error) {
      console.log(error)
    }
  },
  /**
   * @param {number} idShop
   */
  async findDeliveriesByShop(idShop){
    const deliveriesId = await Delivery.findAny(0, {
      in: {
        status: ['Em lançamento', 'Entregando']
      }
    }, 'ID')

    if (deliveriesId.length === 0) {
      return []
    }

    const sales = await ViewDeliverySales.findAny(0, {
      CODLOJA: idShop,
      in: { ID_DELIVERY: deliveriesId.map(delivery => delivery.ID)}
    })

    if (sales.length === 0) {
      return []
    }

    const products = await ViewDeliveryProd2.findAny(0, {
      CODLOJA: idShop,
      in: { ID_DELIVERY: deliveriesId.map(delivery => delivery.ID)}
    })

    const deliveries = await ViewDeliveries.findAny(0, {
      in: { ID: sales.map(sale => sale.ID_DELIVERY) }
    })

    deliveries.forEach(delivery => {
      delivery["sales"] = []

      sales.forEach(sale => {
        if (sale.ID_DELIVERY === delivery.ID) {
          sale["products"] =
            products.filter(
              product => sale.ID_SALES === product.ID_SALES && sale.CODLOJA === product.CODLOJA && product.ID_DELIVERY === sale.ID_DELIVERY
            )
          delivery.sales.push(sale)
        }
      })
    })

    return deliveries
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
  async addSale({ sale, idDelivery, userId, connectionEntrega }){
    if (!sale.isMaintenance) {
      const valueProd =  sale.products.map( product => ({
        ID_DELIVERY: idDelivery,
        ID_SALE: product.ID_SALES,
        CODLOJA: product.CODLOJA,
        QTD_DELIV: product.quantityForecast,
        COD_ORIGINAL: product.COD_ORIGINAL,
        DELIVERED: 0
      }))

      await DeliveryProd.creatorAny(0, valueProd, true, connectionEntrega)

      await SalesProd.updateAny(0, { STATUS: 'Em lançamento' }, {
        ID_SALE_ID: sale.ID,
        in: { COD_ORIGINAL: sale.products.map(product => product.COD_ORIGINAL) }
      }, connectionEntrega)
    } else {
      const delivery = await Delivery.findAny(0, { ID: idDelivery }, 'ID, D_MOUNTING, ID_DRIVER, ID_ASSISTANT', connectionEntrega)

      const valueProd =  sale.products.map( product => ({
        ID_MAINT: product.ID_MAINTENANCE,
        D_MOUNTING: delivery[0].D_MOUNTING,
        DONE: 1,
        ID_DRIVER: delivery[0].ID_DRIVER,
        ID_ASSISTANT: delivery[0].ID_ASSISTANT,
        ID_DELIV_MAIN: idDelivery,
        ID_USER: userId,
      }))

      await MaintenanceDeliveryModel.creatorAny(0, valueProd, false, connectionEntrega)

      await MaintenanceModel.updateAny(0, { STATUS: 'Em lançamento' }, { in: { ID: sale.products.map(product => product.ID_MAINTENANCE) } }, connectionEntrega)      
    }

    await ForecastSales.updateAny(0, { idDelivery }, { id: sale.idForecastSale }, connectionEntrega)
  },
  async rmvSale({ salesProd }, connectionEntrega){
    const script = `DELETE DELIVERYS_PROD WHERE ID_DELIVERY = ${salesProd[0].ID_DELIVERY} AND ID_SALE = ${salesProd[0].ID_SALES} AND CODLOJA = ${salesProd[0].CODLOJA}`

    await DeliveryProd._query(0, script, QueryTypes.DELETE, connectionEntrega)

    await SalesProd.updateAny(0, { STATUS: 'Em Previsão' }, {
      ID_SALES: salesProd[0].ID_SALES,
      CODLOJA: salesProd[0].CODLOJA,
      in: { COD_ORIGINAL: salesProd.map(product => product.COD_ORIGINAL) }
    }, connectionEntrega)
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
  },
  /**
   * @param {object} props
   */
  async extraRoutes({dateStart, dateEnd}){
    const extraRoutesAssistantsScript = scripts.extraRoutesAssistants({dateStart, dateEnd})
    const extraRoutesAssistants = await Delivery._query(0, extraRoutesAssistantsScript, QueryTypes.SELECT)

    const extraRoutesDriversScript = scripts.extraRoutesDrivers({dateStart, dateEnd})
    const extraRoutesDrivers = await Delivery._query(0, extraRoutesDriversScript, QueryTypes.SELECT)


    return {
      assistants: extraRoutesAssistants,
      drivers: extraRoutesDrivers,
    }
  },
}