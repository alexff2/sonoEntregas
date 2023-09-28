const PromotionService = require('../services/PromotionService')
const PromotionRules = require('../rules/PromotionRules')

module.exports = {
  async promotionOpen(request, response){
    try {
      const promotion = await PromotionService.promotionsOpen()

      return response.status(200).json(promotion)
    } catch (e) {
      console.log(e)

      let status = e.status ? e.status : 400
      let error = e.error ? e.error : e

      return res.status(status).json(error)
    }
  },
  async create(require, response) {
    try {
      const { description, dateStart, dateFinish, products } = require.body
      const { id: user_id } = require.user

      if (!description) throw { status: 400, error: 'description não informado' }
      if (!dateStart) throw { status: 400, error: 'dateStart não informado' }
      if (!dateFinish) throw { status: 400, error: 'dateFinish não informado' }
      if (!products || products.length === 0) throw { status: 400, error: 'products não informado' }

      await PromotionRules.validateDates(dateStart, dateFinish, products)
  
      const promotion = await PromotionService.create({ description, dateStart, dateFinish, products, idUser: user_id })

      return response.status(200).json(promotion)
    } catch (e) {
      console.log(e)

      let status = e.status ? e.status : 400
      let error = e.error ? e.error : e

      return response.status(status).json(error)
    }
  }
}
