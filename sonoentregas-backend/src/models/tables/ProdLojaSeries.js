const Model = require('../../databases/MSSQL/Model')

class ProdLojaSeries extends Model {
  constructor(){
    super('PRODLOJAS_SERIES', 'id, productId, dateEntered, moduleEntered, dateIsOut, moduleIsOut')
  }
}

module.exports = new ProdLojaSeries()
