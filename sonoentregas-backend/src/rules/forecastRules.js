//@ts-check
/**
 * @typedef {Object} SaleProdProps
 * @property {number} ID_SALE_ID
 * @property {string} COD_ORIGINAL
 * @property {string} STATUS
 * 
 * @typedef {Object} Products
 * @property {string} COD_ORIGINAL
 * 
 * @typedef {Object} Sale
 * @property {number} ID
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
  async checkDateInsertForecast({ dateForecast }){
    const dateForecastTimezone = ObjDate.getObjDate(dateForecast).setHours(0,0,0,0)

    const currentDateTimezone = new Date().setHours(0,0,0,0)

    if (dateForecastTimezone <= currentDateTimezone) {
      throw {
        status: 409,
        error: {
          message: 'Forecast date must be greater than the current date!'
        }
      }
    }
  }

  async checkDateForecast({ dateForecast }){
    const dateForecastTimezone = ObjDate.getObjDate(dateForecast).setHours(0,0,0,0)

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

    await this.checkDateForecast({ dateForecast: forecast[0].date })

    return forecast[0]
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
          error: 'There are unconfirmed sales in this forecast!'
        }
      }
    })

    /**@type {import('../services/ForecastService').IForecastProduct[]} */
    const forecastProduct = await ForecastProduct.findAny(0, { in: { idForecastSale: forecastSales.map( sale => sale.id) }})

    for (let i = 0; i < forecastSales.length; i++) {
      if (forecastSales[i].validationStatus) {
        const ID_SALE_ID = forecastSales[i].idSale
  
        const COD_ORIGINAL = forecastProduct
          .filter(product => product.idForecastSale === forecastSales[i].id)
          .map(product => product.COD_ORIGINAL)
  
        const saleProd = await SalesProd.findAny(0, { ID_SALE_ID, STATUS: 'Em Previsão', in: { COD_ORIGINAL } })
  
        if (saleProd.length > 0) {
          throw {
            status: 409,
            error: {
              message: "There are confirmed sales in this forecast!"
            }
          }
        }
      }
    }
  }

  async checkForecastProductStatus({ id }){
    const prodStatus = await SalesProd._query(0, `
      SELECT A.idForecast, A.idSale, B.*, C.[STATUS], A.validationStatus
      FROM FORECAST_SALES A
      INNER JOIN FORECAST_PRODUCT B ON A.id = B.idForecastSale
      INNER JOIN SALES_PROD C ON C.COD_ORIGINAL = B.COD_ORIGINAL AND C.ID_SALE_ID = A.idSale
      WHERE A.idForecast = ${id} AND [STATUS] = 'Em Previsão' AND validationStatus = 1
    `, QueryTypes.SELECT)

    if (prodStatus.length > 0) {
      throw {
        status: 409,
        error: {
          message: "Sales products aren't on routes!",
          sales: prodStatus
        }
      }
    }
  }
}

module.exports = new ForecastRules()