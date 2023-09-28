const Model = require('../../databases/MSSQL/Model')

class ProductsPromotion extends Model {
  constructor(){
    super('PRODUCTS_PROMOTIONS', 'idPromotion, idProduct, pricePromotion')
  }
}

module.exports = new ProductsPromotion()