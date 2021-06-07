const Model = require('../databases/MSSQL/Model')

class Empresa extends Model {
  constructor(){
    super('EMPRESA', 'CODIGO, NOME, RAZAO, CGC, INSC')
  }
}

module.exports = new Empresa()