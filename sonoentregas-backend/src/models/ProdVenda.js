const Model = require('../databases/MSSQL/Model')

class ProdVenda extends Model {
  constructor(){
    super('VIEW_NVENDI2', 'NUMVENDA, CODPRODUTO, COD_ORIGINAL, DESCRICAO, QUANTIDADE, UNITARIO1, DESCONTO, NVTOTAL')
  }
}

module.exports = new ProdVenda()