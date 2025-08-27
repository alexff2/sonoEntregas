//@ts-check
const ProdLojaSeriesMovimentosModel = require('../models/tables/ProdLojaSeriesMovimentos')
const SerieService = require('../services/SerieService')
const SerieRules = require('../rules/SerieRules')
const errorCath = require('../functions/error')

module.exports = {
  findSerialNumberOfProduct: async (request, response) => {
    try {
      const { serialNumber } = request.query

      const product = await SerieService.findSerialNumberOfProduct(serialNumber)

      return response.status(200).json({ product })
    } catch (error) {
      errorCath(error, response)
    }
  },
  findOpenSeriesByProduct: async (request, response) => {
    try {
      const { code } = request.query

      const data = await SerieService.findOpenSerieByProduct(code)

      return response.status(200).json(data)
    } catch (error) {
      errorCath(error, response)
    }
  },
  createFirst: async(request, response) => {
    const connectionEntrega = await ProdLojaSeriesMovimentosModel._query(0)
    const connection = await ProdLojaSeriesMovimentosModel._query(1)

    try {
      const { serialNumber, productId, module, moduleId } = request.body
      const { id: userId } = request.user

      if(serialNumber.length > 10 || isNaN(Number(serialNumber)) || Number(serialNumber) <= 0) {
        throw {
          error: 'serial number invalid'
        }
      }

      if (module !== 'single') await SerieRules.checkModule(module, moduleId, {
        sce: connection,
        entrega: connectionEntrega
      })

      if (module === 'delivery' || module === 'maintenance') {
        const mayReturn = await SerieRules.serialNumberMayReturn({
          serialNumber,
          moduleId,
          module,
          productId
        }, connection)
        if (!mayReturn) {
          throw {
            error: 'Serial number not linked to this module on output!'
          }
        }
      }

      await SerieRules.createIfDoesNotExistFinished({ serialNumber }, connection)

      const serialNumberResponse = await SerieService.create({
        productId,
        serialNumber,
        module,
        moduleId: module === 'single' ? 0 : moduleId,
        connection,
        userId
      })

      await connection.transaction.commit()
      await connectionEntrega.transaction.commit()

      return response.status(200).json({ serialNumberResponse })
    } catch (erro) {
      await connection.transaction.rollback()
      await connectionEntrega.transaction.rollback()
      errorCath(erro, response)
    }
  },
  finishesIfOpened: async(request, response) => {
    const sce = await ProdLojaSeriesMovimentosModel._query(1)
    const entrega = await ProdLojaSeriesMovimentosModel._query(0)

    try {
      const { productId, serialNumber, module, moduleId } = request.body
      const { id: userId } = request.user

      if (isNaN(Number(serialNumber))) {
        throw {
          error: 'serial number invalid'
        }
      }

      if (module !== 'transfer' && module !== 'delivery' && module !== 'maintenance') {
        throw {
          error: 'Module invalid!'
        }
      }

      await SerieRules.checkModule(module, moduleId, {sce, entrega})
      await SerieRules.finishesIfOpened({ serialNumber, productId })

      await SerieService.output({
        serialNumber,
        productId,
        module,
        moduleId: module === 'single' ? 0 : moduleId,
        connection: sce,
        userId
      })

      await sce.transaction.commit()
      await entrega.transaction.commit()

      return response.status(200).json(serialNumber)
    } catch (erro) {
      await sce.transaction.rollback()
      await entrega.transaction.rollback()
      errorCath(erro, response)
    }
  },
  changeSerialNumberOfProduct: async(request, response) => {
    const entrega = await ProdLojaSeriesMovimentosModel._query(1)

    try {
      const { serialNumber, newProductId } = request.body

      await SerieService.changeSerialNumberOfProduct({
        serialNumber,
        newProductId,
        transaction: entrega
      })

      await entrega.transaction.commit()

      return response.status(200).json({ serialNumber })
    } catch (erro) {
      await entrega.transaction.rollback()
      errorCath(erro, response)
    }
  },
  findBeepPendantModules: async(request, response) => {
    if(process.env.STOCK_BEEP !== '1') {
      return response.json([])
    }

    const where = request.query

    if (typeof where !== 'object' || where === null || Array.isArray(where)) {
      return response.status(400).json({ error: 'Invalid "where" parameter. It must be an object.' })
    }

    const allowedKeys = ['data', 'module', 'id']
    const invalidKeys = Object.keys(where).filter(key => !allowedKeys.includes(key))

    if (invalidKeys.length > 0) {
      return response.status(400).json({ error: `Invalid keys in "where" parameter: ${invalidKeys.join(', ')}` })
    }

    const result = await SerieService.beepPendantModules(where)

    return response.json(result)
  },
  unbeepEntryNote: async (request, response) => {
    const sce = await ProdLojaSeriesMovimentosModel._query(1)

    try {
      const {serialNumber} = request.body

      if (isNaN(Number(serialNumber))) {
        throw {
          error: 'serial number invalid',
        }
      }

      await SerieService.unbeepEntryNote({
        serialNumber,
        connection: sce
      })

      await sce.transaction.commit()

      return response.status(200).json('ok')
    } catch (erro) {
      await sce.transaction.rollback()
      errorCath(erro, response)
    }
  },
  unbeepDeliveryRoute: async (request, response) => {
    const sce = await ProdLojaSeriesMovimentosModel._query(1)

    try {
      const {serialNumber} = request.body

      if (isNaN(Number(serialNumber))) {
        throw {
          error: 'serial number invalid'
        }
      }

      await SerieService.unbeepDeliveryRoute({
        serialNumber,
        connection: sce
      })

      await sce.transaction.commit()

      return response.status(200).json('ok')
    } catch (erro) {
      await sce.transaction.rollback()
      errorCath(erro, response)
    }
  },
}
