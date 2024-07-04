//@ts-check
const TransferOfProductsServices = require('../services/TransferOfProductsServices')
const TransferOfProductsModel = require('../models/tables/TransferOfProducts')
const TransferOfProductRules = require('../rules/TransferOfProductRules')

module.exports = {
  async findToBeep(request, response) {
    const { id } = request.params

    try {
      const products = await TransferOfProductsServices.findToBeep(id)

      return response.json({ products })
    } catch (e) {
      console.log(e)

      let status = e.status ? e.status : 400
      let error = e.error ? e.error : e

      return response.status(status).json(error)
    }
  },
  async find(request, response) {
    const { search, type } = request.query

    try {
      const transfers = await TransferOfProductsServices.find(type, search, null)

      return response.json(transfers)
    } catch (e) {
      console.log(e)

      let status = e.status ? e.status : 400
      let error = e.error ? e.error : e

      return response.status(status).json(error)
    }
  },
  async create(request, response) {
    const { sequelize, transaction } = await TransferOfProductsModel._query(1)

    try {
      const { transferRequest } = request.body
      const { id: userId } = request.user

      await TransferOfProductRules.toCreate(transferRequest)

      const transferOfProduct = await TransferOfProductsServices.create(
        transferRequest,
        userId,
        {
          sequelize,
          transaction
        }
      )

      await transaction.commit()
      return response.status(201).json(transferOfProduct)
    } catch (e) {
      await transaction.rollback()
      console.log(e)

      let status = e.status ? e.status : 400
      let error = e.error ? e.error : e

      return response.status(status).json(error)
    }
  },
  async update(request, response) {
    const { id } = request.params
    const { transferOfProductRequest } = request.body

    const { sequelize, transaction } = await TransferOfProductsModel._query(1)

    try {
      const transferOfProducts = await TransferOfProductsServices.update(
        transferOfProductRequest,
        id,
        {
          sequelize,
          transaction
        }
      )

      await transaction.commit()

      return response.json({ transferOfProducts })
    } catch (e) {
      console.log(e)

      let status = e.status ? e.status : 400
      let error = e.error ? e.error : e

      await transaction.rollback()
      return response.status(status).json(error)
    }
  },
  async addProduct(request, response){
    const { id } = request.params
    const { product } = request.body

    const transferOfProduct = await TransferOfProductsServices.find(
      'id',
      id,
      null
    )

    transferOfProduct[0].products = [product]

    const { sequelize, transaction } = await TransferOfProductsModel._query(1)
    try {
      await TransferOfProductsServices.addProducts(
        id,
        transferOfProduct[0],
        {
          sequelize,
          transaction
        }
      )
      await transaction.commit()

      return response.json()
    } catch (e) {
      await transaction.rollback()
      console.log(e)

      let status = e.status ? e.status : 400
      let error = e.error ? e.error : e

      return response.status(status).json(error)
    }
  },
  async rmvProduct(request, response){
    const { sequelize, transaction } = await TransferOfProductsModel._query(1)
    try {
      const { id, productId } = request.params

      const transferOfProduct = await TransferOfProductsServices.find(
        'id',
        id,
        {
          sequelize,
          transaction
        }
      )

      await TransferOfProductsServices.rmvProduct(
        id,
        productId,
        transferOfProduct[0].type,
        {
          sequelize,
          transaction
        }
      )
      await transaction.commit()

      return response.json({  })
    } catch (e) {
      await transaction.rollback()
      console.log(e)

      let status = e.status ? e.status : 400
      let error = e.error ? e.error : e

      return response.status(status).json(error)
    }
  },
  async delete(request, response){
    const { id } = request.params
    const { sequelize, transaction } = await TransferOfProductsModel._query(1)
    try {
      const transferOfProduct = await TransferOfProductsServices.find(
        'id',
        id,
        {
          sequelize,
          transaction
        }
      )
      await TransferOfProductsServices.delete(
        id,
        {
          sequelize,
          transaction
        },
        transferOfProduct[0]
      )
      await transaction.commit()

      return response.json({  })
    } catch (e) {
      await transaction.rollback()
      console.log(e)

      let status = e.status ? e.status : 400
      let error = e.error ? e.error : e
      return response.status(status).json(error)
    }
  },
}
