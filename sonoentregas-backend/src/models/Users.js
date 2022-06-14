const Model = require('../databases/MSSQL/Model')

class Users extends Model {
  constructor(){
    super('USERS', 'ID, CODLOJA, DESCRIPTION, ACTIVE, OFFICE, PASSWORD')
  }
}

module.exports = new Users()