const Model = require('../../databases/MSSQL/Model')

class ProductsSold extends Model {
  constructor(){
    super('PRODUCTS_SOLD', 'idShop, idSale, idSeller, item, issuance, idProduct, quantify, unitPrice1, unitPrice2, amount, discount, increase, purchasePrice, purchaseCost, netPrice, salePrice, deliveryStatus')
  }
}

module.exports = new ProductsSold()
