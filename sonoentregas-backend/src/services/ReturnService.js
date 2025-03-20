const { QueryTypes } = require('sequelize')
const DateTime = require('../class/Date')
const ReturnsModel = require('../models/tables/Returns')
const ReturnsProductsModel = require('../models/tables/Returns/ReturnsProducts')
const DeliveryProdModel = require('../models/DeliveryProd')
const ShopModel = require('../models/tables/Shops')
const returnsSceScripts = require('../scripts/returnsSce')
const addressesScripts = require('../scripts/addresses')

class ReturnService {
  async findSce({typeSearch, search, dateStart, dateFinish, shopId}) {
    const scriptReturnsSce = returnsSceScripts.findByIdDateName({
      originalSaleId: typeSearch === 'originalSaleId' ? search : '',
      name: typeSearch === 'name' ? search : '',
      dateStart: typeSearch === 'date' ? dateStart : '',
      dateFinish: typeSearch === 'date' ? dateFinish : ''
    })

    const salesReturns = await ReturnsModel._query(shopId, scriptReturnsSce, QueryTypes.SELECT)

    if (salesReturns.length === 0) {
      return []
    }

    const products = await ReturnsModel._query(
      shopId,
      returnsSceScripts.findProductsSce({id: salesReturns.map(sale => sale.originalReturnId)}),
      QueryTypes.SELECT
    )

    const deliveryProds = await DeliveryProdModel.findAny(0, {
      CODLOJA: shopId,
      in: {
        COD_ORIGINAL: products.map(product => product.alternativeCode),
        ID_SALE: salesReturns.map(sale => sale.originalSaleId)
      }
    })

    const isSendReturn = await ReturnsModel.findAny(0, {
      shopId,
      in: {
        originalReturnId: salesReturns.map(sale => sale.originalReturnId)
      }
    })

    salesReturns.forEach(sale => {
      sale.dtReturnToLocale = sale.dtReturn.toLocaleDateString()

      sale.products = products.filter(product => {
        const deliveryProd = deliveryProds.find(deliveryProd => deliveryProd.COD_ORIGINAL === product.alternativeCode && deliveryProd.ID_SALE === product.originalSaleId)
        return deliveryProd && deliveryProd.ID_SALE === sale.originalSaleId
      })

      sale.isSendReturn = isSendReturn.some(sendReturn => sendReturn.originalReturnId === sale.originalReturnId)
    })

    return salesReturns.filter(sale => sale.products.length > 0)
  }

  async findOpen(){
    const returnsPending = await ReturnsModel.findAny(0, { in: { status: ['Pendente', 'Buscando']} })

    if (returnsPending.length === 0) {
      return []
    }

    const products = await ReturnsProductsModel._query(
      0,
      returnsSceScripts.products(returnsPending.map(returnPending => returnPending.id)),
      QueryTypes.SELECT
    )

    const shops = await ShopModel.findAny(0, { in: { CODLOJA: returnsPending.map(returnPending => returnPending.shopId) } })

    returnsPending.forEach(returnPending => {
      returnPending.dateSendToLocale = returnPending.dateSend.toLocaleDateString()

      returnPending.products = products.filter(product => product.returnsSalesId === returnPending.id)

      const shop = shops.find(shop => shop.CODLOJA === returnPending.shopId)
      returnPending.shop = shop.DESC_ABREV
    })

    return returnsPending
  }

  async findById({id, connection}){
    const returnsSale = await ReturnsModel.findAny(0, { id }, '*', connection)

    const products = await ReturnsProductsModel._query(
      0,
      returnsSceScripts.products(returnsSale[0].id),
      QueryTypes.SELECT,
      connection
    )

    const shop = await ShopModel.findAny(0, { CODLOJA: returnsSale[0].shopId }, '*', connection)

    returnsSale.forEach(returnPending => {
      returnPending.dateSendToLocale = returnPending.dateSend.toLocaleDateString()

      returnPending.products = products.filter(product => product.returnsSalesId === returnPending.id)

      returnPending.shop = shop[0].DESC_ABREV
    })

    return returnsSale[0]
  }

  async findByClientOrDate({typeSearch, search, dateStart, dateFinish}){
    console.log('Chegou aqui')
    const returnsSaleScript = await returnsSceScripts.findByClientOrDate({
      client: typeSearch === 'client' ? search : '',
      originalSaleId: typeSearch === 'originalSaleId' ? search : '',
      dateStart: typeSearch === 'dateReturn' ? dateStart : '',
      dateFinish: typeSearch === 'dateReturn' ? dateFinish : ''
    })

    const returnsSale = await ReturnsModel._query(0, returnsSaleScript, QueryTypes.SELECT)

    if (returnsSale.length === 0) {
      return []
    }

    const products = await ReturnsProductsModel._query(
      0,
      returnsSceScripts.products(returnsSale.map(returnSale => returnSale.id)),
      QueryTypes.SELECT
    )

    const shops = await ShopModel.findAny(0, { in: { CODLOJA: returnsSale.map(returnSale => returnSale.shopId) } })

    returnsSale.forEach(returnSale => {
      returnSale.dateSendToLocale = returnSale.dateSend.toLocaleDateString()

      returnSale.products = products.filter(product => product.returnsSalesId === returnSale.id)

      const shop = shops.find(shop => shop.CODLOJA === returnSale.shopId)
      returnSale.shop = shop.DESC_ABREV
    })

    return returnsSale
  }

