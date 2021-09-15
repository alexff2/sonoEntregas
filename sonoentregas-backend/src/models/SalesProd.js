const Model = require('../databases/MSSQL/Model')

class SalesProd extends Model {
  constructor(){
    super('SALES_PROD', 'ID_SALES, CODLOJA, CODPRODUTO, COD_ORIGINAL, DESCRICAO, QUANTIDADE, UNITARIO1, DESCONTO, NVTOTAL, STATUS')
  }
}

module.exports = new SalesProd()