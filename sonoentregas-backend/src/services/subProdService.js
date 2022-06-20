const SubProd = require('../models/tables/SubProducts')
const ViewSubProdFeed = require('../models/views/ViewSubProdFeed')

module.exports = {
  async findSubProd(){
    const SubProds = await SubProd.findAll(0)

    const subProdFeeds = await ViewSubProdFeed.findAll(0)

    if (SubProds.length > 0) {
      SubProds.forEach(subProd => {
        subProd['nameClass'] = ''
        subProd['subProdsFeed'] = []

        subProdFeeds.forEach(subProdFeed => {
          subProdFeed.ID === subProd.ID && subProd.subProdsFeed.push(subProdFeed)
        })
      })
    }

    return SubProds
  }
}