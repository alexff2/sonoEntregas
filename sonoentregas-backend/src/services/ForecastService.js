//@ts-check

/**
 * @typedef {Object} IProduct
 * @property {number} ID_SALE_ID
 * @property {string} COD_ORIGINAL
 * @property {number} QUANTIDADE
 * @property {number} QTD_MOUNTING
 * @property {number} qtdDelivery
 * 
 * @typedef {Object} ISale
 * @property {number} ID
 * @property {IProduct[]} products
 * 
 * @typedef {Object} IForecastSales
 * @property {number} id
 * @property {number} idForecast
 * @property {number} idForecastSale
 * @property {number} idSale
 * @property {boolean} validationStatus
 * 
 * @typedef {Object} IForecastProduct
 * @property {number} idForecastSale
 * @property {string} COD_ORIGINAL
 * @property {number} quantityForecast
 * 
 * @typedef {Object} IForecast
 * @property {number} id
 * @property {number} idUserCreated
 * @property {string} date
 * @property {string} status
 * 
 * @typedef {Object} PropsCreateForecast
 * @property {string} date
 * @property {string} description
 * @property {string} userId
 * 
 * @typedef {Object} PropsSalesForecast
 * @property {ISale[]} sales
 * @property {string} userId
 * @property {string} idForecast
 * @property {boolean} add
 * 
 * @typedef {Object} PropsValidation
 * @property {number} id
 * @property {boolean} validationStatus
 * @property {string} contact
 * @property {string} obs
 * @property {string} userId
 * 
 * @typedef {Object} PropsDeleteSale
 * @property {IForecastSales} forecastSale
 */

const { QueryTypes } = require('sequelize')
const Forecast = require('../models/tables/Forecast')
const ForecastSales = require('../models/tables/Forecast/ForecastSales')
const ForecastProduct = require('../models/tables/Forecast/ForecastProduct')
const Sale = require('../models/Sales')
const SalesProd = require('../models/SalesProd')
const Users = require('../models/Users')

const ObjDate = require('../functions/getDate')

class ForecastService {
  async findForecastOpen(){
    /** @type {IForecast[]} */
    const forecasts = await Forecast._query(0, 'select * from Forecast where [status] IS NULL OR [status] = 1', QueryTypes.SELECT)

    if (forecasts.length === 0) {
      return []
    }

    const users = await Users.findAny(0, { in: {ID: forecasts.map(forecast => forecast.idUserCreated)} })

    forecasts.forEach(forecast => {
      const userCreate = users.find( user => user.ID === forecast.idUserCreated)

      forecast['userCreated'] = userCreate.DESCRIPTION
    })

    return forecasts
  }

  /**
   * @param {Object} where
   * @returns 
   */
  async findForecastClose(where){
    /** @type {IForecast[]} */
    const forecasts = await Forecast.findAny(0, where)

    if (forecasts.length === 0) {
      return []
    }

    const scriptSales = 
    `SELECT A.*, C.DESC_ABREV SHOP, B.NOMECLI, B.BAIRRO, B.ID_SALES, B.D_ENTREGA1, B.FONE, B.FAX, B.VENDEDOR, B.TOTAL,
    Convert(varchar, A.dateValidation, 103) + ' as ' +Convert(varchar, A.dateValidation, 8) dateValidationFormat
    FROM FORECAST_SALES A
    INNER JOIN SALES B ON A.idSale = B.ID
    INNER JOIN LOJAS C ON B.CODLOJA = C.CODLOJA
    WHERE A.idForecast IN (${forecasts.map(forecast => forecast.id)})
    `

    /** @type {IForecastSales[]} */
    const forecastSales = await Forecast._query(0, scriptSales, QueryTypes.SELECT)

    if (forecastSales.length === 0) {
      return []
    }

    const users = await Users.findAny(0, { in: {ID: forecasts.map(forecast => forecast.idUserCreated)} })

    forecasts.forEach(forecast => {
      const userCreate = users.find( user => user.ID === forecast.idUserCreated)

      forecast['userCreated'] = userCreate.DESCRIPTION
    })

    return forecasts
  }

