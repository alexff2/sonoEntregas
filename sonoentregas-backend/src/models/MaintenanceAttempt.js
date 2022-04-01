const Model = require('../databases/MSSQL/Model')

class MaintenanceAttempt extends Model {
  constructor(){
    super('MAINTENANCE_ATTEMPT', 'ID, ID_MAIN, CHANGE_PRODUCT, D_MOUNTING, D_PROCESS, D_MAINTENANCE,DONE, REASON_RETURN, ID_DRIVER, ID_ASSISTANT, ID_DELIV_MAIN')
  }
}

module.exports = new MaintenanceAttempt()