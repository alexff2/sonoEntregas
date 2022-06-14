const Model = require('../../databases/MSSQL/Model')

class ProdFeedStock extends Model {
  constructor(){
    super('PRODUCTS_FEED', 'ID, ID_FEED')
  }
}

module.exports = new ProdFeedStock()