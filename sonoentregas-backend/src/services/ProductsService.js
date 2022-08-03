const ProductsSceCd = require('../models/ViewProdutos')

module.exports = {
  async findProducsSceCd(wheres){
    try {
      const products = ProductsSceCd.find({
        loja: 1,
        toCompare: 'LIKE',
        where: wheres
      })

      return products
    } catch (error) {
      console.log(error)
    }
  }
}
