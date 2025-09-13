const Model = require('../../databases/MSSQL/Model')

class Goals extends Model {
  constructor(){
    super('GOALS', 'id, store_id, month, year, value, created_by, created_at, updated_by, updated_at')
  }
}

module.exports = new Goals()