const Model = require('../../databases/MSSQL/Model')

class MaintenanceDeliv extends Model {
  constructor(){
    super('MAINTENANCE_DELIV', 'ID, ID_MAINT, DONE, REASON_RETURN, ID_DELIV_MAIN, ID_USER, NEW_KARDEX')
  }
}

module.exports = new MaintenanceDeliv()