const Model = require('../databases/MSSQL/Model')

class DeliveryProd extends Model {
  constructor(){
    super('DELIVERYS_PROD', 'ID_DELIVERY, ID_SALE, CODLOJA, COD_ORIGINAL, D_MOUNTING, D_DELIVERING, D_DELIVERED, DELIVERED')
  }
}

module.exports = new DeliveryProd() 