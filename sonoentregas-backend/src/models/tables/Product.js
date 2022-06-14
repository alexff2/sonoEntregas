const Model = require('../../databases/MSSQL/Model')

class Products extends Model {
  constructor(){
    super('PRODUCTS', 'ID, DESCRIPTION, EXPENSE, VALUE')
  }
}

module.exports = new Products()