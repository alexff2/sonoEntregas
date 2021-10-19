const Sales = require('../models/Sales')
const ViewSalesProd = require('../models/ViewSalesProd')
const ViewDeliveryProd = require('../models/ViewDeliveryProd')
const ViewDeliverys = require('../models/ViewDeliverys')

module.exports = {
  async index( req, res ){
    try {
      const { typesearch, search, status, codloja } = req.params

      var sales

      const whereCodloja = codloja !== 'false' ? ` AND CODLOJA = ${codloja}` : ''

      if (typesearch === 'NOMECLI') {
        sales = await Sales.findSome(0, `${typesearch} LIKE '${search}%'${whereCodloja}`)
      } else if (typesearch === 'false') {
        sales = await Sales.findSome(0, `STATUS = '${status}'`)
      } else if (typesearch === 'D_DELIVERED' || typesearch === 'D_MOUNTING') {
        const salesProd = await Sales._query(0, `SELECT ID_SALE FROM DELIVERYS_PROD WHERE ${typesearch} = '${search}'${whereCodloja}`)

        if (salesProd[0].length > 0 ) {
          var idSale = ''
  
          for (let i = 0; i < salesProd[0].length; i++){
            if ( i === 0 ){
              idSale+= salesProd[0][i].ID_SALE
            } else {
              idSale+= `, ${salesProd[0][i].ID_SALE}`
            }
          }
  
          sales = await Sales.findSome(0, `ID_SALES IN (${idSale})`)
        } else {
          sales = []
        }

      } else {
        sales = await Sales.findSome(0, `${typesearch} = '${search}'${whereCodloja}`)
      }
      
      for (let i = 0; i < sales.length; i++) {
        var products = await ViewSalesProd.findSome(0, `ID_SALES = ${sales[i].ID_SALES} AND CODLOJA = ${sales[i].CODLOJA}`)
        sales[i]["products"] = products
      }
      
      return res.json(sales)
    } catch (error) {
      return res.status(400).json(error)
    }
  },
  async findProductDetals(req, res){
    try {
      const { idSale, codloja, codproduto } = req.params
  
      const products = await ViewDeliveryProd.findSome(0, `ID_SALES = ${idSale} AND CODLOJA = ${codloja} AND CODPRODUTO = ${codproduto} AND DELIVERED = 0`)

      var resp
  
      if (products.length > 0 ) {
        const delivery = await ViewDeliverys.findSome(0, `ID = ${products[0].ID_DELIVERY}`)
  
        resp = {products, delivery}
      } else {
        resp = false
      }
  
      return res.json(resp)
    } catch (error) {
      return res.status(400).json(error)
    }
  },
  async updaDateDeliv( req, res ){
    try {
      const { idSale } = req.params
      const { dateDeliv, CODLOJA } = req.body
  
      await Sales._query(0, `UPDATE SALES SET D_ENTREGA1 = '${dateDeliv}' WHERE ID_SALES = ${idSale} AND CODLOJA = ${CODLOJA}`)

      res.json(dateDeliv)
    } catch (error) {
      res.status(400).json(error)
    }
  }
}