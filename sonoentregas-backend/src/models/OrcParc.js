const Model = require('../databases/MSSQL/Model')

class OrcParc extends Model {
  constructor(){
    super('ORCPARC', 'ID_SALES, CODLOJA, PARCELA, VENCIMENTO, VALOR, FORMPAGTO')
  }
}

module.exports = new OrcParc() 