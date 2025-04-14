const BalanceByBeepModel = require('../models/tables/BalanceByBeep')
const BalanceBySerieBeepModel = require('../models/tables/BalanceByBeep/BalanceByBeepSerie')
const ProdLojaSeriesMovimentosModel = require('../models/tables/ProdLojaSeriesMovimentos')
const balanceScripts = require('../scripts/balanceByBeep')
const DateSys = require('../class/Date')
const { QueryTypes } = require('sequelize')

class BalanceByBeepService {
  async open() {
    const balanceOpen = await BalanceByBeepModel.findAny(1, {
      isNull: 'dtFinish'
    })

    return balanceOpen.map(item => ({
      id: item.id,
      description: item.description,
      userId: item.userId,
      dtBalance: new DateSys(item.dtBalance).getBRDateTime().date,
      dtFinish: item.dtFinish ? new DateSys(item.dtFinish).getBRDateTime().date : null,
    }))
  }

  async findById(id) {
    const balance = await BalanceByBeepModel.findAny(1, {
      id
    })

    return {
      id: balance[0].id,
      description: balance[0].description,
      userId: balance[0].userId,
      dtBalance: new DateSys(balance[0].dtBalance).getBRDateTime().date,
      dtFinish: balance[0].dtFinish
        ? new DateSys(balance[0].dtFinish).getBRDateTime().date
        : null,
    }
  }

  async create({description, userId}, t) {
    const data = {
      description,
      userId,
      dtBalance: new Date().toISOString(),
    }

    await BalanceByBeepModel.create(1, [data], true, t)
  }

  async createBeep(t, { serialNumber, userId, balanceId }) {
    const balance = await BalanceByBeepModel.findAny(1, {
      isNull: 'dtFinish',
      id: balanceId
    }, 'id', t)

    if (balance.length === 0) {
      throw {
        status: 400,
        message: 'Número inválido ou não existe'
      }
    }

    const existingBeep = await BalanceBySerieBeepModel.findAny(1, {
      serialNumber,
      balanceId: balance[0].id
    }, 'serialNumber', t)

    if (existingBeep.length > 0) {
      throw {
        status: 400,
        message: 'Número de série já bipado nesse balanço'
      }
    }

    const existingSerial = await ProdLojaSeriesMovimentosModel.findAny(1, {
      serialNumber,
      isNull: 'outputModule'
    }, 'productId', t)

    if (existingSerial.length === 0) {
      return {
        notFoundSerialNumber: true,
      }
    }

    const scriptProduct = `SELECT * FROM PRODUTOS WHERE CODIGO = ${existingSerial[0].productId}`

    const product = await BalanceByBeepModel._query(1, scriptProduct, QueryTypes.SELECT, t)

    const data = {
      serialNumber,
      userId,
      dtBeep: new Date().toISOString(),
      balanceId: balance[0].id,
    }
    
    await BalanceBySerieBeepModel.create(1, [data], false, t)

    return {
      notFoundSerialNumber: false,
      product: product[0].NOME,
    }
  }

  async createBeepNotFound(t, {serialNumber, productId, userId, balanceId}) {
    const balance = await BalanceByBeepModel.findAny(1, {
      isNull: 'dtFinish',
      id: balanceId
    }, 'id', t)

    if (balance.length === 0) {
      throw {
        status: 400,
        message: 'Número inválido ou não existe'
      }
    }

    const existingBeep = await BalanceBySerieBeepModel.findAny(1, {
      serialNumber,
      balanceId: balance[0].id
    }, 'serialNumber', t)

    if (existingBeep.length > 0) {
      throw {
        status: 400,
        message: 'Número de série já bipado nesse balanço'
      }
    }

    const data = {
      balanceId: balance[0].id,
      userId,
      dtBeep: new Date().toISOString(),
      serialNumber,
      productIdNotFound: productId,
    }
    
    await BalanceBySerieBeepModel.create(1, [data], false, t)
  }

  async reportBalance(id) {
    const productsExcessScript = balanceScripts.balanceExcess(id)
    const productsExcess = await BalanceByBeepModel._query(1, productsExcessScript, QueryTypes.SELECT)

    const productsLackScript = balanceScripts.balanceLack(id)
    const productsLack = await BalanceByBeepModel._query(1, productsLackScript, QueryTypes.SELECT)

    const uniqueProductsWithDivergenceScript = balanceScripts.uniqueProductsWithDivergence(id)
    const uniqueProductsWithDivergence = await BalanceByBeepModel._query(1, uniqueProductsWithDivergenceScript, QueryTypes.SELECT)

    const quantityActiveProductsScript = balanceScripts.quantityActiveProducts()
    const quantityActiveProducts = await BalanceByBeepModel._query(1, quantityActiveProductsScript, QueryTypes.SELECT)

    const divergencePercentage = ((uniqueProductsWithDivergence.length / quantityActiveProducts[0].qtd) * 100).toFixed(2)

    return {
      productsExcess,
      productsLack,
      uniqueProductsWithDivergence: uniqueProductsWithDivergence.length,
      uniqueProductsExcess: uniqueProductsWithDivergence.filter(product => product.tipo === 'SOBRA').length,
      uniqueProductsLack: uniqueProductsWithDivergence.filter(product => product.tipo === 'FALTA').length,
      quantityActiveProducts: quantityActiveProducts[0].qtd,
      divergencePercentage,
    }
  }
}

module.exports = new BalanceByBeepService()
