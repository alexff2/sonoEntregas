const Model = require('../../databases/MSSQL/Model')

class MaintenanceDeliv extends Model {
  constructor(){
    super('MAINTENANCE_DELIV', 'ID, ID_MAINT, D_MOUNTING, D_DELIVING, D_DELIVERED, DONE, REASON_RETURN, ID_DRIVER, ID_ASSISTANT, ID_DELIV_MAIN, ID_USER, OBS')
  }
}

module.exports = new MaintenanceDeliv()