const {
  issueDate,
  salesByDeliv,
  onTime,
  salesOpen,
  salesByShop,
  salesEndDevFinish
} = require('../services/dashboardService')
const { salesDevInf } = require('../services/homeService')

module.exports = {
  async index( req, res ){
    const { datesearch } = req.params

    const issue = await issueDate(datesearch)

    const { delivArray, salesArray } = await salesByDeliv(issue)

    const { delivTot, delivOnTime, delivLate, percDelivOnTime } = await onTime(issue)

    const salesOpenDatas = await salesOpen()

    const dataSalesByShop = await salesByShop(issue)

    const { salesOnRelease, salesOnDelivring, devOnRelease, delivering } = await salesDevInf()

    const { devFinish, salesFinish } = await salesEndDevFinish(issue)

      return res.json({ 
      issue,
      delivArray,
      salesArray,
      delivTot,
      delivOnTime,
      delivLate,
      percDelivOnTime,
      salesOpenDatas,
      salesByShop: dataSalesByShop,
      salesDevInfos: {
        salesOnRelease,
        salesOnDelivring,
        devOnRelease,
        delivering,
        devFinish,
        salesFinish
      }
    })
  }
}