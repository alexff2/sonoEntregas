//@ts-check
/**
 * @typedef {Object} SaleProdProps
 * @property {number} ID_SALE_ID
 * @property {string} COD_ORIGINAL
 * @property {string} STATUS
 * 
 * @typedef {Object} Products
 * @property {number} ID_SALE_ID
 * @property {string} COD_ORIGINAL
 * @property {number} QUANTIDADE
 * @property {number} QTD_MOUNTING
 * @property {number} qtdDelivery
 * 
 * @typedef {Object} Sale
 * @property {number} ID
 * @property {number} ID_SALES
 * @property {number} CODLOJA
 * @property {string} whoReceived
 * @property {boolean} isWithdrawal
 * @property {Products[]} products
 */

const { QueryTypes } = require('sequelize')
const ObjDate = require('../functions/getDate')
const Sale = require('../models/Sales')
const SalesProd = require('../models/SalesProd')
const Forecast = require('../models/tables/Forecast')
const ForecastSales = require('../models/tables/Forecast/ForecastSales')
const ForecastProduct = require('../models/tables/Forecast/ForecastProduct')

class ForecastRules {
  async checkDateInsertForecast({ date }){
    const dateForecastTimezone = ObjDate.getObjDate(date).setHours(0,0,0,0)

    const currentDateTimezone = new Date().setHours(0,0,0,0)

    if (dateForecastTimezone < currentDateTimezone) {
      throw {
        status: 409,
        error: {
          message: 'A data da previsão deve ser igual ou superior à data atual!'
        }
      }
    }
  }

  async checkDateForecast({ date }){
    const dateForecastTimezone = ObjDate.getObjDate(date).setHours(0,0,0,0)

    const currentDateTimezone = new Date().setHours(0,0,0,0)

    if (dateForecastTimezone < currentDateTimezone) {
      throw {
        status: 409,
        error: {
          message: 'outdated forecast!'
        }
      }
    }
  }

  async checkExistForecast({ id }){
    const forecast = await Forecast.findAny(0, { id })

    if (forecast.length === 0) {
      throw {
        status: 400,
        error: {
          message: `Provided forecast does not exist!`,
        },
      }
    }

    if (forecast[0].status === false) {
      throw {
        status: 400,
        error: {
          message: `Forecast status other than 'STARTED' or 'CREATED'`,
        },
      }
    }

    return forecast[0]
  }

  async checkExistValidForecast({ id }){
    const forecast = await Forecast.findAny(0, { id })

    if (forecast.length === 0) {
      throw {
        status: 400,
        error: {
          message: `Provided forecast does not exist!`,
        },
      }
    }

    if (forecast[0].status === false) {
      throw {
        status: 400,
        error: {
          message: `Forecast status other than 'STARTED' or 'CREATED'`,
        },
      }
    }

    await this.checkDateForecast({ date: forecast[0].date })

    return forecast[0]
  }

  /** @param {Sale[]} sales */
  async checkSaleIsWithdrawal(sales){
    const salesIsWithdrawal = await Sale.findAny(0, { isWithdrawal: 1, in: { ID: sales.map( sale => sale.ID) }})

    if (salesIsWithdrawal.length > 0) {
      throw {
        status: 400,
        error: {
          message: 'Sales with STATUS isWithdrawal',
          salesIsWithdrawal
        },
      }
    }
  }

  /** @param {Sale[]} sales */
  async checkForecastSalesIsClosed(sales){
    const salesClosed = await Sale.findAny(0, { STATUS: 'Fechada', in: { ID: sales.map( sale => sale.ID) }})

    if (salesClosed.length > 0) {
      throw {
        status: 400,
        error: {
          message: 'Sales with STATUS closed',
          salesClosed
        },
      }
    }
  }