  /**
   * @param {Object | string} where
   * @param {string | boolean} codLoja
   * @returns 
   */
  async findForecast(where, codLoja = false){
    /** @type {IForecast[]} */
    const forecasts = where === 'created' 
      ? await Forecast._query(0, 'select * from Forecast where [status] IS NULL OR [status] = 1', QueryTypes.SELECT)
      : await Forecast.findAny(0, where)

    if (forecasts.length === 0) {
      return []
    }

    const scriptSales = 
    `SELECT A.*, C.DESC_ABREV SHOP, B.NOMECLI, B.BAIRRO, B.ID_SALES, B.D_ENTREGA1, B.FONE, B.FAX, B.VENDEDOR, B.TOTAL,
    Convert(varchar, A.dateValidation, 103) + ' as ' +Convert(varchar, A.dateValidation, 8) dateValidationFormat
    FROM FORECAST_SALES A
    INNER JOIN SALES B ON A.idSale = B.ID
    INNER JOIN LOJAS C ON B.CODLOJA = C.CODLOJA
    WHERE A.idForecast IN (${forecasts.map(forecast => forecast.id)})
    ${codLoja ? `AND B.CODLOJA = ${codLoja} `: ''}
    `

    /** @type {IForecastSales[]} */
    const forecastSales = await Forecast._query(0, scriptSales, QueryTypes.SELECT)

    if (forecastSales.length === 0) {
      return []
    }

    const scriptProduct = `
    SELECT A.*, B.idForecast, C.NOME, D.NVTOTAL FROM FORECAST_PRODUCT A
    INNER JOIN FORECAST_SALES B ON A.idForecastSale = B.id
    INNER JOIN ${process.env.CD_BASE}..PRODUTOS C ON A.COD_ORIGINAL = C.ALTERNATI
    INNER JOIN SALES_PROD D ON D.COD_ORIGINAL = A.COD_ORIGINAL AND D.ID_SALE_ID = B.idSale
    WHERE A.idForecastSale in (${forecastSales.map(sale => sale.id)})`

    /**@type {IForecastProduct[]} */
    const forecastProduct = await Forecast._query(0, scriptProduct, QueryTypes.SELECT)

    forecastSales.forEach(sale => {
      sale['products'] = forecastProduct.filter(prod => prod.idForecastSale === sale.id)
    })

    const users = await Users.findAny(0, { in: {ID: forecasts.map(forecast => forecast.idUserCreated)} })

    forecasts.forEach(forecast => {
      forecast['sales'] = forecastSales.filter(sale => sale.idForecast === forecast.id)

      const userCreate = users.find( user => user.ID === forecast.idUserCreated)

      forecast['userCreated'] = userCreate.DESCRIPTION
    })

    return forecasts
  }

  async findForecastById({ id }){
    /** @type {IForecast[]} */
    const forecast = await Forecast.findAny(0, { id })
    if (forecast.length === 0) {
      throw {
        status: 404,
        message: 'Forecast not found!'
      }
    }

    const sales = await this.findSalesForecast({ id })

    forecast[0]['sales'] = sales

    return forecast[0]
  }

  async findSalesForecast({id}){
    const scriptSales = 
    `SELECT A.*, C.DESC_ABREV SHOP, B.NOMECLI, B.BAIRRO, B.ID_SALES, B.D_ENTREGA1, B.FONE, B.FAX, B.VENDEDOR, B.TOTAL,
    Convert(varchar, A.dateValidation, 103) + ' as ' +Convert(varchar, A.dateValidation, 8) dateValidationFormat
    FROM FORECAST_SALES A
    INNER JOIN SALES B ON A.idSale = B.ID
    INNER JOIN LOJAS C ON B.CODLOJA = C.CODLOJA
    WHERE A.idForecast = ${id}
    `

    /** @type {IForecastSales[]} */
    const forecastSales = await Forecast._query(0, scriptSales, QueryTypes.SELECT)

    if (forecastSales.length === 0) {
      return []
    }

    const scriptProduct = `
    SELECT A.*, B.idForecast, C.NOME, D.NVTOTAL FROM FORECAST_PRODUCT A
    INNER JOIN FORECAST_SALES B ON A.idForecastSale = B.id
    INNER JOIN ${process.env.CD_BASE}..PRODUTOS C ON A.COD_ORIGINAL = C.ALTERNATI
    INNER JOIN SALES_PROD D ON D.COD_ORIGINAL = A.COD_ORIGINAL AND D.ID_SALE_ID = B.idSale
    WHERE A.idForecastSale in (${forecastSales.map(sale => sale.id)})`

    /**@type {IForecastProduct[]} */
    const forecastProduct = await Forecast._query(0, scriptProduct, QueryTypes.SELECT)

    forecastSales.forEach(forecastSale => {
      forecastSale['products'] = forecastProduct.filter(prod => prod.idForecastSale === forecastSale.id)
    })

    return forecastSales
  }

