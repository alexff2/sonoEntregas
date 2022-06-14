const Sales = require('../models/Sales')
const ViewSalesProd = require('../models/ViewSalesProd')

module.exports = {
  async findSales(status, where) {
    var sales
    where !== 'false' ?
      sales = await Sales.findSome(0, `STATUS = '${status}' AND ${where}`):
      sales = await Sales.findSome(0, `STATUS = '${status}'`)

    var idSale = ''

    for (let i = 0; i < sales.length; i++){
      if ( i === 0 ){
        idSale+= sales[i].ID_SALES
      } else {
        idSale+= `, ${sales[i].ID_SALES}`
      }
    }

    const viewSalesProd = await ViewSalesProd.findSome(0, `ID_SALES IN (${idSale})`)

    sales.forEach(sale => {
      sale["products"] = []

      viewSalesProd.forEach(saleProd => {
        saleProd['checked'] = false
        if (sale.ID_SALES === saleProd.ID_SALES && sale.CODLOJA === saleProd.CODLOJA) {
          sale.products.push(saleProd)
        }
      })
    })
    return { sales }
  }
}