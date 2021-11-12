const { salesByDate } = require('../services/dashboardService')

module.exports = {
  async index( req, res ){
    const { datesearch } = req.params

    const sales = await salesByDate(datesearch)

    return res.json(sales)
  }
}