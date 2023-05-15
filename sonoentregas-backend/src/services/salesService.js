//@ts-check
/**
 * @typedef {Object} IProduct
 * @property {number} CODPRODUTO
 * @property {string} COD_ORIGINAL
 * @property {number} CODLOJA
 * @property {string} DESCRICAO
 * @property {number} ID_SALES
 * @property {number} ID_SALE_ID
 * 
 * @typedef {Object} ISales
 * @property {number} idForecastSale
 * @property {boolean} validationStatus
 * @property {number} ID
 * @property {number} ID_SALES
 * @property {number} CODLOJA
 * @property {string} STATUS
 * @property {string} EMISSAO
 * @property {string} D_ENVIO
 * @property {string} D_ENTREGA1
 * @property {string} ENDERECO
 * @property {IProduct[] | []} products
 * 
 * @typedef {Object} IForecast
 * @property {number} id
 * @property {string} date
 * @property {'INICIADA' | 'FINALIZADA'} status
 */
const { QueryTypes } = require('sequelize')
const Sales = require('../models/Sales')
const ViewVendas = require('../models/ViewVendas')
const ViewSalesProd = require('../models/ViewSalesProd')
const Empresas = require('../models/Empresas')
const Forecast = require('../models/tables/Forecast')
const { difDate } = require('../functions/getDate')

/**
 * @typedef {Object} PropAddProductSale
 * @property {ISales[]} sales
 * @property {IProduct[]} products
 * @param {PropAddProductSale} param0 
 * @returns 
 */
