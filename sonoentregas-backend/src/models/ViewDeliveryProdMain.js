const Model = require('../databases/MSSQL/Model')

class ViewDeliveryProdMain extends Model {
  constructor(){
    super('VIEW_DELIVERY_PROD_MAIN', '*')
  }
}

module.exports = new ViewDeliveryProdMain()