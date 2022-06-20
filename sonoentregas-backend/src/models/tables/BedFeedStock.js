const Model = require('../../databases/MSSQL/Model')

class BedFeedStock extends Model {
  constructor(){
    super('BED_FEED', 'ID, ID_FEED')
  }
}

module.exports = new BedFeedStock()