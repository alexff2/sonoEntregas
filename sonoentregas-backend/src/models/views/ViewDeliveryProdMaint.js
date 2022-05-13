const Model = require('../../databases/MSSQL/Model')

class ViewDeliveryProdMaint extends Model {
  constructor(){
    super('VIEW_DELIVERY_PROD_MAINT', '*')
  }
}

module.exports = new ViewDeliveryProdMaint()