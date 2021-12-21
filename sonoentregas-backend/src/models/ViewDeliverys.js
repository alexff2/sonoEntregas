const Model = require('../databases/MSSQL/Model')

class Deliverys extends Model {
  constructor(){
    super('VIEW_DELIVERYS', 'ID, DESCRIPTION, CAR, DRIVER, ASSISTANT, PLATE, STATUS,D_DELIVERED')
  }
}

module.exports = new Deliverys() 