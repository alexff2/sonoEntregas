<<<<<<< HEAD
const Model = require('../databases/MSSQL/Model')

class SalesProd extends Model {
  constructor(){
    super('SALES_PROD', 'ID_SALES, CODLOJA, CODPRODUTO, COD_ORIGINAL, DESCRICAO, QUANTIDADE, UNITARIO1, DESCONTO, NVTOTAL, STATUS, DOWN_EST, GIFT')
  }
}

=======
const Model = require('../databases/MSSQL/Model')

class SalesProd extends Model {
  constructor(){
    super('SALES_PROD', 'ID_SALES, CODLOJA, CODPRODUTO, COD_ORIGINAL, DESCRICAO, QUANTIDADE, UNITARIO1, DESCONTO, NVTOTAL, STATUS, DOWN_EST')
  }
}

>>>>>>> 7437dd52a52ac52662a9905c74b99cacf50dcad7
module.exports = new SalesProd()