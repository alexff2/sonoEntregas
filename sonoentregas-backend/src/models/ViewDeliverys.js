const Model = require('../databases/MSSQL/Model')

class Deliverys extends Model {
  constructor(){
    super('VIEW_DELIVERYS', '*')
  }
}

module.exports = new Deliverys() 