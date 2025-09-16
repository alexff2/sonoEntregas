const Goals = require('../models/tables/Goals')

const GoalService = require('../services/GoalService')

module.exports = {
  async findByYear(req, res) {
    const { year, storeId } = req.query

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
      const { storeId, month, year, value_1, value_2, value_3 } = req.body
      const { id: user_id } = req.user

      if (!storeId) throw { status: 400, error: 'storeId não informado' }
      if (!month) throw { status: 400, error: 'month não informado' }
      if (!year) throw { status: 400, error: 'year não informado' }
      if (!value_1) throw { status: 400, error: 'value_1 não informado' }
      if (isNaN(value_1)) throw { status: 400, error: 'value_1 inválido' }
      if (!value_2) throw { status: 400, error: 'value_2 não informado' }
      if (isNaN(value_2)) throw { status: 400, error: 'value_2 inválido' }
      if (!value_3) throw { status: 400, error: 'value_3 não informado' }
      if (isNaN(value_3)) throw { status: 400, error: 'value_3 inválido' }

      const goals = await GoalService.createGoalsIfNotExists(storeId, month, year, { value_1, value_2, value_3 }, user_id)

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
      const { value_1, value_2, value_3 } = req.body
      const { id: user_id } = req.user
      const { id } = req.params

      if (!value_1) throw { status: 400, error: 'value_1 não informado' }
      if (!value_2) throw { status: 400, error: 'value_2 não informado' }
      if (!value_3) throw { status: 400, error: 'value_3 não informado' }

      const goals = await GoalService.valueUpdate(id, { value_1, value_2, value_3 }, user_id)

      return res.status(200).json(goals)
    } catch (e) {
      console.log(e)

      let status = e.status ? e.status : 400
      let error = e.error ? e.error : e

      return res.status(status).json(error)
    }
  },
}
