const Goals = require('../models/tables/Goals')

const GoalService = require('../services/GoalService')

module.exports = {
  async findByYear(req, res) {
    const { year, storeId } = req.params

    try {
      const goals = await Goals.findAny(0, { year, store_id: storeId })

      if (goals.length === 0) {
        throw { status: 404, error: 'Nenhuma meta encontrada' }
      }

      return res.status(200).json(goals)
    } catch (e) {
      console.log(e)

      let status = e.status ? e.status : 400
      let error = e.error ? e.error : e

      return res.status(status).json(error)
    }
  },
  async create(req, res) {
    try {
      const { storeId, month, year, value } = req.body
      const { id: user_id } = req.user

      if (!storeId) throw { status: 400, error: 'storeId não informado' }
      if (!month) throw { status: 400, error: 'month não informado' }
      if (!year) throw { status: 400, error: 'year não informado' }
      if (!value) throw { status: 400, error: 'value não informado' }
      if (isNaN(value)) throw { status: 400, error: 'value inválido' }

      const goals = await GoalService.createGoalsIfNotExists(storeId, month, year, value, user_id)

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

      const goals = await GoalService.valueUpdate(id, value, user_id)

      return res.status(200).json(goals)
    } catch (e) {
      console.log(e)

      let status = e.status ? e.status : 400
      let error = e.error ? e.error : e

      return res.status(status).json(error)
    }
  },
}
