const Model = require('../../../databases/MSSQL/Model')

class Forecast extends Model {
  constructor(){
    super('FORECAST', 'id, date, status, idUserCreated, idUserFinished, createdAt, updatedAt, description')
  }
}

module.exports = new Forecast()