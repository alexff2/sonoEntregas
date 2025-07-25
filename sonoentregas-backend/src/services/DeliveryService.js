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
        sale['isMaintenance'] = false
        sale['products'] = products.filter(saleProd => sale.ID === saleProd.ID_SALE_ID)
        sale['SHOP'] = shops.filter( shops => shops.CODLOJA === sale.CODLOJA).map( shop => shop.DESC_ABREV)
      })

      const salesMaintenance = await ViewDeliverySales._query(0, scripts.maintenanceSale(id), QueryTypes.SELECT)
      const productsMaintenance = await ViewDeliverySales._query(0, scripts.maintenanceProducts(id), QueryTypes.SELECT)
      salesMaintenance.forEach(sale => {
        sale['isMaintenance'] = true
        sale['products'] = productsMaintenance.filter(product => product.ID_SALE_ID === sale.ID)
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
  async delivering({id, date, userId, connections}){
    const delivery = await Delivery.findAny(0, { ID: id }, 'ID, STATUS', connections.entrega)

    if (delivery.length === 0) {
      throw {
        error: 'Delivery not found'
      }
    }
    if (delivery[0].STATUS !== 'Em lançamento') {
      throw {
        error: 'Only deliveries in "Em lançamento" status can be delivered'
      }
    }

    const dateTimeNow = new Date().getISODateTimeBr().dateTime

    await SalesProd._query(0, scripts.decreaseStockOfRouteProducts(id), QueryTypes.UPDATE, connections.entrega)

    const maintenanceDeliveries = await MaintenanceDeliveryModel.findAny(0, {ID_DELIV_MAIN: id}, 'ID_MAINT', connections.entrega)
    if (maintenanceDeliveries.length > 0) await MaintenanceModel.updateAny(0, {STATUS: 'Em deslocamento'}, {in: {ID: maintenanceDeliveries.map(item => item.ID_MAINT)}}, connections.entrega)
    await SalesProd._query(0, scripts.setSalesProdDelivering(id), QueryTypes.UPDATE, connections.entrega)

    await Delivery.updateAny(0, {
      STATUS: 'Entregando',
      ID_USER_DELIVERING: userId,
      dateUpdateDelivering: dateTimeNow,
      D_DELIVERING: date
    }, { id }, connections.entrega)
  },
  async returns({id, product, connectionEntrega}){
    const delivery = await Delivery.findAny(0, { ID: id }, 'ID, STATUS', connectionEntrega)
    if (delivery.length === 0) {
      throw {
        error: 'Delivery not found'
      }
    }

    if (delivery[0].STATUS !== 'Entregando') {
      throw {
        error: 'Only deliveries in "Entregando" status can be finished'
      }
    }

    if (product.ID_MAINTENANCE) {
      await MaintenanceDeliveryModel.updateAny(0, {
        DONE: 0,
        REASON_RETURN: product.REASON_RETURN,
      }, {ID_DELIV_MAIN: id, ID_MAINT: product.ID_MAINTENANCE}, connectionEntrega)

      return
    }

    await DeliveryProd.updateAny(0, {
      DELIVERED: 1,
      REASON_RETURN: product.REASON_RETURN,
    }, {
      ID_DELIVERY: id,
      ID_SALE: product.ID_SALES,
      COD_ORIGINAL: product.COD_ORIGINAL,
      CODLOJA: product.CODLOJA
    }, connectionEntrega)
  },
  async returnsDelete({id, product, connectionEntrega}){
    const delivery = await Delivery.findAny(0, { ID: id }, 'ID, STATUS', connectionEntrega)
    if (delivery.length === 0) {
      throw {
        error: 'Delivery not found'
      }
    }

    if (delivery[0].STATUS !== 'Entregando') {
      throw {
        error: 'Only deliveries in "Entregando" status can be finished'
      }
    }

    if (product.ID_MAINTENANCE) {
      await MaintenanceDeliveryModel.updateAny(0, {
        DONE: 1,
        REASON_RETURN: 'NULL',
      }, {ID_DELIV_MAIN: id, ID_MAINT: product.ID_MAINTENANCE}, connectionEntrega)

      return
    }

    await DeliveryProd.updateAny(0, {
      DELIVERED: 0,
      REASON_RETURN: 'NULL',
    }, {
      ID_DELIVERY: id,
      ID_SALE: product.ID_SALES,
      COD_ORIGINAL: product.COD_ORIGINAL,
      CODLOJA: product.CODLOJA
    }, connectionEntrega)
  },
  async finish({id, date, userId, connections}){
    const delivery = await Delivery.findAny(0, { ID: id }, 'ID, STATUS', connections.entrega)

    if (delivery.length === 0) {
      throw {
        error: 'Delivery not found'
      }
    }

    if (delivery[0].STATUS !== 'Entregando') {
      throw {
        error: 'Only deliveries in "Entregando" status can be finished'
      }
    }

    const idsSalesId = await DeliveryProd._query(0,scripts.finIdSalesIdReturn(id), QueryTypes.SELECT, connections.entrega)
    if (idsSalesId.length > 0) await Sales.updateAny(0, {STATUS: 'Aberta'}, {in: {ID: idsSalesId.map(item => item.ID_SALE_ID)}}, connections.entrega)
    await SalesProd._query(0, scripts.setSalesProdDelivered(id), QueryTypes.UPDATE, connections.entrega)
    await MaintenanceModel._query(0, scripts.setMaintenanceDelivered(id), QueryTypes.UPDATE, connections.entrega)

    await SalesProd._query(0, scripts.increaseStockOfRouteProducts(id), QueryTypes.UPDATE, connections.entrega)

    const dateTimeNow = new Date().getISODateTimeBr().dateTime
    await Delivery.updateAny(0, {
      STATUS: 'Finalizada',
      ID_USER_DELIVERED: userId,
      dateUpdateDelivered: dateTimeNow,
      D_DELIVERED: date,
    }, {id}, connections.entrega)
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
      const valueProd =  sale.products.map( product => ({
        ID_MAINT: product.ID_MAINTENANCE,
        DONE: 1,
        ID_DELIV_MAIN: idDelivery,
        ID_USER: userId,
      }))

      await MaintenanceDeliveryModel.creatorAny(0, valueProd, false, connectionEntrega)

      await MaintenanceModel.updateAny(0, { STATUS: 'Em lançamento' }, { in: { ID: sale.products.map(product => product.ID_MAINTENANCE) } }, connectionEntrega)      
    }

    await ForecastSales.updateAny(0, { idDelivery }, { id: sale.idForecastSale }, connectionEntrega)
  },
  async rmvSale({ sale }, connectionEntrega){
    await ForecastSales.updateAny(
      0,
      { idDelivery: 'NULL' },
      { idSale: sale.ID, idDelivery: sale.products[0].ID_DELIVERY },
      connectionEntrega
    )

    if (!sale.isMaintenance) {
      await DeliveryProd.deleteAny(0, {
        ID_DELIVERY: sale.products[0].ID_DELIVERY,
        ID_SALE: sale.ID_SALES,
        CODLOJA: sale.CODLOJA,
      })

      await SalesProd.updateAny(0, { STATUS: 'Em Previsão' }, {
        ID_SALES: sale.ID_SALES,
        CODLOJA: sale.CODLOJA,
        in: { COD_ORIGINAL: sale.products.map(product => product.COD_ORIGINAL) }
      }, connectionEntrega)

      return
    }

    await MaintenanceDeliveryModel.deleteAny(0, {
      ID_DELIV_MAIN: sale.products[0].ID_DELIVERY,
      in: { ID_MAINT: sale.products.map(product => product.ID_MAINTENANCE) },
    }, connectionEntrega)

    await MaintenanceModel.updateAny(0, { STATUS: 'Em Previsão' }, {
      in: { ID: sale.products.map(product => product.ID_MAINTENANCE)}
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
  async delete(/** @type {number} */id){
    const connectionEntrega = await Delivery._query(0)
    try {

      const delivery = await Delivery.findAny(0, { ID: id }, 'ID, STATUS', connectionEntrega)
  
      if (delivery.length === 0) {
        throw {
          error: 'Delivery not found'
        }
      }
  
      if (delivery[0].STATUS !== 'Em lançamento') {
        throw {
          error: 'Only deliveries in "Em lançamento" status can be deleted'
        }
      }

      const maintenanceDelivery = await MaintenanceDeliveryModel.findAny(0, { ID_DELIV_MAIN: id }, 'ID_MAINT', connectionEntrega)

      if (maintenanceDelivery.length !== 0) {
        await MaintenanceDeliveryModel.deleteAny(0, {ID_DELIV_MAIN: id}, connectionEntrega)
        await MaintenanceModel.updateAny(
          0,
          {STATUS: 'Em Previsão'},
          {in: {ID: maintenanceDelivery.map(item => item.ID_MAINT)}},
          connectionEntrega
        )
      }

      const deliveryProd = await DeliveryProd.findAny(0, { ID_DELIVERY: id }, 'ID_DELIVERY', connectionEntrega)

      if (deliveryProd.length !== 0) {
        await SalesProd._query(0, scripts.returnsSalesProdForForecasting(id), QueryTypes.UPDATE, connectionEntrega)
        await DeliveryProd.deleteAny(0, {ID_DELIVERY: id}, connectionEntrega)
        await ForecastSales.updateAny(0, {idDelivery: 'NULL'}, {idDelivery: id}, connectionEntrega)
      }

      await Delivery.deleteAny(0, {ID: id}, connectionEntrega)
      await connectionEntrega.transaction.commit()
    } catch (error) {
      try {
        await connectionEntrega.transaction.rollback()
      } catch (rollbackError) {
        console.warn('Erro ao tentar dar rollback:', rollbackError.message)
      }
      throw error
    }
  }
}