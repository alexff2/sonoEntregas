const { issueDate, salesByDate } = require('../services/dashboardService')

module.exports = {
  async index( req, res ){
    const { datesearch } = req.params

    const issue = await issueDate(datesearch)
    const sales = await salesByDate(issue)

    console.log(sales)
    return res.json(sales)
  }
}