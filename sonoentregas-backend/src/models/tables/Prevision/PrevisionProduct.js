const Model = require('../../../databases/MSSQL/Model')

class PrevisionProduct extends Model {
  constructor(){
    super('PREVISION_PRODUCT', 'idPrevisionSale, idProduct')
  }
}

module.exports = new PrevisionProduct()