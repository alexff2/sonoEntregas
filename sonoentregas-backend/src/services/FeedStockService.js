const FeedStock = require('../models/tables/FeedStock')

class FeedStockService {
  async findFeed(){
    const FdSk = await FeedStock.findAll(0)

    if (FdSk.length > 0) {
      FdSk.forEach(el => {
        el['nameClass'] = ''
      })
    }

    return FdSk
  }
}

module.exports = new FeedStockService()