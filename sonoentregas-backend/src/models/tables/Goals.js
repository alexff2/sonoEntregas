const Model = require('../../databases/MSSQL/Model')

class Goals extends Model {
  constructor(){
    super('GOALS', 'id, idShop, monthYear, value, amountReached, amountReturns, idUserCreate, idUserUpdate, createdAt, updatedAt')
  }
}

module.exports = new Goals()