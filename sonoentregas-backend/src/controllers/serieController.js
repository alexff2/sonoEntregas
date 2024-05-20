const { create, findOpenSerieByProduct } = require('../services/SerieService')
const { createIfDoesNotExist } = require('../rules/SerieRules')
const errorCath = require('../functions/error')

module.exports = {
  findOpenSeriesByProduct: async (request, response) => {
    try {
      const { code } = request.query

      const data = await findOpenSerieByProduct(code)

      return response.status(200).json(data)
    } catch (error) {
      errorCath(error, response)
    }
  },
  createFirst: async(request, response) => {
    try {
      const { serialNumber, productId, module } = request.body

      if (module !== 'single' && module !== 'note') {
        throw {
          error: 'Module invalid!'
        }
      }

      await createIfDoesNotExist({ serialNumber })

      await create({ productId, serialNumber, module })

      return response.status(200).json(serialNumber)
    } catch (erro) {
      errorCath(erro, response)
    }
  }
}