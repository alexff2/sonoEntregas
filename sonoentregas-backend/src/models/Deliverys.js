const Model = require('../databases/MSSQL/Model')

class Deliverys extends Model {
  constructor(){
    super('DELIVERYS', 'ID, DESCRIPTION, ID_CAR, ID_DRIVER, ID_ASSISTANT, STATUS')
  }
}

module.exports = new Deliverys() 