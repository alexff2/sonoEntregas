const Model = require('../databases/MSSQL/Model')

class SalesProd extends Model {
  constructor(){
    super('VIEW_SALES_PROD', 'ID_SALES, CODLOJA, CODPRODUTO, COD_ORIGINAL, DESCRICAO, QUANTIDADE, UNITARIO1, DESCONTO, NVTOTAL, STATUS, DOWN_EST, QTD_DELIV')
  }
}

module.exports = new SalesProd()