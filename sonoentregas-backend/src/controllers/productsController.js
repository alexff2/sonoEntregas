const ProductsService = require('../services/ProductsService')
const errorCath = require('../functions/error')

module.exports = {
  async index(req, res){
    const { typesearch, search } = req.params

    const where = {}
    where[typesearch] = search

    const productsSceCd = await ProductsService.findProductsSceCd(where)

    return res.json(productsSceCd)
  },
  async updateBarCode(request, response){
    try {
      const { barCode, code } = request.body

      await ProductsService.updateBarCode(barCode, code)
      
      return response.status(200).json(barCode)
    } catch (error) {
      errorCath(error, response)
    }
  },
  async findProduct(request, response) {
    try {
      const { search, type } = request.query

      const products = await ProductsService.findProduct(type, search)

      return response.status(200).json(products)
    } catch (error) {
      console.log(error)
      return response.status(400).json('Error')
    }
  }
}