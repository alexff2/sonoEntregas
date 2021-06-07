const Sales = require('../models/Sales')
const SalesProd = require('../models/SalesProd')

module.exports = {
  async index( req, res ){
    try {
      
      const sales = await Sales.findSome(0, `STATUS = 'Enviado'`)

      for (let i = 0; i < sales.length; i++) {
        var products = await SalesProd.findSome(0, `ID_SALES = ${sales[i].ID_SALES} AND CODLOJA = ${sales[i].CODLOJA}`)
        sales[i]["products"] = products
      }

      return res.json(sales)
    } catch (error) {
      return res.status(400).json(error)
    }
  }
}