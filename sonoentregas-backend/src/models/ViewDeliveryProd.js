const Model = require('../databases/MSSQL/Model')

class ViewDeliveryProd extends Model {
  constructor(){
    super('VIEW_DELIVERY_PROD', 'ID_DELIVERY, ID_SALES, CODLOJA, CODPRODUTO, COD_ORIGINAL, DESCRICAO, QUANTIDADE, UNITARIO1, DESCONTO, NVTOTAL, STATUS, QTD_DELIV, D_MOUNTING, D_DELIVERING, D_DELIVERED, DELIVERED')
  }
}

module.exports = new ViewDeliveryProd()