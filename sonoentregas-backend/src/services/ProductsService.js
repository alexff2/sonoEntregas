const Product = require('../models/tables/Product')
const ViewProdFeed = require('../models/views/ViewProdFeed')

module.exports = {
  async findProd(){
    const Products = await Product.findAll(0)

    const prodFeed = await ViewProdFeed.findAll(0)

    if (Products.length > 0) {
      Products.forEach(product => {
        product['nameClass'] = ''
        product['prodsFeed'] = []

        prodFeed.forEach(prodFeed => {
          prodFeed.ID === product.ID && product.prodsFeed.push(prodFeed)
        })
      })
    }

    return Products
  }
}