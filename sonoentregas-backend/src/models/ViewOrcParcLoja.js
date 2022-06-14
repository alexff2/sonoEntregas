const Model = require('../databases/MSSQL/Model')

class OrcParc extends Model {
  constructor(){
    super('VIEW_ORCPARCLOJA', 'TITULO, PARCELA, VENCIMENTO, VALOR, FORMPAGTO')
  }
}

module.exports = new OrcParc() 