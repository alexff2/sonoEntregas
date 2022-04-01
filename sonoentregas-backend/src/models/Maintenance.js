const Model = require('../databases/MSSQL/Model')

class Maintenance extends Model {
  constructor() {
    super('MAINTENANCE', 'ID, ID_DELIVERY, CODLOJA, ID_SALE, COD_ORIGINAL, QUANTIDADE, STATUS, OBS, D_ENVIO, D_PREV')
  }
}

module.exports = new Maintenance()