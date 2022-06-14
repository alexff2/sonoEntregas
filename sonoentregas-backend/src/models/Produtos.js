const Model = require('../databases/MSSQL/Model')

class Produtos extends Model {
  constructor(){
    super('PRODLOJAS', 'CODIGO, EST_ATUAL, EST_LOJA')
  }
}

module.exports = new Produtos()