const Model = require('../databases/MSSQL/Model')

class SalesProd extends Model {
  constructor(){
    super('VIEW_SALES_PROD', '*')
  }
}

module.exports = new SalesProd()