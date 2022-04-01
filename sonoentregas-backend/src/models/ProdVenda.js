const Model = require('../databases/MSSQL/Model')

class ProdVenda extends Model {
  constructor(){
    super('VIEW_NVENDI2', '*')
  }
}

module.exports = new ProdVenda()