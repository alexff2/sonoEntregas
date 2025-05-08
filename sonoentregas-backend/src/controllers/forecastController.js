//@ts-check

const ForecastService = require('../services/ForecastService')
const ForecastsRules = require('../rules/forecastRules')
const ModelConnection = require('../databases/MSSQL/Model/index')

module.exports = {
  /**
   * @param {any} req
   * @param {any} res
   */
  async findForecastUnique(req, res){
    try {
      const { id } = req.params

      if (!id) {
        throw new Error('id not exist!')
      }

      const forecast = await ForecastService.findForecastById({ id })

      return res.status(200).json({ forecast })
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
  async findSalesOfForecast(req, res){
    try {
      const { id } = req.params

      if (!id) {
        throw new Error('id not exist!')
      }

      const sales = await ForecastService.findSalesForecast({ id })

      return res.status(200).json(sales)
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
  async findOpenForecast(req, res){
    try {
      const forecast = await ForecastService.findForecastOpen()

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
  async findCreatedForecast(req, res){
    try {
      const { codLoja, status } = req.query

      const where = {
        status
      }

      const forecast = await ForecastService.findForecast(status ? where : 'created', codLoja ? codLoja : false)

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
      const { date } = req.query

      const forecast = await ForecastService.findForecastClose({
        date,
        status: '0'
      })

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
      const { date, description } = req.body
      const { id: userId } = req.user

      await ForecastsRules.checkDateInsertForecast({ date })
      // Process
      const idForecast = await ForecastService.createForecast({
        userId,
        date,
        description,
      })

      return res.status(201).json({ idForecast })
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
  async update(req, res){
    try {
      const { id } = req.params
      const { date, description } = req.body

      await ForecastsRules.checkDateInsertForecast({ date })

      await ForecastsRules.checkExistForecast({ id })

      await ForecastService.updateForecast({
        id,
        date,
        description,
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
      const { sale } = req.body
      const { id: userId } = req.user

      if (!sale) {
        throw {
          status: 400,
          error: {
            message: 'Enter forecast id and current and new sales in arrays of different objects!'
          }
        }
      }

      await ForecastsRules.checkExistValidForecast({ id })

      await ForecastsRules.checkForecastSales(sale)

      !sale.ID_MAINTENANCE && await ForecastsRules.checkStatusProduct(sale)

      await ForecastsRules.checkAvailableStock(sale)

      await ForecastService.createSalesForecast({
        sale,
        userId,
        idForecast: id,
        add: true
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
    const modelConnection = new ModelConnection()
    const connectionEntrega = await modelConnection._query(0)

    try {
      const { id } = req.params
      const { id: userId } = req.user

      const forecast = await ForecastsRules.checkExistForecast({ id })

      if (forecast.status === null) {
        throw {
          status: 409,
          error:{
            message: 'Forecast with created status, not allowed to finalize!'
          }
        }
      }

      await ForecastsRules.checkForecastSaleIsValidatedToFinish({ id })

      await ForecastsRules.checkForecastIsDelivering({ id })

      await ForecastService.finishForecastService({ id }, connectionEntrega)
      connectionEntrega.transaction.commit()

      return res.status(200).json(`Finish by user ${userId}`)
    } catch (e) {
      console.log(e)
      if (connectionEntrega.transaction) {
        connectionEntrega.transaction.rollback()
      }

      let status = e.status ? e.status : 400
      let error = e.error ? e.error : e

      return res.status(status).json(error)
    }
  }
}