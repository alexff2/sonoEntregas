const Model = require('../databases/MSSQL/Model')

class Deliverys extends Model {
  constructor(){
    super('VIEW_DELIVERYS', 'ID, DESCRIPTION, CAR, DRIVER, ASSISTANT, PLATE, STATUS, D_DELIVERED, ID_CAR, ID_DRIVER, ID_ASSISTANT, USER_MOUNT, USER_DELIVERING, USER_DELIVERED')
  }
}

module.exports = new Deliverys() 