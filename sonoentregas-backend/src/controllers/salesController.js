const { QueryTypes } = require('sequelize')
const Sales = require('../models/Sales')
const ViewSalesProd = require('../models/ViewSalesProd')
const ViewDeliveryProd = require('../models/ViewDeliveryProd2')
const ViewDeliverys = require('../models/ViewDeliverys')
const Empresas = require('../models/Empresas')
const { findSales, salesInProcess } = require('../services/salesService')

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
          let idSale = ''
  
          for (let i = 0; i < salesProd[0].length; i++){
            if ( i === 0 ){
              idSale+= salesProd[0][i].ID_SALE
            } else {
              idSale+= `, ${salesProd[0][i].ID_SALE}`
            }
          }
  
          sales = await Sales.findSome(0, `ID_SALES IN (${idSale}) ${whereCodloja}`)
        } else {
          sales = []
        }

      } else {
        sales = await Sales.findSome(0, `${typesearch} = '${search}'${whereCodloja}`)
      }

      let idSale = ''
      if (sales.length > 0){
        for (let i = 0; i < sales.length; i++){
          if ( i === 0 ){
            idSale+= sales[i].ID_SALES
          } else {
            idSale+= `, ${sales[i].ID_SALES}`
          }
        }
    
        const viewSalesProd = await ViewSalesProd.findSome(0, `ID_SALES IN (${idSale})`)
        const shops = await Empresas._query(0, 'SELECT * FROM LOJAS', QueryTypes.SELECT)

        const sales_prod = sales.map(sale => {
          sale['products'] = []
    
          viewSalesProd.forEach(saleProd => {
            saleProd['checked'] = false
            if (sale.ID_SALES === saleProd.ID_SALES && sale.CODLOJA === saleProd.CODLOJA) {
              sale.products.push(saleProd)
            }
          })

          shops.forEach( shops => {
            if (shops.CODLOJA === sale.CODLOJA) {
              sale['SHOP'] = shops.DESC_ABREV
            }
          })

          return sale
        })
        
        return res.json(sales_prod)
      } else {
        return res.status(204).json('Venda não encontrada')
      }
    } catch (error) {
      return res.status(400).json(error)
    }
  },
  async findProductDetals(req, res){
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
  async updaDateDeliv( req, res ){
    try {
      const { idSale } = req.params
      const { dateDeliv, CODLOJA, OBS_SCHED } = req.body
  
      await Sales._query(0, `UPDATE SALES SET D_ENTREGA1 = '${dateDeliv}', SCHEDULED = 1, OBS_SCHEDULED = '${OBS_SCHED}' WHERE ID_SALES = ${idSale} AND CODLOJA = ${CODLOJA}`)

      res.json(dateDeliv)
    } catch (error) {
      res.status(400).json(error)
    }
  },
  async salesInProcess(req, res){
    const { codloja } = req.params

    const sales = await salesInProcess(codloja)

    return res.json(sales)
  }
}