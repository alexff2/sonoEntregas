const Model = require('../../databases/MSSQL/Model')

class Bed extends Model {
  constructor(){
    super('SUB_PRODUCTS', 'ID, DESCRIPTION, EXPENSE')
  }
}

module.exports = new Bed()