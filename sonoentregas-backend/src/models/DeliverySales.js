const Model = require('../databases/MSSQL/Model')

class DeliverySales extends Model {
  constructor(){
    super('DELIVERYS_SALES', 'ID_DELIVERY, CODLOJA, ID_SALE')
  }
}

module.exports = new DeliverySales() 