const Model = require('../../databases/MSSQL/Model')

class Promotion extends Model {
  constructor(){
    super('PROMOTIONS', 'id, description, dateStart, dateFinish, idUserCreate, idUserUpdate, createdAt, updatedAt')
  }
}

module.exports = new Promotion()