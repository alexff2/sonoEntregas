const Model = require('../databases/MSSQL/Model')

class ProdutosSce extends Model {
  constructor(){
    super('PRODUTOS', 'CODIGO, NOME, ALTERNATI, APLICACAO')
  }
}

module.exports = new ProdutosSce()