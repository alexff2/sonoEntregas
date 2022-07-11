const Model = require('../../databases/MSSQL/Model')

class Sizes extends Model {
  constructor(){
    super('SIZES', 'ID, DESCRIPTION , WIDTH, HEIGHT, LENGTH, ACTIVE')
  }
}

module.exports = new Sizes()