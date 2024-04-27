const Model = require('../databases/MSSQL/Model')

class ShopsSce extends Model {
  constructor(){
    super('EMPRESA', 'CODIGO, NOME, RAZAO, CGC, INSC')
  }
}

module.exports = new ShopsSce()
