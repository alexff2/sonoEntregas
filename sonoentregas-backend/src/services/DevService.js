const ViewDeliverySales = require('../models/ViewDeliverySales')
const ViewDeliveryProd = require('../models/ViewDeliveryProd')

module.exports = {
  async findDev( deliverys ) {
    for (let i = 0; i < deliverys.length; i++) {
      var sales = await ViewDeliverySales.findSome(0, `ID_DELIVERY = ${deliverys[i].ID}`)
      
      for (let j = 0; j < sales.length; j++) {
        var products = await ViewDeliveryProd.findSome(0, `ID_DELIVERY = ${sales[j].ID_DELIVERY} AND ID_SALES = ${sales[j].ID_SALES} AND CODLOJA = ${sales[j].CODLOJA}`)

        sales[j]['products'] = products
      }

      deliverys[i]['sales'] = sales 
    }
    return deliverys
  }
}