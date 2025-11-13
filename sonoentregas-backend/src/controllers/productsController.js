const ProductsService = require('../services/ProductsService')
const ProductDetailsService = require('../services/ProductDetailsService')
const ProductUpdatePurchaseCost = require('../services/Products/UpdatePurchaseCost')
const errorCath = require('../functions/error')

module.exports = {
  async index(req, res){
    const { typeSearch, search } = req.query

    const where = {}
    where[typeSearch] = search

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

      if (search === '' || search === '%') {
        return response.status(200).json([])
      }

      const products = await ProductsService.findProduct(type, search, true)

      return response.status(200).json(products)
    } catch (error) {
      console.log(error)
      return response.status(400).json('Error')
    }
  },
  async findProductToBeepById(request, response) {
    try {
      const { originalId } = request.query

      const products = await ProductsService.findProductToBeepById(originalId)

      return response.status(200).json(products)
    } catch (error) {
      console.log(error)
      return response.status(400).json(error)
    }
  },
  async findStock(request, response) {
    try {
      const { typeSearch, search } = request.query

      const products = await ProductsService.findStock(typeSearch, search)

      return response.json({ products })
    } catch (error) {
      return errorCath(error, response)
    }
  },
  async details(request, response) {
    try {
      const {id} = request.params

      const productDetails = await ProductDetailsService.getProductDetails(id)

      return response.json({productDetails})
    } catch (error) {
      return errorCath(error, response)
    }
  },
  async updatePurchaseCost(request, response) {
    try {
      const { id } = request.params
      const { purchaseCost } = request.body
      await ProductUpdatePurchaseCost.execute(id, purchaseCost)
      return response.status(200).json({ message: 'Purchase cost updated successfully' })
    } catch (error) {
      errorCath(error, response)
    }
  }
}