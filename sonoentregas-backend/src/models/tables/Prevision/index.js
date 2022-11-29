const Model = require('../../../databases/MSSQL/Model')

class Prevision extends Model {
  constructor(){
    super('PREVISION', 'id, date, status, idUserCreated, idUserFinished, createdAt, updateAt')
  }
}

module.exports = new Prevision()