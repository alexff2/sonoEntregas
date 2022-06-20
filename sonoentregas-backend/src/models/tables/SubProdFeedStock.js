const Model = require('../../databases/MSSQL/Model')

class BedFeedStock extends Model {
  constructor(){
    super('SUBPROD_FEED', 'ID_SUBPROD, ID_FEED')
  }
}

module.exports = new BedFeedStock()