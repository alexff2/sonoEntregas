const BalanceByBeepModel = require('../models/tables/BalanceByBeep')
const DateSys = require('../class/Date')

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

  async createBeep(data) {
    /* const beep = await BalanceByBeepModel.create(data)
    return beep */
  }

  async reportBalance(data) {
    /* const report = await BalanceByBeepModel.create(data)
    return report */
  }
}

module.exports = new BalanceByBeepService()