  /** @param {PropsCreateForecast} props */
  async createForecast({ date, description, userId }) {
    const formatSqlForecastDate = ObjDate.setDaysInDate(date, 0)

    const idForecast = await Forecast.creatorAny(0, [{
      date: formatSqlForecastDate,
      idUserCreated: userId,
      description,
    }])

    return idForecast
  }

  /** @param {PropsSalesForecast} props */
  async createSalesForecast({ sales, userId, idForecast, add }){
    /**@type {IForecastSales[]} */
    const forecastSalesSaved = await ForecastSales.findAny(0, { idForecast, in: { idSale: sales.map( sale => sale.ID) }})

    const salesFiltered = sales
      .filter( sale => {
        const forecastSaleSaved = forecastSalesSaved.find( forecastSale => forecastSale.idSale === sale.ID)
        if (forecastSaleSaved) {
          return false
        }
        return true
      })
      .map(sale => ({
        idForecast,
        idSale: sale.ID,
        idUserCreate: userId
      }))

    if (salesFiltered.length > 0) {
      await ForecastSales.creatorAny(0, salesFiltered)

      if (add) {
        const forecastStatus = await Forecast.findAny(0, {id: idForecast, status: 1}, 'status')

        if (forecastStatus[0]) {
          const idCreate = await ForecastSales._query(0, 'SELECT MAX(id) id FROM FORECAST_SALES', QueryTypes.SELECT)
  
          await ForecastSales.updateAny(0, { canRemove: 0 }, { id: idCreate[0].id })
        }
      }
    }

    /**@type {IForecastSales[]} */
    const forecastSales = await ForecastSales.findAny(0, { idForecast })

    /**@type {IForecastProduct[] | []} */
    let forecastProduct = []

    for(let i = 0; i < sales.length; i++) {
      const forecastSale = forecastSales.find( forecastSale => forecastSale.idSale === sales[i].ID)

      if (forecastSale) {
        for(let j = 0; j < sales[i].products.length; j++) {
          const { COD_ORIGINAL } = sales[i].products[j]
  
          if ((sales[i].products[j].qtdDelivery + sales[i].products[j].QTD_MOUNTING) === sales[i].products[j].QUANTIDADE) {
            await SalesProd.updateAny(0, { STATUS: 'Em Previsão' }, {
              ID_SALE_ID: sales[i].ID,
              COD_ORIGINAL: COD_ORIGINAL
            })
          }
  
          const prod = await SalesProd.findAny(0, {ID_SALE_ID: sales[i].ID, STATUS: 'Enviado'})
  
          prod.length === 0 && await Sale.updateAny(0, { STATUS: 'Fechada' }, { ID: sales[i].ID })
  
          forecastProduct = [...forecastProduct, {
            idForecastSale: forecastSale.id,
            COD_ORIGINAL: sales[i].products[j].COD_ORIGINAL,
            quantityForecast: sales[i].products[j].qtdDelivery
          }]
        }
      }
    }

    await ForecastProduct.creatorAny(0, forecastProduct, true)
  }

  async updateForecast({ id, date, description }){
    const formatSqlForecastDate = ObjDate.setDaysInDate(date, 0)

    await Forecast.updateAny(0, {
      date: formatSqlForecastDate,
      description
    }, { id })
  }

