//@ts-check
const ProdLojaSeriesMovimentosModel = require('../models/tables/ProdLojaSeriesMovimentos')
const SerieService = require('../services/SerieService')
const SerieRules = require('../rules/SerieRules')
const errorCath = require('../functions/error')

module.exports = {
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

      if (isNaN(Number(serialNumber))) {
        throw {
          error: 'serial number invalid'
        }
      }

      if (module !== 'single' && module !== 'purchaseNote' && module !== 'transfer' && module !== 'delivery' && module !== 'saleReturn') {
        throw {
          error: 'Module invalid!'
        }
      }

      if (module !== 'single') await SerieRules.checkModule(module, moduleId, {
        sce: connection,
        entrega: connectionEntrega
      })
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
  }
}
