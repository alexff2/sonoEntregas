const { QueryTypes } = require('sequelize')

const Sales = require('../models/Sales')
const SalesProd = require('../models/SalesProd')

module.exports = {
  async index( req, res ){
    try {
      const { typesearch, search, status } = req.params

      var sales

      if (typesearch === 'NOMECLI') {
        sales = await Sales.findSome(0, `${typesearch} LIKE '${search}%' and STATUS = '${status}'`)
      } else if (typesearch === 'false') {
        sales = await Sales.findSome(0, `STATUS = '${status}'`)
      } else {
        sales = await Sales.findSome(0, `${typesearch} = '${search}' and STATUS = '${status}'`)
      }
      
      for (let i = 0; i < sales.length; i++) {
        var products = await SalesProd.findSome(0, `ID_SALES = ${sales[i].ID_SALES} AND CODLOJA = ${sales[i].CODLOJA}`)
        sales[i]["products"] = products
      }
      
      return res.json(sales)
    } catch (error) {
      return res.status(400).json(error)
    }
  },
  async findSalesDetails(req, res){
    const { idsales, codloja, status } = req.params
    
    const detals = await Sales._query(0, `select b.* from DELIVERYS_SALES a inner join DELIVERYS b on a.ID_DELIVERY = b.ID where a.ID_SALE = ${idsales} and a.CODLOJA = ${codloja} and STATUS = '${status}'`, QueryTypes.SELECT)
    
    return res.json(detals)
  },
  async findProductSale(req, res){
    const { idSale, codloja } = req.params

    var products = await SalesProd.findSome(0, `ID_SALES = ${idSale} AND CODLOJA = ${codloja}`)

    return res.json(products)
  }
}