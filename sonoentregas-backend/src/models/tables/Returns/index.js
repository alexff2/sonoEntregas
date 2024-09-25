const Model = require('../../../databases/MSSQL/Model')

class Returns extends Model {
  constructor(){
    super('RETURNS_SALES', 'id, dateSend, originalReturnId, shopId, originalSaleId, client, street, houseNumber, district, city, state, phone, status, deliveryId')
  }
}

module.exports = new Returns()