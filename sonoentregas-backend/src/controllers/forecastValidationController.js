//@ts-check
const {
  validateSale,
  invalidateSale,
  authorizeInvalidation,
  authorizeRemove
} = require('../services/ForecastService')
const ForecastRules = require('../rules/forecastRules')

module.exports = {
  /**
   * @param {any} req
   * @param {any} res
   */
  async validation(req, res){
    try {
      const { idForecast, id } = req.params
      const { validationStatus, contact, obs } = req.body

      const { id: userId } = req.user

      if ( typeof validationStatus !== 'boolean' ) {
        return res.status(400).json('Type of validation status is not boolean')
      }

      if (!contact || obs === undefined) {
        return res.status(400).json('Informe todos os dados necessários para validação')
      }

      await ForecastRules.checkExistValidForecast({ id: idForecast })

      await ForecastRules.checkForecastSaleIsValidated({ id })

      await validateSale({
        id,
        validationStatus,
        contact,
        userId,
        obs
      })

      return res.status(200).json('')
    } catch (e) {
      console.log(e)

      let status = e.status ? e.status : 400
      let error = e.error ? e.error : e

      return res.status(status).json(error)
    }
  },
  /**
   * @param {any} req
   * @param {any} res
   */
  async authInvalidation(req, res){ // VERIFICAR SE ESTAR EM ROTA
    try {
      const { idForecast, id } = req.params

      const { id: userId } = req.user

      await ForecastRules.checkExistForecast({ id: idForecast })

      const forecastSale = await ForecastRules.checkForecastSaleNotValidated({ id })

      if (forecastSale.canInvalidate) {
        throw {
          status: 409,
          error: 'Already authorized invalidation of this sale!'
        }
      }

      await authorizeInvalidation({ id })

      return res.status(200).json(`cancellation request by ${userId}`)
    } catch (e) {
      console.log(e)

      let status = e.status ? e.status : 400
      let error = e.error ? e.error : e

      return res.status(status).json(error)
    }
  },
  /**
   * @param {any} req
   * @param {any} res
   */
  async invalidate(req, res){ // Mudar status do produto para enviado e talvez criar revalidação
    try {
      const { idForecast, id } = req.params
      const { obs } = req.body

      const { id: userId } = req.user

      if (!obs) {
        return res.status(400).json('Informe todos os dados necessários para validação')
      }

      await ForecastRules.checkExistForecast({ id: idForecast })

      const forecastSales = await ForecastRules.checkForecastSaleNotValidated({ id })

      if (!forecastSales.canInvalidate) {
        throw {
          status: 409,
          error: "don't permission to sale invalidate!"
        }
      }

      if (!forecastSales.validationStatus) {
        throw {
          status: 409,
          error: "Sale already invalidated!"
        }
      }

      await invalidateSale({
        id,
        obs,
        userId
      })

      return res.status(200).json()
    } catch (e) {
      console.log(e)

      let status = e.status ? e.status : 400
      let error = e.error ? e.error : e

      return res.status(status).json(error)
    }
  },
  /**
   * @param {any} req
   * @param {any} res
   */
  async authRemove(req, res){
    try {
      const { id, idForecast } = req.params

      const { id: userId } = req.user

      await ForecastRules.checkExistForecast({ id: idForecast })

      const forecastSale = await ForecastRules.checkForecastSaleIsValidated({ id })

      if (forecastSale.canRemove) {
        throw {
          status: 409,
          error: "Already authorized removal of this sale!"
        }
      }

      await authorizeRemove({ id })

      return res.status(200).json(`Removal allowed by user ${userId}`)
    } catch (e) {
      console.log(e)

      let status = e.status ? e.status : 400
      let error = e.error ? e.error : e

      return res.status(status).json(error)
    }
  }
}