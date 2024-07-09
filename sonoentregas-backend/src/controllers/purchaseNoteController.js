const errorCath = require("../functions/error")
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
  }
}
