const Model = require('../../databases/MSSQL/Model')

class BedFeedViewModel extends Model {
  constructor(){
    super('VIEW_BED_FEED', '*')
  }
}

module.exports = new BedFeedViewModel()