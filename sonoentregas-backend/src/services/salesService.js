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
 * @property {number} SHOP
 * @property {string} STATUS
 * @property {string} EMISSAO
 * @property {string} D_ENVIO
 * @property {string} D_ENTREGA1
 * @property {number | null} idDelivery
 * @property {boolean} isMaintenance
 * @property {boolean} isWithdrawal
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
const SalesProd = require('../models/SalesProd')
const ViewVendas = require('../models/ViewVendas')
const ViewSalesProd = require('../models/ViewSalesProd')
const Empresas = require('../models/ShopsSce')
const Forecast = require('../models/tables/Forecast')
const scriptForecast = require('../scripts/forecast')
const scriptSales = require('../scripts/sales')
const scriptProducts = require('../scripts/products')
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
    const idSales = sales.map(sale => sale.ID_SALES)

    where = `ID_SALES IN (${idSales}) AND CODLOJA IN (${sales.map(sale => sale.CODLOJA)})`
  }

  /**@type {IProduct[]} */
  const viewSalesProd = await ViewSalesProd.findSome(0, where)

  return addProductInSale({ sales, products: viewSalesProd })
}

const setProductsToFindSales = async (/** @type {ISales[]} */ sales, finish = false) => {
  const shops = await Empresas._query(0, 'SELECT * FROM LOJAS', QueryTypes.SELECT)
  const salesProducts = await SalesProd._query(0, scriptSales.salesProductsByIdSaleId(sales.map(sale => sale.ID), finish), QueryTypes.SELECT)
  if (salesProducts.length === 0) {
    return []
  }

  sales.forEach(sale => {
    sale.SHOP = shops.find(shop => shop.CODLOJA === sale.CODLOJA)?.DESC_ABREV || 'Loja Desconhecida'

    sale.products = salesProducts.filter(product => product.ID_SALE_ID === sale.ID)
  })
  return sales
}

