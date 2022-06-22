const Model = require('../../databases/MSSQL/Model')

class Bed extends Model {
  constructor(){
    super('BED', 'ID, DESCRIPTION')
  }
}

module.exports = new Bed()