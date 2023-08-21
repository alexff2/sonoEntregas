const Model = require('../../databases/MSSQL/Model')

class OnSale extends Model {
  constructor(){
    super('ONSALES', 'id, description, dateStart, dateFinish, idUserCreate, idUserUpdate, createdAt, updatedAt')
  }
}

module.exports = new OnSale()