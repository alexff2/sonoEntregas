const Model = require('../../databases/MSSQL/Model')

class ViewMaintenance extends Model {
  constructor(){
    super('VIEW_MAINTENANCE', '*')
  }
}

module.exports = new ViewMaintenance()