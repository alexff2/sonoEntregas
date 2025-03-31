//@ts-check
/**
 * @typedef {Object} InputProps
 * @property {number} serialNumber
 * @property {number} productId
 * @property {string} module
 * @property {number} moduleId
 * @property {number} userId
 * @property {Object} connection
 * 
 * @typedef {Object} OutputProps
 * @property {number} productId
 * @property {number} serialNumber
 * @property {string} module
 * @property {number} moduleId
 * @property {number} userId
 * @property {Object} connection
 * 
 * @typedef {Object} IProdLojaSeries
 * @property {number} productId
 * @property {number} serialNumber
 * @property {string} inputModule
 * @property {number} inputModuleId
 * @property {string} inputBeepDate
 * @property {number} inputUserId
 */

const { QueryTypes } = require('sequelize')
const ProdLojaSeriesMovimentosModel = require('../models/tables/ProdLojaSeriesMovimentos')
const ProductService = require('../services/ProductsService')
const scriptsBeepPendantModule = require('../scripts/beepPendantModule')

class SerieService {
  /**@param {InputProps} props */
  async create({productId, serialNumber, module, moduleId, userId, connection}) {
    /**@type {IProdLojaSeries} */
    const prodLojasSeries = {
      productId: productId,
      serialNumber,
      inputModule: module,
      inputModuleId: moduleId,
      inputBeepDate: new Date().toISOString(),
      inputUserId: userId
    }

    const prodLojasSeriesResponse = await ProdLojaSeriesMovimentosModel.create(1, [prodLojasSeries], true, connection)

    return prodLojasSeriesResponse.serialNumber
  }

  /**@param {OutputProps} props */
  async output({ productId, serialNumber, module, moduleId, userId, connection}) {
    await ProdLojaSeriesMovimentosModel.updateAny(
      1,
      {
        outputModule: module,
        outputModuleId: moduleId,
        outputBeepDate: new Date().toISOString(),
        outputUserId: userId
      },
      {
        serialNumber,
        isNull: 'outputBeepDate',
        productId
      },
      connection
    )
  }

  async findOpenSerieByProduct(code){
      const products = await ProdLojaSeriesMovimentosModel.findAny(1, {
        productId: code,
        isNull: 'outputBeepDate'
      })

      if (products.length === 0) {
        return []  
      }

      return products.map(product => product.serialNumber)
  }

  async findSerialNumberOfProduct(serialNumber){
    const serialNumberOfProduct = await ProdLojaSeriesMovimentosModel.findAny(1, {
      serialNumber,
      isNull: 'outputBeepDate'
    })

    if (serialNumberOfProduct.length === 0) {
      return []  
    }

    const product = await ProductService.findProductsSceCd({ CODIGO: serialNumberOfProduct[0].productId })

    return {
      id: product[0].CODIGO,
      name: product[0].NOME,
      generalCode: product[0].ALTERNATI,
      serialNumber
    }
  }

  async changeSerialNumberOfProduct({ serialNumber, newProductId, transaction }) {
    const serialNumberOfProduct = await ProdLojaSeriesMovimentosModel.findAny(1, {
      serialNumber,
      isNull: 'outputBeepDate'
    }, 'productId', transaction)

    if (serialNumberOfProduct.length !== 1) {
      throw {
        error: 'Change not allowed'
      }
    }

    await ProdLojaSeriesMovimentosModel.updateAny(
      1,
      {
        productId: newProductId
      },
      {
        serialNumber,
        isNull: 'outputBeepDate'
      },
      transaction
    )
  }

  async changeInputModuleId({ oldModuleId, newModuleId, transaction }) {
    const serialNumbers = await ProdLojaSeriesMovimentosModel.findAny(1, {
      inputModuleId: oldModuleId,
    }, 'serialNumber', transaction)

    if (serialNumbers.length === 0) {
      return
    }

    await ProdLojaSeriesMovimentosModel.updateAny(
      1,
      {
        inputModuleId: newModuleId
      },
      {
        inputModuleId: oldModuleId,
      },
      transaction
    )
  }

  async beepPendantModules(where) {
    const script = scriptsBeepPendantModule(where)

    const data = await ProdLojaSeriesMovimentosModel._query(0, script, QueryTypes.SELECT)
    console.log('data', data)

    const modules = []

    for (const item of data) {
      if (!modules.some(module => module.description === item.MODULE)) {
        modules.push({
          description: item.MODULE,
          data: [{
            id: item.ID,
            date: item.DATA.toLocaleDateString(),
            obs: item.OBS,
            qtd: item.QTD,
            qtd_beep: item.QTD_BEEP
          }]
        })
      } else {
        const moduleFind = modules.find(module => module.description === item.MODULE)

        moduleFind?.data.push({
          id: item.ID,
          date: item.DATA.toLocaleDateString(),
          obs: item.OBS,
          qtd: item.QTD,
          qtd_beep: item.QTD_BEEP
        })
      }
    }

    return modules
  }
}

module.exports = new SerieService()