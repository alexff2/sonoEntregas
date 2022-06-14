const ViewDeliverySales = require('../models/ViewDeliverySales')
const ViewDeliveryProd2 = require('../models/ViewDeliveryProd2')

module.exports = {
  async findSalesDev( deliverys ) {
    try {
      if (deliverys.length > 0) {
        var idDeliv = ''

        for (let i = 0; i < deliverys.length; i++){
          if ( i === 0 ){
            idDeliv+= deliverys[i].ID
          } else {
            idDeliv+= `, ${deliverys[i].ID}`
          }
        }

        var sales = await ViewDeliverySales.findSome(0, `ID_DELIVERY IN (${idDeliv})`)

        const vDelivProd2 = await ViewDeliveryProd2.findSome(0, `ID_DELIVERY IN (${idDeliv})`)

        deliverys.forEach(delivery => {
          delivery['sales'] = []

          sales.forEach(sale => {

            sale["products"] = []

            vDelivProd2.forEach(saleProd => {
              if (sale.ID_SALES === saleProd.ID_SALES && sale.CODLOJA === saleProd.CODLOJA && saleProd.ID_DELIVERY === sale.ID_DELIVERY) {
                sale.products.push(saleProd)
              }
            })

            if (sale.ID_DELIVERY === delivery.ID) {
              delivery.sales.push(sale)
            }
          })
        })

        return deliverys
      } else {
        return []
      }
    } catch (error) {
      console.log(error)
    }
  }
}