module.exports = {
  async findSalesToHome() {
    /**@type {ISales[] | []} */
    const sales = await Sales.findAny(0, {STATUS: 'Aberta'})

    if (sales.length === 0) {
      return []
    }

    return setProductsToFindSales(sales)
  },
  async findSalesToShopById({saleId, shopId, status = 'Aberta'}) {
    /**@type {ISales[] | []} */
    const sales = await Sales.findAny(0, {CODLOJA: shopId, ID_SALES: saleId, STATUS: status})

    if (sales.length === 0) {
      return []
    }

    return setProductsToFindSales(sales, status === 'Fechada')
  },
  async findSalesToShopByName({client, shopId, status = 'Aberta'}) {
    /**@type {ISales[] | []} */
    const sales = await Sales._query(0, scriptSales.salesByName({client, shopId, status}), QueryTypes.SELECT)

    if (sales.length === 0) {
      return []
    }

    return setProductsToFindSales(sales, status === 'Fechada')
  },
  async findOpenSalesToShop({shopId}) {
    /**@type {ISales[] | []} */
    const sales = await Sales.findAny(0, {STATUS: 'Aberta', CODLOJA: shopId})

    if (sales.length === 0) {
      return []
    }

    return setProductsToFindSales(sales)
  },
  /**
   * @param {*} where 
   * @returns 
   */
  async findSales(where) {
    const script = `SELECT * FROM sales WHERE ${where} ORDER BY D_ENTREGA1`

    const sales = await Sales._query(0, script, QueryTypes.SELECT)

    if (sales.length === 0) {
      return []
    }

    return setUpSalesProduct([
      ...sales.filter(sale => sale.D_ENTREGA1 !== null),
      ...sales.filter(sale => sale.D_ENTREGA1 === null)
    ])
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
    let sales = await Sales.findAny(0, {ID_SALES: idSale})
    let maintenance = await Sales._query(0, scriptForecast.findSaleMaintenance({idSale}), QueryTypes.SELECT)

    if (sales.length === 0 && maintenance.length === 0) {
      return ''
    }

    sales = sales.filter(sale => sale.STATUS === 'Aberta')
    maintenance = maintenance.filter(sale => sale.STATUS === 'No CD')

    if (sales.length === 0 && maintenance.length === 0) {
      return []
    }

    let products = []

    if (sales.length !== 0) {
      const scriptFindSaleProductToForecast = scriptForecast.findSaleProductToForecast({idSale, idShops: sales.map(sale => sale.CODLOJA)})
      const saleProducts = await SalesProd._query(0, scriptFindSaleProductToForecast, QueryTypes.SELECT)
      const productsStock = await SalesProd._query(
        1,
        process.env.STOCK_BEEP === '0'
          ? scriptProducts.stockNotBeep({COD_ORIGINAL: saleProducts.map(saleProduct => `'${saleProduct.COD_ORIGINAL}'`)})
          : scriptProducts.stockBeep({COD_ORIGINAL: saleProducts.map(saleProduct => `'${saleProduct.COD_ORIGINAL}'`)}),
        QueryTypes.SELECT
      )
      products = saleProducts.map(saleProduct => {
        const stock = productsStock.find(productStock => productStock.COD_ORIGINAL === saleProduct.COD_ORIGINAL)
        return {
          ...saleProduct,
          ...stock
        }
      })
    }

    if (maintenance.length !== 0) {
      const scriptFindSaleProductMaintenance = scriptForecast.findSaleProductMaintenanceToForecast({idSale, idShops: maintenance.map(sale => sale.CODLOJA)})
      const productsMaintenance = await SalesProd._query(0, scriptFindSaleProductMaintenance, QueryTypes.SELECT)
      const productsStock = await SalesProd._query(
        1,
        process.env.STOCK_BEEP === '0'
          ? scriptProducts.stockNotBeep({COD_ORIGINAL: productsMaintenance.map(saleProduct => `'${saleProduct.COD_ORIGINAL}'`)})
          : scriptProducts.stockBeep({COD_ORIGINAL: productsMaintenance.map(saleProduct => `'${saleProduct.COD_ORIGINAL}'`)}),
        QueryTypes.SELECT
      )
      products = [...products, ...productsMaintenance.map(saleProduct => {
        const stock = productsStock.find(productStock => productStock.COD_ORIGINAL === saleProduct.COD_ORIGINAL)
        return {
          ...saleProduct,
          ...stock
        }
      })]
    }

    return addProductInSale({
      sales: [...sales, ...maintenance],
      products
    })
  },
  async findToWithdrawal({idSale}){
    /**@type {ISales[] | []} */
    const sales = await Sales.findAny(0, {ID_SALES: idSale})

    if (sales.length === 0) {
      throw {
        status: 409,
        error: {
          message: 'Venda não enviada ao CD!'
        }
      }
    }

    const saleIsWithdrawal = sales.filter(sale => sale.isWithdrawal)

    if (saleIsWithdrawal.length === 0) {
      throw {
        status: 409,
        error: {
          message: 'Venda não é retirada, sem permissão para finalizar!'
        }
      }
    }

    const scriptFindSaleProductToForecast = scriptForecast.findSaleProductToForecast({idSale, idShops: sales.map(sale => sale.CODLOJA)})
    const saleProducts = await SalesProd._query(0, scriptFindSaleProductToForecast, QueryTypes.SELECT)

    saleProducts.forEach(product => {
      product.STATUS = 'Enviado'
    })

    return addProductInSale({
      sales: saleIsWithdrawal,
      products: saleProducts
    })
  },
  async findToCreateRoutes({idSale}){
    /**@type {IForecast[]} */
    const forecasts = await Forecast.findAny(0, { STATUS: 1 })

    if (forecasts.length === 0) {
      throw {
        status: 404,
        error: {
          message: 'Não há previsões abertas!'
        }
      }
    }

    /**@type {ISales[] | []} */
    const sales = await Sales.findAny(0, { ID_SALES: idSale })

    if (sales.length === 0) {
      throw {
        status: 404,
        error: {
          message: 'Venda não enviada ao CD!'
        }
      }
    }

    const scriptSales = 
    `SELECT A.id as idForecastSale, A.validationStatus, A.idDelivery, A.isMaintenance, C.[date], B.*
    FROM FORECAST_SALES A
    INNER JOIN SALES B ON A.idSale = B.ID
    INNER JOIN FORECAST C ON A.idForecast = C.id
    WHERE A.idForecast in (${forecasts.map(forecast => forecast.id)})
    AND B.ID_SALES = ${idSale}`

    /**@type {ISales[]} */
    const forecastSales = await Forecast._query(0, scriptSales, QueryTypes.SELECT)

    if (forecastSales.length === 0) {
      throw {
        status: 409,
        error: {
          message: 'Venda requisitada não está em uma previsão aberta!'
        }
      }
    }

    const saleIsNotWithdrawal = forecastSales.filter(sale => !sale.isWithdrawal)

    if (saleIsNotWithdrawal.length === 0) {
      throw {
        status: 409,
        error: {
          message: 'Venda para retirada, sem permissão para adicionar na rota!'
        }
      }
    }

    const validationSales = saleIsNotWithdrawal.filter(sale => typeof sale.validationStatus === 'boolean')

    if (validationSales.length === 0) {
      throw {
        status: 409,
        error: {
           message: 'Venda não validada, solicite que a loja entre em contato com cliente!'
        }
      }
    }

    const confirmedSales = validationSales.filter(sale => sale.validationStatus)

    if (confirmedSales.length === 0) {
      throw {
        status: 409,
        error: {
           message: 'A entrega desta venda foi recusada pelo cliente, acesse a previsão para ver o motivo!'
        }
      }
    }

    const salesWithoutRoutes = confirmedSales.filter(sale => !sale.idDelivery)

    if (salesWithoutRoutes.length === 0) {
      throw {
        status: 409,
        error: {
          message: 'A venda já está vinculada a uma rota!'
        }
      }
    }

    const scriptProduct = 
    `SELECT B.*, A.quantityForecast, A.idForecastSale, A.ID_MAINTENANCE, B.DESCRICAO NOME
    FROM SALES_PROD B
    INNER JOIN (SELECT A.*, B.idSale
                FROM FORECAST_PRODUCT A
                INNER JOIN FORECAST_SALES B ON A.idForecastSale = B.id) A
    ON A.idSale = B.ID_SALE_ID AND A.COD_ORIGINAL = B.COD_ORIGINAL
    WHERE A.idForecastSale in (${forecastSales.map(sale => sale.idForecastSale)})`

    /**@type {IProduct[]} */
    const forecastProduct = await Forecast._query(0, scriptProduct, QueryTypes.SELECT)

    return addProductInSale({sales: salesWithoutRoutes, products: forecastProduct })
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
  },
  /**
   * @param {object} params
   * @param {object} connection
   */
  async updateDateDelivery({id, dateDeliv, OBS_SCHEDULE}, connection) {
    await Sales.updateAny(0, {
      D_ENTREGA1: dateDeliv,
      SCHEDULED: 1,
      OBS_SCHEDULED: OBS_SCHEDULE
    }, { ID: id }, connection)

    await SalesProd.updateAny(0, {
      STATUS: 'Enviado',
    }, { ID_SALE_ID: id, STATUS: 'Sem Agendamento' }, connection)
  },
  /**
   * @param {object} params
   */
  async unschedule({id, connection}){
    await Sales.updateAny(0, {
      D_ENTREGA1: 'NULL',
    }, { ID: id }, connection)
  },
  /**
   * @param {object} params
   */
  async dtPrevShopUpdate({idSale, dtPrevShop}) {
    await Sales.updateAny(0, {dtPrevShop}, {ID: idSale})
  },
  /**
   * @param {object} params
   */
  async shopObsUpdate({idSale, shopObs}) {
    await Sales.updateAny(0, {shopObs}, {ID: idSale})
  }
}
