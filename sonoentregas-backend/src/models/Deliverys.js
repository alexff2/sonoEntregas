const Model = require('../databases/MSSQL/Model')

class Deliverys extends Model {
  constructor(){
    super('DELIVERYS', 'ID, DESCRIPTION, ID_CAR, ID_DRIVER, ID_ASSISTANT, STATUS, ID_USER_MOUNT, ID_USER_DELIVERING, ID_USER_DELIVERED, D_PREVISION')
  }
}

module.exports = new Deliverys() 