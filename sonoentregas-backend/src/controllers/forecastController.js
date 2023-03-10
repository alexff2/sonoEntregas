//@ts-check

const ForecastService = require('../services/ForecastService')
const ForecastsRules = require('../rules/forecastRules')

module.exports = {
  /**
   * @param {any} req
   * @param {any} res
   */
  async findCreatedForecast(req, res){
    try {
      const forecast = await ForecastService.findForecast('created')

      return res.status(200).json(forecast)
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
  async findFinishedForecast(req, res){
    try {
      const { typeSearch, search } = req.query

      const forecast = await ForecastService.findForecast({ typeSearch, search })

      return res.status(200).json(forecast)
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
  async create(req, res){
    try {
      const { dateForecast, sales } = req.body
      const { id: userId } = req.user

      if (!dateForecast || !sales) {
        throw {
          status: 400,
          error: {
            message: 'Enter the forecast date in month(2 char)/day(2 char)/year(4 char) format and sales in an array of objects'
          }
        }
      }

      //Business Rules
      await ForecastsRules.checkDateInsertForecast({ dateForecast })

      await ForecastsRules.checkForecastSalesIsClosed(sales)

      await ForecastsRules.checkStatusProduct(sales)

      // Process
      const idForecast = await ForecastService.createForecast({
        userId,
        dateForecast
      })

      await ForecastService.createSalesForecast({
        sales,
        idForecast,
        userId
      })

      return res.status(201).json(idForecast)
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
  async started(req, res){
    try {
      const { id } = req.params
      const { id: userId } = req.user

      const forecast = await ForecastsRules.checkExistValidForecast({ id })

      if (forecast.status) {
        throw {
          status: 409,
          error:{
            message: 'Previously started forecast, check current status!'
          }
        }
      }

      await ForecastService.startedForecast({ id })

      return res.status(201).json('Forecast started by user '+ userId)
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
  async addSale(req, res){
    try {
      const { id } = req.params
      const { sales } = req.body
      const { id: userId } = req.user

      if (!sales) {
        throw {
          status: 400,
          error: {
            message: 'Enter forecast id and current and new sales in arrays of different objects!'
          }
        }
      }

      await ForecastsRules.checkExistValidForecast({ id })

      await ForecastsRules.checkForecastSalesIsClosed(sales)

      await ForecastsRules.checkStatusProduct(sales)

      await ForecastService.createSalesForecast({
        sales,
        userId,
        idForecast: id
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
  async rmvSale(req, res){
    try {
      const { id } = req.params
      const { id: userId } = req.user

      const forecastSale = await ForecastsRules.checkForecastSaleIsValidated({ id })

      if (!forecastSale.canRemove) {
        throw {
          status: 409,
          error: 'Not permission to sale remove!'
        }
      }

      await ForecastService.deleteSaleForecast({ forecastSale })

      return res.status(200).json(`Deleted by user ${userId}`)
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
  async finishForecast(req, res){
    try {
      const { id } = req.params
      const { id: userId } = req.user

      const forecast = await ForecastsRules.checkExistForecast({ id })

      if (forecast.status) {
        throw {
          status: 409,
          error:{
            message: 'Previously started forecast, check current status!'
          }
        }
      }

      await ForecastsRules.checkForecastSaleIsValidatedToFinish({ id })

      await ForecastsRules.checkForecastProductStatus({ id })

      await ForecastService.finishForecastService({ id })

      return res.status(200).json(`Finish by user ${userId}`)
    } catch (e) {
      console.log(e)

      let status = e.status ? e.status : 400
      let error = e.error ? e.error : e

      return res.status(status).json(error)
    }
  }
}