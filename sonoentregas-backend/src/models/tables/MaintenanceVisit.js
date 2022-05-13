const Model = require('../../databases/MSSQL/Model')

class MaintenanceVisit extends Model {
  constructor(){
    super('MAINTENANCE_VISIT', 'ID_MAIN, DATE_PREV, HOURS_PREV, ID_USER')
  }
}

module.exports = new MaintenanceVisit()