//@ts-check
const ForecastService = require('../services/ForecastService')
const ForecastRules = require('../rules/forecastRules')

module.exports = {
  /**
   * @param {any} req
   * @param {any} res
   */
  async validation(req, res){
    try {
      const { idSale, id } = req.params
      const { validationStatus, contact, obs } = req.body

      const { id: userId } = req.user

      if ( typeof validationStatus !== 'boolean' ) {
        return res.status(400).json('Type of validation status is not boolean')
      }

      if (!contact || contact === '' || obs === undefined) {
        return res.status(400).json({
          dataInvalid: 'Informe todos os dados necessários para validação'
        })
      }

      await ForecastRules.checkExistValidForecast({ id })

      await ForecastRules.checkForecastSaleIsValidated({ id: idSale })

      await ForecastService.validateSale({
        id: idSale,
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
  async requestInvalidation(req, res){
    try {
      const { id, idSale } = req.params
      const { contact, obs } =  req.body

      const { id: userId } = req.user

      if (!contact || contact === '' || obs === undefined) {
        return res.status(400).json({
          dataInvalid: 'Informe todos os dados necessários para validação'
        })
      }

      await ForecastRules.checkExistForecast({ id })

      const forecastSale = await ForecastRules.checkForecastSaleNotValidated({ id: idSale })

      if (forecastSale.requestInvalidate) {
        throw {
          status: 409,
          error: 'Already authorized invalidation of this sale!'
        }
      }

      if (await ForecastRules.saleOnRoute({forecastSale})) {
        throw {
          status: 409,
          error: 'onRoute'
        }
      }

      await ForecastService.requestInvalidation({ id: idSale, contact, obs })

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
  async invalidate(req, res){
    try {
      const { id, idSale } = req.params

      const { id: userId } = req.user

      await ForecastRules.checkExistForecast({ id })

      const forecastSales = await ForecastRules.checkForecastSaleNotValidated({ id: idSale })

      if (!forecastSales.requestInvalidate) {
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

      await ForecastService.invalidateSale({ id: idSale })

      return res.status(200).json(userId)
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
      const { id, idSale } = req.params

      const { id: userId } = req.user

      await ForecastRules.checkExistForecast({ id })

      const forecastSale = await ForecastRules.checkForecastSaleIsValidated({ id: idSale })

      if (forecastSale.canRemove) {
        throw {
          status: 409,
          error: "Already authorized removal of this sale!"
        }
      }

      await ForecastService.authorizeRemove({ id: idSale })

      return res.status(200).json(`Removal allowed by user ${userId}`)
    } catch (e) {
      console.log(e)

      let status = e.status ? e.status : 400
      let error = e.error ? e.error : e

      return res.status(status).json(error)
    }
  }
}