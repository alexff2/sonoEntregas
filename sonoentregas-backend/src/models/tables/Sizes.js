const Model = require('../../databases/MSSQL/Model')

class Sizes extends Model {
  constructor(){
    super('SIZES', 'ID , WIDTH, LENGTH')
  }
}

module.exports = new Sizes()