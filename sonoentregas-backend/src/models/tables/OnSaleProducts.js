const Model = require('../../databases/MSSQL/Model')

class OnSaleProducts extends Model {
  constructor(){
    super('ONSALES_PRODUCTS', 'idOnSale, COD_ORIGINAL, valueOnSales')
  }
}

module.exports = new OnSaleProducts()