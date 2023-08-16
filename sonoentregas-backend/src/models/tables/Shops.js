const Model = require('../../databases/MSSQL/Model')

class Shops extends Model {
  constructor(){
    super('LOJAS', 'CODLOJA, DESCRICAO, DESC_ABREV, FULL_NAME')
  }
}

module.exports = new Shops()