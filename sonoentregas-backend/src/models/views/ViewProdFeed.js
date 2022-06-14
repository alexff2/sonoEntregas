const Model = require('../../databases/MSSQL/Model')

class ProdFeedViewModel extends Model {
  constructor(){
    super('VIEW_PRODUCTS_FEED', '*')
  }
}

module.exports = new ProdFeedViewModel()