  /** @param {Sale[]} sales */
  async checkStatusProduct(sales){
    /** @type {SaleProdProps[]} */
    const saleProds = await SalesProd.findAny(0, { in: { ID_SALE_ID: sales.map( sale => sale.ID) }})

    sales.forEach(sale => {
      sale.products.forEach(prod => {
        const saleProd = saleProds.find(saleProd => {
          return saleProd.ID_SALE_ID === sale.ID && saleProd.COD_ORIGINAL === prod.COD_ORIGINAL
        })

        if (!saleProd) {
          throw {
            status: 400,
            error: {
              message: 'Product does not belong to this sale in the database!',
              idSaleId: sale.ID,
              prod: prod.COD_ORIGINAL
            },
          }
        } else if (saleProd.STATUS !== 'Enviado') {
          throw {
            status: 400,
            error: {
              message: `The Product isn't in 'shipped' status!`,
              idSaleId: sale.ID,
              prod: prod.COD_ORIGINAL
            },
          }
        }
      })
    })
  }
  /** @param {Sale[]} sales */
  async checkAvailableStock(sales){
    var qtdProducts = []
    var codOriginal = ''

    sales.forEach(sale => {
      sale.products.forEach(product => {
        const qtdProduct = qtdProducts.length > 0 ? qtdProducts.find( qtdProduct => qtdProduct.COD_ORIGINAL === product.COD_ORIGINAL) : undefined

        if (!qtdProduct) {
          qtdProducts = [...qtdProducts, { 
            COD_ORIGINAL: product.COD_ORIGINAL,
            qtdDelivery: product.qtdDelivery
          }]

          if (codOriginal === '') {
            codOriginal = `'${product.COD_ORIGINAL}'`
          } else {
            codOriginal += `, '${product.COD_ORIGINAL}'`
          }
        } else {
          qtdProducts.forEach( qtdProductReleased => {
            if (qtdProductReleased.COD_ORIGINAL === product.COD_ORIGINAL) {
              qtdProductReleased.qtdDelivery += product.qtdDelivery
            }
          })
        }
      })
    })

    const estProducts = await SalesProd._query(1, `
      SELECT A.ALTERNATI, B.EST_LOJA - ISNULL(C.qtdFullForecast, 0) qtdAvailableStock
      FROM PRODUTOS A
      INNER JOIN PRODLOJAS B ON A.CODIGO = B.CODIGO
      LEFT JOIN ( SELECT COD_ORIGINAL, SUM(QUANTIDADE) qtdFullForecast
          FROM ${process.env.ENTREGAS_BASE}..SALES_PROD 
          WHERE [STATUS] = 'Em Previsão'
          GROUP BY COD_ORIGINAL) C ON A.ALTERNATI = C.COD_ORIGINAL
      WHERE B.CODLOJA = 1 AND A.ALTERNATI IN (${codOriginal})
    `, QueryTypes.SELECT)

    estProducts.forEach( estProduct => {
      qtdProducts.forEach( qtdProduct => {
        if (estProduct.ALTERNATI === qtdProduct.COD_ORIGINAL) {
          if (estProduct.qtdAvailableStock < qtdProduct.qtdDelivery) {
            throw {
              status: 409,
              error: {
                message: 'Product was out of stock!'
              }
            }
          }
        }
      })
    })
  }

  async checkForecastSaleIsValidated({ id }) {
    const forecastSale = await ForecastSales.findAny(0, { id })

    if (forecastSale.length === 0) {
      throw {
        status: 400,
        error: 'Not exist forecast for this sale!'
      }
    }

    if (forecastSale[0].validationStatus !== null) {
      throw {
        status: 400,
        error: 'Sale already validated!'
      }
    }

    return forecastSale[0]
  }

  async checkForecastSaleNotValidated({ id }) {
    const forecastSale = await ForecastSales.findAny(0, { id })

    if (forecastSale.length === 0) {
      throw {
        status: 400,
        error: 'Not exist Forecast for this sale!'
      }
    }

    if (forecastSale[0].validationStatus === null) {
      throw {
        status: 409,
        error: 'Sales not validated!'
      }
    }

    return forecastSale[0]
  }

  async saleOnRoute({forecastSale}) {
    /**@type {import('../services/ForecastService').IForecastProduct[]} */
    const forecastProducts = await ForecastProduct.findAny(0, { idForecastSale: forecastSale.id })

    const COD_ORIGINAL = forecastProducts.map(forecastProduct => forecastProduct.COD_ORIGINAL)

    const saleProd = await SalesProd.findAny(0, { 
      ID_SALE_ID: forecastSale.idSale,
      STATUS: 'Em Previsão',
      in: { COD_ORIGINAL }
    })

    if (saleProd.length > 0) {
      return false
    }

    return true
  }

  async checkForecastSaleIsValidatedToFinish({ id }) {
    /**@type {import('../services/ForecastService').IForecastSales[]} */
    const forecastSales = await ForecastSales.findAny(0, { idForecast: id })

    forecastSales.forEach( sale => {
      if (sale.validationStatus === null) {
        throw {
          status: 409,
          error: {message: 'There are unconfirmed sales in this forecast!'}
        }
      }
    })
  }

  async checkForecastIsDelivering({ id }){
    const salesId = await SalesProd._query(0, `
    SELECT D.ID_SALES
    FROM FORECAST_SALES A
    INNER JOIN FORECAST_PRODUCT B ON A.id = B.idForecastSale
    LEFT JOIN DELIVERYS C ON A.idDelivery = C.ID
    INNER JOIN SALES D ON D.ID = A.idSale
    WHERE A.idForecast = ${id} AND (C.[STATUS] IS NULL OR C.[STATUS] = 'Em lançamento') AND A.validationStatus = 1
    GROUP BY D.ID_SALES
    `, QueryTypes.SELECT)

    if (salesId.length > 0) {
      throw {
        status: 409,
        error: {
          message: "Sales products aren't on routes!",
          salesId: salesId.map( saleId => saleId.ID_SALES)
        }
      }
    }
  }
}

module.exports = new ForecastRules()