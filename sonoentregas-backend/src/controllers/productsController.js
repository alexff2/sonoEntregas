const ProductsService = require('../services/ProductsService')

module.exports = {
  async index(req, res){
    const { typesearch, search } = req.params

    const where = {}
    where[typesearch] = search

    const productsSceCd = await ProductsService.findProducsSceCd(where)

    return res.json(productsSceCd)
  }
}