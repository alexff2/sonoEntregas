const BalanceByBeepModel = require('../models/tables/BalanceByBeep')
const BalanceBySerieBeepModel = require('../models/tables/BalanceByBeep/BalanceByBeepSerie')
const ProdLojaSeriesMovimentosModel = require('../models/tables/ProdLojaSeriesMovimentos')
const DateSys = require('../class/Date')
const { QueryTypes } = require('sequelize')

class BalanceByBeepService {
  async open(data, t) {
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

  async create({description, userId}, t) {
    const existingBalanceOpen = await BalanceByBeepModel.findAny(1, {
      isNull: 'dtFinish'
    })

    if (existingBalanceOpen.length > 0) {
      throw {
        status: 400,
        message: 'There is already an open balance.'
      }
    }

    const data = {
      description,
      userId,
      dtBalance: new Date().toISOString(),
    }

    await BalanceByBeepModel.create(1, [data], true, t)
  }

  async createBeep(serialNumber, userId, t) {
    const balance = await BalanceByBeepModel.findAny(1, {
      isNull: 'dtFinish'
    }, 'id', t)

    if (balance.length === 0) {
      throw {
        status: 400,
        message: 'Não existe balanço aberto'
      }
    }

    if (balance.length > 1) {
      throw {
        status: 400,
        message: 'Existe mais de um balanço aberto, entre em contato com o suporte'
      }
    }

    const existingBeep = await BalanceBySerieBeepModel.findAny(1, {
      serialNumber
    }, 'serialNumber', t)
    

    if (existingBeep.length > 0) {
      throw {
        status: 400,
        message: 'Serial já cadastrado'
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

  async createBeepNotFound(serialNumber, productId, userId, t) {
    const balance = await BalanceByBeepModel.findAny(1, {
      isNull: 'dtFinish'
    }, 'id', t)

    if (balance.length === 0) {
      throw {
        status: 400,
        message: 'Não existe balanço aberto'
      }
    }

    if (balance.length > 1) {
      throw {
        status: 400,
        message: 'Existe mais de um balanço aberto, entre em contato com o suporte'
      }
    }

    const existingBeep = await BalanceBySerieBeepModel.findAny(1, {
      serialNumber
    }, 'serialNumber', t)
    

    if (existingBeep.length > 0) {
      throw {
        status: 400,
        message: 'Serial já cadastrado'
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

  async reportBalance(data) {
    /* const report = await BalanceByBeepModel.create(data)
    return report */
  }
}

module.exports = new BalanceByBeepService()
