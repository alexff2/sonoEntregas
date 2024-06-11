const PurchaseOrderService = require('../services/PurchaseOrderService')

module.exports = {
  async find(request, response) {
    try {
      const {type, search} = request.query

      const purchaseOrder = await PurchaseOrderService.findByCodeOrIssueOrOpen({
        code: type === 'code' ? search : '',
        issue: type === 'issue' ? search : ''
      })

      return response.status(200).json({ purchaseOrder })
    } catch (e) {
      console.log(e)

      let status = e.status ? e.status : 400
      let error = e.error ? e.error : e

      return response.status(status).json(error)
    }
  },
  async findOpen(_request, response){
    try {
      const purchaseOrder = await PurchaseOrderService.findByCodeOrIssueOrOpen({})

      return response.status(200).json({ purchaseOrder })
    } catch (e) {
      console.log(e)

      let status = e.status ? e.status : 400
      let error = e.error ? e.error : e

      return response.status(status).json(error)
    }
  },
  async findProducts(request, response) {
    try {
      const {id} = request.params

      const productsPurchaseOrder = await PurchaseOrderService.findProducts(id, 'ITEM')

      return response.status(200).json({ productsPurchaseOrder })
    } catch (e) {
      console.log(e)

      let status = e.status ? e.status : 400
      let error = e.error ? e.error : e

      return response.status(status).json(error)
    }
  },
  async create(_request, response){
    try {
      let purchaseOrder = await PurchaseOrderService.findByCodeOrIssueOrOpen({})

      if (purchaseOrder.length === 0) {
        purchaseOrder = await PurchaseOrderService.create()
      } else {
        purchaseOrder = purchaseOrder[0]
      }

      purchaseOrder['products'] = await PurchaseOrderService.findProducts(purchaseOrder.id, 'ITEM')

      return response.status(200).json({ 
        purchaseOrder
      })
    } catch (e) {
      console.log(e)

      let status = e.status ? e.status : 400
      let error = e.error ? e.error : e

      return response.status(status).json(error)
    }
  },
  async update(request, response){
    try {
      const { id } = request.params
      const { fieldToUpdate, value } = request.body

      await PurchaseOrderService.update(fieldToUpdate, value, id)

      return response.status(200).json('')
    } catch (e) {
      console.log(e)

      let status = e.status ? e.status : 400
      let error = e.error ? e.error : e

      return response.status(status).json(error)
    }
  },
  async addProduct(request, response){
    try {
      const { id } = request.params
      const {
        productId,
        productName,
        quantity,
        value
      } = request.body

      const purchaseOrder = await PurchaseOrderService.findByCodeOrIssueOrOpen({
        code: id
      })

      if (purchaseOrder.length === 0) {
        throw {
          status: 400,
          error: 'There is no such purchase order'
        }
      }

      const productsPurchaseOrder = await PurchaseOrderService.findProducts(id, 'ITEM')

      if (!!productsPurchaseOrder.find(prod => prod.code === productId)) {
        throw {
          status: 409,
          error: 'Product already added'
        }
      }

      const itemId = await PurchaseOrderService.addProduct({
        id,
        productId,
        productName,
        quantity,
        value
      })

      await PurchaseOrderService.updateValues(id)

      return response.status(201).json({ itemId })
    } catch (e) {
      console.log(e)

      let status = e.status ? e.status : 400
      let error = e.error ? e.error : e

      return response.status(status).json(error)
    }
  },
  async rmvProduct(request, response) {
    try {
      const { id, item } = request.params

      await PurchaseOrderService.rmvProduct({ id, item })

      await PurchaseOrderService.updateValues(id)

      return response.status(200).json('')
    } catch (e) {
      console.log(e)

      let status = e.status ? e.status : 400
      let error = e.error ? e.error : e

      return response.status(status).json(error)
    }
  },
  async changeQuantity(request, response) {
    try {
      const { id, item } = request.params
      const { quantity } = request.body

      await PurchaseOrderService.changeQuantity({
        id,
        item,
        quantity
      })

      await PurchaseOrderService.updateValues(id)

      return response.status(200).json('')
    } catch (e) {
      console.log(e)

      let status = e.status ? e.status : 400
      let error = e.error ? e.error : e

      return response.status(status).json(error)
    }
  },
  async close(request, response) {
    try {
      const { id } = request.params

      await PurchaseOrderService.close(id)

      return response.status(200).json('')
    } catch (e) {
      console.log(e)

      let status = e.status ? e.status : 400
      let error = e.error ? e.error : e

      return response.status(status).json(error)
    }
  },
  async open(request, response) {
    try {
      const { id } = request.params

      const purchaseOrderOpen = await PurchaseOrderService.findByCodeOrIssueOrOpen({})

      if (purchaseOrderOpen.length > 0) {
        throw {
          status: 409,
          error: 'There is already an open purchase order'
        }
      }

      await PurchaseOrderService.open(id)

      return response.status(200).json('')
    } catch (e) {
      console.log(e)

      let status = e.status ? e.status : 400
      let error = e.error ? e.error : e

      return response.status(status).json(error)
    }
  },
}
