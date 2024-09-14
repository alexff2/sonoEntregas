const Model = require('../../../databases/MSSQL/Model')

class ReturnsProducts extends Model {
  constructor(){
    super('RETURNS_SALES_PRODUCTS', 'id, returnsSalesId, alternativeCode, quantity')
  }
}

module.exports = new ReturnsProducts()