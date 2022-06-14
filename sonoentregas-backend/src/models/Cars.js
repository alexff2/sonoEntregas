const Model = require('../databases/MSSQL/Model')

class Cars extends Model {
  constructor(){
    super('CARS', 'ID, DESCRIPTION, PLATE, MODEL')
  }
}

module.exports = new Cars() 