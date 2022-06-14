const Model = require('../databases/MSSQL/Model')

class ViewDeliveryProd2 extends Model {
  constructor(){
    super('VIEW_DELIVERY_PROD2', '*')
  }
}

module.exports = new ViewDeliveryProd2()