const Model = require('../databases/MSSQL/Model')

class Deliverys extends Model {
  constructor(){
    super('VIEW_DELIVERYS', 'ID, DESCRIPTION, CAR, DRIVER, ASSISTANT, PLATE, STATUS, D_DELIVERED, ID_CAR, ID_DRIVER, ID_ASSISTANT')
  }
}

module.exports = new Deliverys() 