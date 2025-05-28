//@ts-check

/**
 * @typedef {Object} IProduct
 * @property {number} ID_SALE_ID
 * @property {string} COD_ORIGINAL
 * @property {number} QUANTIDADE
 * @property {number} QTD_MOUNTING
 * @property {number} qtdDelivery
 * @property {number} ID_MAINTENANCE
 * 
 * @typedef {Object} ISale
 * @property {number} ID
 * @property {number} ID_MAINTENANCE
 * @property {IProduct[]} products
 * 
 * @typedef {Object} IForecastSales
 * @property {number} id
 * @property {number} idForecast
 * @property {number} idForecastSale
 * @property {number} idSale
 * @property {IForecastProduct[]} products
 * @property {boolean} validationStatus
 * @property {boolean} isMaintenance
 * 
 * @typedef {Object} IForecastProduct
 * @property {number} idForecastSale
 * @property {string} COD_ORIGINAL
 * @property {number} quantityForecast
 * @property {number | undefined} ID_MAINTENANCE
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
 * @property {ISale} sale
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
const MaintenanceModel = require('../models/tables/Maintenance')
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
    `SELECT A.*, C.DESC_ABREV SHOP, B.NOMECLI, B.BAIRRO, B.ID_SALES, B.D_ENTREGA1, B.FONE, B.FAX, B.VENDEDOR, B.TOTAL, B.EMISSAO,
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
  async createSalesForecast({ sale, userId, idForecast, add }) {
    /**@type {IForecastSales[]} */
    const forecastSaleSaved = await ForecastSales.findAny(0, { idForecast, idSale: sale.ID })

    const connectionEntrega = await Forecast._query(0)
    
    try {  
      if (forecastSaleSaved.length === 0) {
        await ForecastSales.creatorAny(0, [{
          idForecast,
          idSale: sale.ID,
          idUserCreate: userId,
          isMaintenance: sale.ID_MAINTENANCE ? 1 : 0,
        }], false, connectionEntrega)
  
        if (add) {
          const forecastStatus = await Forecast.findAny(0, {id: idForecast, status: 1}, 'status', connectionEntrega)
  
          if (forecastStatus[0]) {
            const idCreate = await ForecastSales._query(0, 'SELECT MAX(id) id FROM FORECAST_SALES', QueryTypes.SELECT, connectionEntrega)
    
            await ForecastSales.updateAny(0, { canRemove: 0 }, { id: idCreate[0].id }, connectionEntrega)
          }
        }
      }

      let forecastProduct = []

      /**@type {IForecastSales[]} */
      const forecastSale = await ForecastSales.findAny(0, { idForecast, idSale: sale.ID }, '*', connectionEntrega)

      if (forecastSale[0]) {
        for(let j = 0; j < sale.products.length; j++) {
          const { COD_ORIGINAL, qtdDelivery, QTD_MOUNTING, QUANTIDADE, ID_MAINTENANCE } = sale.products[j]
  
          if ((qtdDelivery + QTD_MOUNTING) === QUANTIDADE) {
            ID_MAINTENANCE
              ? await MaintenanceModel.updateAny(0, { STATUS: 'Em Previsão' }, { ID: ID_MAINTENANCE }, connectionEntrega)
              : await SalesProd.updateAny(0, { STATUS: 'Em Previsão' }, { ID_SALE_ID: sale.ID, COD_ORIGINAL: COD_ORIGINAL }, connectionEntrega)
          }

          if (!ID_MAINTENANCE) {
            const prod = await SalesProd.findAny(0, {ID_SALE_ID: sale.ID, STATUS: 'Enviado'}, 'COD_ORIGINAL', connectionEntrega)
            prod.length === 0 && await Sale.updateAny(0, { STATUS: 'Fechada' }, { ID: sale.ID }, connectionEntrega)
          }

          const dataForecastProduct = ID_MAINTENANCE
            ? {
              idForecastSale: forecastSale[0].id,
              COD_ORIGINAL: COD_ORIGINAL,
              quantityForecast: qtdDelivery,
              ID_MAINTENANCE: ID_MAINTENANCE,
            } : {
              idForecastSale: forecastSale[0].id,
              COD_ORIGINAL: COD_ORIGINAL,
              quantityForecast: qtdDelivery,
            }

          forecastProduct = [...forecastProduct, dataForecastProduct]
        }
      }

      await ForecastProduct.creatorAny(0, forecastProduct, true, connectionEntrega)

      await connectionEntrega.transaction.commit()
    } catch (error) {
      try {
        await connectionEntrega.transaction.rollback()
      } catch (rollbackError) {
        console.warn('Erro ao tentar dar rollback:', rollbackError.message)
      }
      throw error
    }
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
    forecastSale.isMaintenance 
      ? await MaintenanceModel.updateAny(0, { STATUS: 'No CD' }, { in: {ID: forecastSale.products.map(prod => prod.ID_MAINTENANCE)} })
      : await this.setSendStatusInSalesProd({ forecastSale })

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
  
  async finishForecastService({ id }, connectionEntrega){
    /**@type {IForecastSales[]} */
    const salesDeniedForecast = await ForecastSales.findAny(0, { idForecast: id, validationStatus: 0 }, '*', connectionEntrega)

    if (salesDeniedForecast.length > 0) {
      /**@type {IForecastProduct[]} */
      const forecastProducts = await ForecastProduct.findAny(0, { in: { idForecastSale: salesDeniedForecast.map( saleForecast => saleForecast.id) }}, '*', connectionEntrega)

      for (let i = 0; i < salesDeniedForecast.length; i++) {
        const ID_SALE_ID = salesDeniedForecast[i].idSale

        const forecastProduct = forecastProducts
          .filter(product => product.idForecastSale === salesDeniedForecast[i].id)

        salesDeniedForecast[i].isMaintenance
          ? await MaintenanceModel.updateAny(0, { STATUS: 'No CD' }, { in: {ID: forecastProduct.map(prod => prod.ID_MAINTENANCE)} }, connectionEntrega)
          : await SalesProd.updateAny(
            0,
            { STATUS: 'Enviado' },
            { ID_SALE_ID, in: { COD_ORIGINAL: forecastProduct.map(product => product.COD_ORIGINAL) } },
            connectionEntrega
          )
      }
      
      const salesDeniedForecastNotMaintenance = salesDeniedForecast.filter(sale => !sale.isMaintenance)

      if(salesDeniedForecastNotMaintenance.length > 0) {
        await Sale.updateAny(0, { STATUS: 'Aberta' }, { in: { ID: salesDeniedForecastNotMaintenance.map( sale => sale.idSale)} }, connectionEntrega)
      }
    }

    await Forecast.updateAny(0, { status: 0 }, { id }, connectionEntrega)
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

  async setIdDeliveryNullInAllForecastSales({ idDelivery }){
    await ForecastSales._query(0, `UPDATE FORECAST_SALES SET idDelivery = NULL WHERE idDelivery = (${idDelivery})`, QueryTypes.UPDATE)
  }
}

module.exports = new ForecastService()