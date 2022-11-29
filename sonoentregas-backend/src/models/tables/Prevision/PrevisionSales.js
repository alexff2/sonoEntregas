const Model = require('../../../databases/MSSQL/Model')

class PrevisionSales extends Model {
  constructor(){
    super('PREVISION_SALES', 'id, idPrevision, idSale, validationStatus, dateValidation, obs')
  }
}

module.exports = new PrevisionSales()