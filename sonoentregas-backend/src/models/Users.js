const Model = require('../databases/MSSQL/Model')

class Users extends Model {
  constructor(){
    super('USERS', 'ID, CODLOJA, DESCRIPTION, ACTIVE, OFFICE, PASSWORD, PRE_REG')
  }
}

module.exports = new Users()