  async startedForecast({ id }){
    const sales = await this.findSalesForecast({id})
    if (sales.length === 0) {
      throw {
        status: 409,
        message: 'Previsão não contêm vendas para validação'
      }
    }
    await Forecast.updateAny(0, { status: 1}, { id })

    await ForecastSales.updateAny(0, { canRemove: 0 }, { idForecast: id })
  }

  async authorizeRemove({ id }){
    await ForecastSales.updateAny(0, { canRemove: 1 }, { id })
  }

  /** @param { PropsDeleteSale } props */
  async deleteSaleForecast({ forecastSale }){
    await this.setSendStatusInSalesProd({ forecastSale })

    await ForecastProduct.deleteNotReturn(0, forecastSale.id, 'idForecastSale')

    await ForecastSales.deleteNotReturn(0, forecastSale.id)
  }

  /** @param {PropsValidation} props */
  async validateSale(props){
    await ForecastSales.updateAny(0, {
      idUserUpdate: props.userId,
      contact: props.contact,
      validationStatus: props.validationStatus ? 1 : 0,
      obs: props.obs,
      dateValidation: 'CURRENT_TIMESTAMP'
    },
    {
      id: props.id
    })
  }
  
  async invalidateSale({ id }){
    await ForecastSales.updateAny(0, { validationStatus: 0 }, { id })
  }
  
  async requestInvalidation({ id, obs, contact }){
    await ForecastSales.updateAny(0, {
      invalidationObs: `Solicitado por por ${contact} / Obs: ${obs}`,
      requestInvalidate: 1
    },
    { id })
  }
  
  async finishForecastService({ id }){
    /**@type {IForecastSales[]} */
    const forecastSales = await ForecastSales.findAny(0, { idForecast: id, validationStatus: 0 })

    if (forecastSales.length > 0) {
      /**@type {IForecastProduct[]} */
      const forecastProduct = await ForecastProduct.findAny(0, { in: { idForecastSale: forecastSales.map( sale => sale.id) }})

      for (let i = 0; i < forecastSales.length; i++) {
        const ID_SALE_ID = forecastSales[i].idSale

        const COD_ORIGINAL = forecastProduct
          .filter(product => product.idForecastSale === forecastSales[i].id)
          .map(product => product.COD_ORIGINAL)

        await SalesProd.updateAny(0, { STATUS: 'Enviado' }, { ID_SALE_ID, in: { COD_ORIGINAL } })
      }

      await Sale.updateAny(0, { STATUS: 'Aberta' }, { in: { ID: forecastSales.map( sale => sale.idSale)} })      
    }

    await Forecast.updateAny(0, { status: 0 }, { id })
  }

  async setSendStatusInSalesProd({ forecastSale }) {
    /** @type { IForecastProduct[] } */
    const forecastProduct = await ForecastProduct.findAny(0, { idForecastSale: forecastSale.id })

    await SalesProd.updateAny(0, { STATUS: 'Enviado' }, {
      ID_SALE_ID: forecastSale.idSale,
      in: {
        COD_ORIGINAL: forecastProduct.map(prod => prod.COD_ORIGINAL)
      }
    })

    await Sale.updateAny(0, { STATUS: 'Aberta' }, { ID: forecastSale.idSale })
  }

  async setIdDeliveryInForecastSales({ salesProd, idDelivery }){
    const idForecastSale = salesProd.map(prod => prod.idForecastSale)

    await ForecastSales.updateAny(0, { idDelivery }, { in: { id: idForecastSale } })
  }

  async setIdDeliveryNullInForecastSales({ idDelivery, idSale }, connectionEntrega){
    await ForecastSales._query(
      0,
      `UPDATE FORECAST_SALES SET idDelivery = NULL WHERE idDelivery = ${idDelivery} AND idSale = ${idSale}`,
      QueryTypes.UPDATE,
      connectionEntrega
    )
  }

  async setIdDeliveryNullInAllForecastSales({ idDelivery }){
    await ForecastSales._query(0, `UPDATE FORECAST_SALES SET idDelivery = NULL WHERE idDelivery = (${idDelivery})`, QueryTypes.UPDATE)
  }
}

module.exports = new ForecastService()