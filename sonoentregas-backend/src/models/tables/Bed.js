const Model = require('../../databases/MSSQL/Model')

class Bed extends Model {
  constructor(){
    super('BED', 'ID, DESCRIPTION, RECIPE, TYPE')
  }
}

module.exports = new Bed()