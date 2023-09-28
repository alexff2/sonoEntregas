const Goals = require('../models/tables/Goals')
const Shops = require('../models/tables/Shops')

const GoalService = require('../services/GoalService')

module.exports = {
  async index(req, res) {
    try {
      const goals = await Goals.findAll(0)

      if (goals.length === 0) {
        return res.status(200).json([])
      }

      const shops = await Shops.findAny(0, { in: {CODLOJA: goals.map(goal => goal.idShop)} })

      shops.forEach(shop => {
        shop['goals'] = goals.filter(goal => shop.CODLOJA === goal.idShop)
      })
      
      return res.status(200).json(shops)
    } catch (e) {
      console.log(e)

      let status = e.status ? e.status : 400
      let error = e.error ? e.error : e

      return res.status(status).json(error)
    }
  },
  async create(req, res) {
    try {
      const { idShop, monthYear, value } = req.body
      const { id: user_id } = req.user

      if (!idShop) throw { status: 400, error: 'idShop não informado' }
      if (!monthYear) throw { status: 400, error: 'monthYear não informado' }
      if (!value) throw { status: 400, error: 'value não informado' }

      const goals = await Goals.create(0, [{ idShop, monthYear, value, idUserCreate: user_id, idUserUpdate: user_id }])

      return res.status(200).json(goals)
    } catch (e) {
      console.log(e)

      let status = e.status ? e.status : 400
      let error = e.error ? e.error : e

      return res.status(status).json(error)
    }
  },
  async update(req, res) {
    try {
      const { value } = req.body
      const { id: user_id } = req.user
      const { id } = req.params

      if (!value) throw { status: 400, error: 'value não informado' }

      //Faltando updatedAt
      const goals = await Goals.updateAny(0, { value, idUserUpdate: user_id }, { id })

      return res.status(200).json(goals)
    } catch (e) {
      console.log(e)

      let status = e.status ? e.status : 400
      let error = e.error ? e.error : e

      return res.status(status).json(error)
    }
  },
  async getAmountReached(req, res) {
    try {
      const { idShop, monthYear } = req.query

      if (!idShop) throw { status: 400, error: 'idShop não informado' }
      if (!monthYear) throw { status: 400, error: 'monthYear não informado' }

      const amountReached = await GoalService.getAmountReached(idShop, monthYear)

      GoalService.updateAmounts(amountReached.amountReached, amountReached.amountReturns, idShop, monthYear)

      return res.status(200).json(amountReached)
    } catch (e) {
      console.log(e)

      let status = e.status ? e.status : 400
      let error = e.error ? e.error : e

      return res.status(status).json(error)
    }
  }
}
