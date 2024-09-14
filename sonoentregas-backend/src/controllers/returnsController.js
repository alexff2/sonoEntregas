const ReturnsModel = require('../models/tables/Returns')
const ReturnService = require('../services/ReturnService')
const errorCath = require('../functions/error')

module.exports = {
  async findOpen(_request, response) {
    try {
      const returns = await ReturnService.findOpen()
      return response.json({ returns })
    } catch (error) {
      return errorCath(error, response)
    }
  },
  async findSce(request, response) {
    try {
      const { typeSearch, search, dateStart, dateFinish, shopId } = request.query
      const salesReturns = await ReturnService.findSce({
        typeSearch,
        search,
        dateStart,
        dateFinish,
        shopId
      })
      return response.json({salesReturns})
    } catch (error) {
      return errorCath(error, response)
    }
  },
  async findAddress(request, response) {
    try {
      const { originalSaleId, clientId, shopId } = request.query
      const addresses = await ReturnService.findAddress(clientId, originalSaleId, shopId)
      return response.json({ addresses })
    } catch (error) {
      return errorCath(error, response)
    }
  },
  async create(request, response) {
    const { saleReturnInput, productsInput } = request.body

    const connectionSce = await ReturnsModel._query(saleReturnInput.shopId)
    const connectionDelivery = await ReturnsModel._query(0)

    try {
      const createId = await ReturnService.create(
        saleReturnInput,
        productsInput,
        {
          connectionSce,
          connectionDelivery
        }
      )

      const returnCreated = await ReturnService.findById({id: createId, connection: connectionDelivery})

      connectionDelivery.transaction.commit()
      connectionSce.transaction.commit()

      return response.json({ returnCreated })
    } catch (error) {
      connectionDelivery.transaction.rollback()
      connectionSce.transaction.rollback()
      return errorCath(error, response)
    }
  },
  async cancel(request, response) {
    const { id  } = request.params
    const { shopId  } = request.query
    const connectionSce = await ReturnsModel._query(shopId)
    const connectionDelivery = await ReturnsModel._query(0)

    try {
      await ReturnService.cancel(id, shopId, {
        connectionSce,
        connectionDelivery
      })

      connectionDelivery.transaction.commit()
      connectionSce.transaction.commit()

      return response.status(204).send()
    } catch (error) {
      connectionDelivery.transaction.rollback()
      connectionSce.transaction.rollback()
      return errorCath(error, response)
    }
  }
}