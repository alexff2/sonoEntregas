const Model = require('../databases/MSSQL/Model')

class ViewMainAttempt extends Model {
  constructor(){
    super('VIEW_MAIN_ATTEMPT', '*')
  }
}

module.exports = new ViewMainAttempt()