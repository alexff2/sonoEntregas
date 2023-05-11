const Model = require('../databases/MSSQL/Model')

class ViewDeliveryProd extends Model {
  constructor(){
    super('VIEW_DELIVERY_PROD', '*')
  }
}

module.exports = new ViewDeliveryProd()