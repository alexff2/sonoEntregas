const {
  issueDate,
  salesByDeliv,
  onTime,
  salesOpen
} = require('../services/dashboardService')

module.exports = {
  async index( req, res ){
    const { datesearch } = req.params

    const issue = await issueDate(datesearch)

    const { delivArray, salesArray } = await salesByDeliv(issue)

    const { delivTot, delivOnTime, delivLate, percDelivOnTime } = await onTime(issue)

    const salesOpenDatas = await salesOpen()

    return res.json({ 
      issue,
      delivArray,
      salesArray,
      delivTot,
      delivOnTime,
      delivLate,
      percDelivOnTime,
      salesOpenDatas
    })
  }
}