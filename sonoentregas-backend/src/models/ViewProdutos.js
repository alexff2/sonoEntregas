const Model = require('../databases/MSSQL/Model')

class ViewProdutos extends Model {
  constructor(){
    super('VIEW_PROD_EST_RESERVA', 'CODIGO, COD_ORIGINAL, NOME, EST_ATUAL, EST_LOJA, EST_RESERVA, EST_DISPONIVEL')
  }
}

module.exports = new ViewProdutos()