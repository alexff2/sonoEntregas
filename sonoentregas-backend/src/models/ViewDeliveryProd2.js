const Model = require('../databases/MSSQL/Model')

class ViewDeliveryProd2 extends Model {
  constructor(){
    super('VIEW_DELIVERY_PROD2', 'ID_DELIVERY, ID_SALES, CODLOJA, CODPRODUTO, COD_ORIGINAL, DESCRICAO, QUANTIDADE, UNITARIO1, DESCONTO, NVTOTAL, STATUS, QTD_DELIV, D_MOUNTING, D_DELIVERING, D_DELIVERED, DELIVERED, REASON_RETURN')
  }
}

module.exports = new ViewDeliveryProd2()