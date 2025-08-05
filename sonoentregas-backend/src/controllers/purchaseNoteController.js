const errorCath = require("../functions/error")
const PurchaseNoteModel = require("../models/tables/PurchaseNote")
const PurchaseNoteService = require("../services/PurchaseNoteService")

module.exports = {
  async find(request, response) {
    try {
      const { typeSearch, search } = request.query

      let purchaseNotes = []

      if (search.length > 0) {
        purchaseNotes = await PurchaseNoteService.find({
          typeSearch,
          search
        })
      }

      return response.json({ purchaseNotes })
    } catch (e) {
      console.log(e)

      let status = e.status ? e.status : 400
      let error = e.error ? e.error : e

      return response.status(status).json(error)
    }
  },
  async findProducts(request, response) {
    try {
      const { id } = request.params

      const purchaseNoteProducts = await PurchaseNoteService.findProducts({ id })

      return response.json({ purchaseNoteProducts })
    } catch (e) {
      console.log(e)

      let status = e.status ? e.status : 400
      let error = e.error ? e.error : e

      return response.status(status).json(error)
    }
  },
  async findToBeep(request, response) {
    try {
      const {id} = request.params

      const products = await PurchaseNoteService.findToBeep(id)

      return response.json({products})
    } catch (error) {
      errorCath(error, response)
    }
  },
  async findProductToBeep(request, response) {
    try {
      const {id, idProduct} = request.params

      const product = await PurchaseNoteService.findProductToBeep(id, idProduct)

      return response.json({product})
    } catch (error) {
      errorCath(error, response)
    }
  },
  async updateId(request, response) {
    const { sequelize, transaction } = await PurchaseNoteModel._query(1)
    try {
      const { id } = request.params
      const { newId } = request.body

      await PurchaseNoteService.updateId({
        newId,
        oldId: id,
        t: { sequelize, transaction }
      })

      await transaction.commit()
      return response.json('updated')
    } catch (error) {
      await transaction.rollback()

      errorCath(error, response)
    }
  }
}
