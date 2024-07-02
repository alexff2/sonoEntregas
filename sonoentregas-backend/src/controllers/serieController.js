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
    const connection = await ProdLojaSeriesMovimentosModel._query(1)

    try {
      const { serialNumber, productId, module, moduleId } = request.body
      const { id: userId } = request.user

      if (module !== 'single' && module !== 'purchaseNote' && module !== 'transfer') {
        throw {
          error: 'Module invalid!'
        }
      }

      if (module !== 'single') await SerieRules.checkModule(module, moduleId)
      await SerieRules.createIfDoesNotExistFinished({ serialNumber })

      const serialNumberResponse = await SerieService.create({
        productId,
        serialNumber,
        module,
        moduleId: module === 'single' ? 0 : moduleId,
        connection,
        userId
      })

      await connection.transaction.commit()

      return response.status(200).json({ serialNumberResponse })
    } catch (erro) {
      await connection.transaction.rollback()
      errorCath(erro, response)
    }
  },
  finishesIfOpened: async(request, response) => {
    const connection = await ProdLojaSeriesMovimentosModel._query(1)

    try {
      const { serialNumber, module, moduleId } = request.body
      const { id: userId } = request.user

      if (module !== 'transfer' && module !== 'delivery') {
        throw {
          error: 'Module invalid!'
        }
      }

      await SerieRules.checkModule(module, moduleId)
      await SerieRules.finishesIfOpened({ serialNumber })

      await SerieService.output({
        serialNumber,
        module,
        moduleId: module === 'single' ? 0 : moduleId,
        connection,
        userId
      })

      await connection.transaction.commit()

      return response.status(200).json(serialNumber)
    } catch (erro) {
      await connection.transaction.rollback()
      errorCath(erro, response)
    }
  }
}
