const Model = require('../../databases/MSSQL/Model')

class Maintenance extends Model {
  constructor() {
    super('MAINTENANCE', 'ID, ID_DELIVERY, CODLOJA, ID_SALE, COD_ORIGINAL, QUANTIDADE, STATUS, WARRANTY, ID_CAT_DEF, OBS, D_ENVIO, D_PREV, ID_USER')
  }
}

module.exports = new Maintenance()