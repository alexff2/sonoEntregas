//@ts-check
const TransferServices = require('../services/TransferServices')

module.exports = {
  async find(request, response) {
    const { search, type } = request.query

    try {
      const transfers = await TransferServices.find(type, search)

      return response.status(200).json(transfers)
    } catch (error) {
      console.log(error)
      return response.status(400).json('Error')
    }
  },
  async create(request, response) {
    try {
      const body = request.body
      const { id: userId } = request.user

      const idCreate = await TransferServices.create(body, userId)

      await TransferServices.createTransferProduct(idCreate, body.products)

      const transfers = await TransferServices.find('code', idCreate)

      return response.status(201).json(transfers[0])
    } catch (error) {
      console.log(error)

      return response.status(400).json('Error')
    }
  },
  async findProduct(request, response) {
    try {
      const { search, type } = request.query

      const products = await TransferServices.findProduct(type, search)

      return response.status(200).json(products)
    } catch (error) {
      console.log(error)
      return response.status(400).json('Error')
    }
  }
}
