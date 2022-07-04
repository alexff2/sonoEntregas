const Model = require('../../databases/MSSQL/Model')

class ViewFD extends Model {
  constructor(){
    super('VIEW_UND_FEED', '*')
  }
}

module.exports = new ViewFD()