const addProductInSale = async ({ sales , products }) => {
  const shops = await Empresas._query(0, 'SELECT * FROM LOJAS', QueryTypes.SELECT)

  const sales_prod = sales.map(sale => {
    sale['products'] = []

    products.forEach((/** @type {IProduct} */ product) => {
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

const setUpSalesProduct = async (/** @type {ISales[]} */ sales, where = '') => {
  if (where === '') {
    let idSales = ''
    for (let i = 0; i < sales.length; i++){
      if ( i === 0 ){
        idSales+= sales[i].ID_SALES
      } else {
        idSales+= `, ${sales[i].ID_SALES}`
      }
    }

    where = `ID_SALES IN (${idSales})`
  }

  /**@type {IProduct[]} */
  const viewSalesProd = await ViewSalesProd.findSome(0, where)

  return addProductInSale({ sales, products: viewSalesProd })
}

module.exports = {
  /**
   * @param {*} where 
   * @returns 
   */
  async findSales(where) {
    const sales = await Sales.findSome(0, where)

    if (sales.length === 0) {
      return []
    }

    return setUpSalesProduct(sales)
  },
  /**
   * @param {*} where 
   * @param {*} codLoja 
   * @returns 
   */
  async findFinishedSales(where, codLoja) {
    const salesDeliveriesProd = await Sales._query(0, `SELECT A.ID_SALE
    FROM DELIVERYS_PROD A
    INNER JOIN SALES B ON A.CODLOJA = B.CODLOJA AND A.ID_SALE = B.ID_SALES
    INNER JOIN DELIVERYS C ON A.ID_DELIVERY = C.ID
    WHERE C.STATUS = 'Finalizada' AND A.DELIVERED = 0 AND B.[STATUS] = 'Fechada' ${where}`, QueryTypes.SELECT)

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

    let whereSale = `ID_SALES IN (${idSales})`
    codLoja && (whereSale +=` AND CODLOJA = ${codLoja}`)

    const sales = await Sales.findSome(0, whereSale)
    
    return setUpSalesProduct(sales)
  },
  /**
   * @param {number} idSale 
   * @returns 
   */
  async findToCreateForecast(idSale){
    /**@type {ISales[] | []} */
    let sales = await Sales.findAny(0, { ID_SALES: idSale })

    if (sales.length === 0) {
      return ''
    }

    sales = sales.filter( sale => sale.STATUS === 'Aberta' )

    if (sales.length === 0) {
      return []
    }

    return setUpSalesProduct(sales)
  },
  /**
   * @param {number} idProduct 
   * @returns 
   */
  async findToCreateForecastByProduct(idProduct){
    const scriptSalesFind = `
    select ID_SALES from VIEW_SALES_PROD
    where [STATUS] = 'Enviado' and EST_LOJA > 0 and COD_ORIGINAL = '${idProduct}'`

    const idSales = await Sales._query(0, scriptSalesFind, QueryTypes.SELECT)

    if (idSales.length === 0) {
      return {
        notFound: {
          message: 'Produto não encontrado, não pendente e/ou sem estoque!'
        }
      }
    }

    /**@type {ISales[] | []} */
    let sales = await Sales.findAny(0, { in: { ID_SALES: idSales.map(sale => sale.ID_SALES) }})

    if (sales.length === 0) {
      return ''
    }

    sales = sales.filter( sale => sale.STATUS === 'Aberta' )

    if (sales.length === 0) {
      return []
    }

    return setUpSalesProduct(sales)
  },
  async findToCreateRoutes({ idSale }){
    /**@type {IForecast[]} */
    const forecasts = await Forecast.findAny(0, { STATUS: 1 })

    if (forecasts.length === 0) {
      return {
        notFound: {
          message: 'Nenhuma previsão criada!'
        }
      }
    }

    /**@type {ISales[] | []} */
    const sales = await Sales.findAny(0, { ID_SALES: idSale })

    if (sales.length === 0) {
      return ''
    }

    const scriptSales = 
    `SELECT A.id as idForecastSale, A.validationStatus, C.[date], B.*
    FROM FORECAST_SALES A
    INNER JOIN SALES B ON A.idSale = B.ID
    INNER JOIN FORECAST C ON A.idForecast = C.id
    WHERE A.idForecast in (${forecasts.map(forecast => forecast.id)}) AND B.ID_SALES = ${idSale}`

    /**@type {ISales[]} */
    const forecastSales = await Forecast._query(0, scriptSales, QueryTypes.SELECT)

    if (forecastSales.length === 0) {
      return {
        notFound: {
          message: 'Venda requisitada não está em uma previsão aberta!'
        }
      }
    }

    const validationSales = forecastSales.filter(sale => typeof sale.validationStatus === 'boolean')

    if (validationSales.length === 0) {
      return {
        notFound: {
           message: 'Venda não validada, solicite que a loja entre em contato com cliente!'
        }
      }
    }

    const confirmedSales = forecastSales.filter(sale => sale.validationStatus)

    if (confirmedSales.length === 0) {
      return {
        notFound: {
           message: 'A entrega desta venda foi recusada pelo cliente, acesse a previsão para ver o motivo!'
        }
      }
    }

    const scriptProduct = 
    `SELECT B.*, A.quantityForecast FROM VIEW_SALES_PROD B
    INNER JOIN (SELECT A.*, B.idSale
                FROM FORECAST_PRODUCT A
                INNER JOIN FORECAST_SALES B ON A.idForecastSale = B.id) A
    ON A.idSale = B.ID_SALE_ID AND A.COD_ORIGINAL = B.COD_ORIGINAL
    WHERE B.STATUS = 'Em Previsão'
    AND A.idForecastSale in (${forecastSales.map(sale => sale.idForecastSale)})`

    /**@type {IProduct[]} */
    const forecastProduct = await Forecast._query(0, scriptProduct, QueryTypes.SELECT)

    if (forecastProduct.length === 0) {
      return {
        notFound: {
           message: 'Produtos já em rota, ou já entregues!'
        }
      }
    }

    return addProductInSale({sales: forecastSales, products: forecastProduct })
  },
  async findSalesToReport(){
    /**@type {ISales[] | []} */
    const sales = await Sales.findAny(0, {
      status: 'Aberta'
    }, 'CODLOJA, ID_SALES, NOMECLI, EMISSAO, D_ENVIO, D_ENTREGA1')

    const shops = await Empresas._query(0, 'SELECT * FROM LOJAS', QueryTypes.SELECT)

    sales.forEach(sale => {
      const millisecondsIssuance = new Date(sale.EMISSAO).setHours(0,0,0,0)
      const millisecondsSend = new Date(sale.D_ENVIO).setHours(0,0,0,0)
      const millisecondsDelivery = new Date(sale.D_ENTREGA1).setHours(0,0,0,0)
      const millisecondsNow = new Date().setHours(0,0,0,0)

      const daysIssuance = difDate(millisecondsIssuance, millisecondsNow)
      const daysSend = difDate(millisecondsSend, millisecondsNow)
      const lateDays = (millisecondsNow - millisecondsDelivery) / 86400000

      const difDays = daysIssuance - daysSend

      sale['DIAS_EMIS'] = daysIssuance
      sale['DIAS_ENVIO'] = daysSend
      sale['DIF_DIAS'] = difDays
      sale['lateDays'] = lateDays

      shops.forEach( shops => {
        if (shops.CODLOJA === sale.CODLOJA) {
          sale['SHOP'] = shops.DESC_ABREV
        }
      })
    })

    return sales
  },
  /**
   * @param {number} idSale
   * @returns 
   */
  async updateAddress(idSale){
    /**@type {ISales[]} */
    const sale = await Sales.findAny(0, { ID: idSale }, 'ID_SALES, CODLOJA')

    const saleSce = await ViewVendas.findAny(sale[0].CODLOJA, {
      CODIGOVENDA: sale[0].ID_SALES
    })

    await Sales.updateAny(0, {
      ENDERECO: saleSce[0].ENDERECO,
      NUMERO: saleSce[0].NUMERO,
      BAIRRO: saleSce[0].BAIRRO,
      CIDADE: saleSce[0].CIDADE,
      ESTADO: saleSce[0].ESTADO,
      PONTOREF: saleSce[0].PONTOREF,
      OBS: saleSce[0].OBS
    }, { ID: idSale })
  }
}