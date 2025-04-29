const Model = require('../../../databases/MSSQL/Model')

class ForecastProduct extends Model {
  constructor(){
    super('FORECAST_PRODUCT', 'idForecastSale, COD_ORIGINAL, ID_MAINTENANCE')
  }
}

module.exports = new ForecastProduct()