  async create(saleReturnInput, productsInput, connections){
    const scriptUpdateStatusSce = returnsSceScripts.updateStatusSce({
      originalSaleId: saleReturnInput.originalSaleId,
      alternativesCodes: productsInput.map(product => `'${product.alternativeCode}'`),
      status: 'Devolvida'
    })
    await ReturnsModel._query(
      saleReturnInput.shopId,
      scriptUpdateStatusSce,
      QueryTypes.UPDATE,
      connections.connectionSce
    )
    
    const scriptDecreaseStockSce = returnsSceScripts.adjustStockSce({
      alternativesCodes: productsInput.map(product => `'${product.alternativeCode}'`)
    })

    await ReturnsModel._query(
      saleReturnInput.shopId,
      scriptDecreaseStockSce,
      QueryTypes.UPDATE,
      connections.connectionSce
    )

    const dateSend = new DateTime().getISODateTimeBr2().dateTimeIsoBr
    /**@type {OutputCreateReturn} */
    const createId = await ReturnsModel.creatorAny(0, [{
      dateSend,
      originalReturnId: saleReturnInput.originalReturnId,
      shopId: saleReturnInput.shopId,
      originalSaleId: saleReturnInput.originalSaleId,
      client: saleReturnInput.client,
      street: saleReturnInput.street,
      houseNumber: saleReturnInput.houseNumber,
      district: saleReturnInput.district,
      city: saleReturnInput.city,
      state: saleReturnInput.state,
      phone: saleReturnInput.phone,
      status: 'Pendente'
    }], false, connections.connectionDelivery)

    const productsToCreate = productsInput.map(product => ({
      returnsSalesId: createId,
      alternativeCode: product.alternativeCode,
      quantity: product.quantity
    }))

    await ReturnsProductsModel.creatorAny(0, productsToCreate, false, connections.connectionDelivery)

    return createId
  }

  async cancel(id, shopId, {
    connectionSce,
    connectionDelivery
  }){
    const returnToCancel = await ReturnsModel.findAny(0, { id })

    if (returnToCancel.length === 0) {
      throw new Error('Return not found')
    }

    const returnProductsToCancel = await ReturnsProductsModel.findAny(0, { returnsSalesId: id })

    const scriptUpdateStatusSce = returnsSceScripts.updateStatusSce({
      originalSaleId: returnToCancel[0].originalSaleId,
      alternativesCodes: returnProductsToCancel.map(product => `'${product.alternativeCode}'`),
      status: 'Enviado'
    })

    await ReturnsModel._query(
      shopId,
      scriptUpdateStatusSce,
      QueryTypes.UPDATE,
      connectionSce
    )

    const scriptIncreaseStockSce = returnsSceScripts.adjustStockSce({
      alternativesCodes: returnProductsToCancel.map(product => `'${product.alternativeCode}'`)
    })

    await ReturnsModel._query(
      shopId,
      scriptIncreaseStockSce,
      QueryTypes.UPDATE,
      connectionSce
    )

    await ReturnsProductsModel.deleteAny(0, { returnsSalesId: id },connectionDelivery)
    await ReturnsModel.deleteAny(0, { id },connectionDelivery)
  }

  async findAddress(clienteId, originalSaleId, shopId){
    const addressesSceScript = await addressesScripts.findAddressSce(clienteId)

    const addressesSce = await ReturnsModel._query(shopId, addressesSceScript, QueryTypes.SELECT)

    const addressesDeliveryScript = await addressesScripts.findAddressDelivery(originalSaleId, shopId)

    const addressesDelivery = await ReturnsModel._query(0, addressesDeliveryScript, QueryTypes.SELECT)

    if (addressesSce.length === 0 && addressesDelivery.length === 0) {
      return []
    }

    /**@type {Address[]} */
    const addresses = [addressesSce[0], addressesDelivery[0]]

    return addresses
  }

  async linkInDelivery(returnId, deliveryId, connectionDelivery){
    await ReturnsModel.updateAny(
      0,
      { 
        deliveryId,
        status: 'Buscando'
      },
      { id: returnId },
      connectionDelivery
    )
  }

  async unlinkInDelivery(returnId, connectionDelivery){
    await ReturnsModel.updateAny(
      0,
      { 
        deliveryId: 'NULL',
        status: 'Pendente'
      },
      { id: returnId },
      connectionDelivery
    )
  }

  async finish(returnId, connectionDelivery){
    await ReturnsModel.updateAny(
      0,
      { 
        status: 'Devolvido'
      },
      { id: returnId },
      connectionDelivery
    )

    const scriptRmvStock = returnsSceScripts.decreaseStock(returnId)

    await ReturnsModel._query(
      0,
      scriptRmvStock,
      QueryTypes.UPDATE,
      connectionDelivery
    )
  }
}

module.exports = new ReturnService()
