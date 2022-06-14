const Model = require('../../databases/MSSQL/Model')

class ViewFD extends Model {
  constructor(){
    super('UND_FEEDSTOCK', '*')
  }
}

module.exports = new ViewFD()