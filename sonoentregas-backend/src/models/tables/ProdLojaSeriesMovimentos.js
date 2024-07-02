const Model = require('../../databases/MSSQL/Model')

class ProdLojaSeriesMovimentos extends Model {
  constructor(){
    super('PRODLOJAS_SERIES_MOVIMENTOS', 'id, productId, serialNumber, inputModule, inputModuleId, inputBeepDate, outputModule, outputModuleId, outputBeepDate')
  }
}

module.exports = new ProdLojaSeriesMovimentos()
