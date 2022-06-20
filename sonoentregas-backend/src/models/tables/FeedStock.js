const Model = require('../../databases/MSSQL/Model')

class FD extends Model {
  constructor(){
    super('FEEDSTOCK', 'ID, COD_SYS, DESCRIPTION, UND, VALUE')
  }
}
 module.exports = new FD()