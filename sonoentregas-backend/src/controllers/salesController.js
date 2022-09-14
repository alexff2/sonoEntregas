const Sales = require('../models/Sales')
const ViewDeliveryProd = require('../models/ViewDeliveryProd2')
const ViewDeliverys = require('../models/ViewDeliverys')

const { findSales, findFinishedSales } = require('../services/salesService')

module.exports = {
  async findSales( req, res ){
    try {
      const { typeSearch, search, codLoja, status } = req.query

      let sales
      let where = ''

      if (!status) {
        where = `${typeSearch} = '${search}'`

        sales = await findSales(where)
      } else {
        if (status === 'open') {
          where = `STATUS = 'Aberta'`
          codLoja && (where +=` AND CODLOJA = ${codLoja}`)
          typeSearch && (where += ` AND ${typeSearch} LIKE '${search}%'`)

          sales = await findSales(where)
        } else {
          typeSearch === 'D_DELIVERED'
            ? where += ` AND ${typeSearch} = '${search}'`
            : where += ` AND ${typeSearch} LIKE '${search}%'`

          codLoja && (where +=` AND A.CODLOJA = ${codLoja}`)

          sales = await findFinishedSales(where)
        }
      }

      return res.json(sales)
    } catch (error) {
      console.log(error)
      return res.status(400).json(error)
    }
  },
  async findProductDetails(req, res){
    try {
      const { idSale, codloja, codproduto } = req.params
  
      const products = await ViewDeliveryProd.findSome(0, `ID_SALES = ${idSale} AND CODLOJA = ${codloja} AND CODPRODUTO = ${codproduto} ORDER BY ID_DELIVERY`)

      var resp
  
      if (products.length > 0 ) {
        const delivery = await ViewDeliverys.findSome(0, `ID = ${products[products.length - 1].ID_DELIVERY}`)
  
        resp = {products, delivery}
        return res.status(200).json(resp)
      } else {
        resp = false
        return res.status(204).json(resp)
      }
    } catch (error) {
      return res.status(400).json(error)
    }
  },
  async updateDateDeliv( req, res ){
    try {
      const { idSale } = req.params
      const { dateDeliv, CODLOJA, OBS_SCHED } = req.body
  
      await Sales._query(0, `UPDATE SALES SET D_ENTREGA1 = '${dateDeliv}', SCHEDULED = 1, OBS_SCHEDULED = '${OBS_SCHED}' WHERE ID_SALES = ${idSale} AND CODLOJA = ${CODLOJA}`)

      res.json(dateDeliv)
    } catch (error) {
      res.status(400).json(error)
    }
  }
}