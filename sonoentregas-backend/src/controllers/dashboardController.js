//@ts-check

const {
  issueDate,
  salesByDelivery,
  onTime,
  salesOpen,
  salesByShop,
  salesEndDevFinish
} = require('../services/dashboardService')
const { salesDevInf } = require('../services/homeService')

module.exports = {
  async index( req, res ){
    const { dateSearch } = req.params

    const issue = await issueDate(dateSearch)

    const { deliveriesArray, salesArray } = await salesByDelivery(issue)

    const { deliveryTot, deliveryOnTime, deliveryLate, percentageDeliveryOnTime } = await onTime(issue)

    const salesOpenDatas = await salesOpen()

    const dataSalesByShop = await salesByShop(issue)

    const { salesOnRelease, salesOnDelivering, devOnRelease, delivering } = await salesDevInf()

    const { devFinish, salesFinish } = await salesEndDevFinish(issue)

      return res.json({ 
      issue,
      deliveriesArray,
      salesArray,
      deliveryTot,
      deliveryOnTime,
      deliveryLate,
      percentageDeliveryOnTime,
      salesOpenDatas,
      salesByShop: dataSalesByShop,
      salesDevInfos: {
        salesOnRelease,
        salesOnDelivering,
        devOnRelease,
        delivering,
        devFinish,
        salesFinish
      }
    })
  }
}