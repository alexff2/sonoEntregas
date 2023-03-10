const Model = require('../../../databases/MSSQL/Model')

class ForecastSales extends Model {
  constructor(){
    super('FORECAST_SALES', 'id, idForecast, idSale, idUserCreate, idUserUpdate, contact, validationStatus, dateValidation, obs, canInvalidate, invalidationObs, canRemove, createdAt')
  }
}

module.exports = new ForecastSales()