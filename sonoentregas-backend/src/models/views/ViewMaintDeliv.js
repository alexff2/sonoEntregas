const Model = require('../../databases/MSSQL/Model')

class ViewMaintDeliv extends Model {
  constructor(){
    super('VIEW_MAINT_DELIV', '*')
  }
}

module.exports = new ViewMaintDeliv()