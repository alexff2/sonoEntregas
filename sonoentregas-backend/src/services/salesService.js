const { QueryTypes } = require('sequelize')
const Sales = require('../models/Sales')
const ViewSalesProd = require('../models/ViewSalesProd')
const Empresas = require('../models/Empresas')

module.exports = {
  async findSales(where) {
    const sales = await Sales.findSome(0, where)

    if (sales.length === 0) {
      return []
    }

    let idSales = ''

    for (let i = 0; i < sales.length; i++){
      if ( i === 0 ){
        idSales+= sales[i].ID_SALES
      } else {
        idSales+= `, ${sales[i].ID_SALES}`
      }
    }

    const viewSalesProd = await ViewSalesProd.findSome(0, `ID_SALES IN (${idSales})`)
    const shops = await Empresas._query(0, 'SELECT * FROM LOJAS', QueryTypes.SELECT)

    const sales_prod = sales.map(sale => {
      sale['products'] = []

      viewSalesProd.forEach(product => {
        product['checked'] = false
        if (sale.ID_SALES === product.ID_SALES && sale.CODLOJA === product.CODLOJA) {
          sale.products = [...sale.products, product]
        }
      })

      shops.forEach( shops => {
        if (shops.CODLOJA === sale.CODLOJA) {
          sale['SHOP'] = shops.DESC_ABREV
        }
      })

      return sale
    })
    
    return sales_prod
  }, 
  async findFinishedSales(where) {
    const salesDeliveriesProd = await Sales._query(0, `SELECT A.ID_SALE
    FROM DELIVERYS_PROD A
    INNER JOIN SALES B ON A.CODLOJA = B.CODLOJA AND A.ID_SALE = B.ID_SALES
    WHERE A.D_DELIVERED IS NOT NULL AND A.DELIVERED = 0 AND B.[STATUS] = 'Fechada' ${where}`, QueryTypes.SELECT)

    if (salesDeliveriesProd.length === 0) {
      return []
    }

    let idSales = ''

    for (let i = 0; i < salesDeliveriesProd.length; i++){
      if ( i === 0 ){
        idSales+= salesDeliveriesProd[i].ID_SALE
      } else {
        idSales+= `, ${salesDeliveriesProd[i].ID_SALE}`
      }
    }

    const sales = await Sales.findSome(0, `ID_SALES IN (${idSales})`)

    const viewSalesProd = await ViewSalesProd.findSome(0, `ID_SALES IN (${idSales})`)
    const shops = await Empresas._query(0, 'SELECT * FROM LOJAS', QueryTypes.SELECT)

    const sales_prod = sales.map(sale => {
      sale['products'] = []

      viewSalesProd.forEach(product => {
        product['checked'] = false
        if (sale.ID_SALES === product.ID_SALES && sale.CODLOJA === product.CODLOJA) {
          sale.products = [...sale.products, product]
        }
      })

      shops.forEach( shops => {
        if (shops.CODLOJA === sale.CODLOJA) {
          sale['SHOP'] = shops.DESC_ABREV
        }
      })

      return sale
    })
    
    return sales_prod
  }
}