const errorCath = require('../functions/error')
const BalanceByBeepService = require('../services/BalanceByBeepService')
const BalanceByBeepModel = require('../models/tables/BalanceByBeep')

module.exports = {
  async open(request, response) {
    try {
      const balanceOpen = await BalanceByBeepService.open()

      return response.status(200).json({
        balanceOpen
      })
    } catch (error) {
      errorCath(error, response)
    }
  },
  async create(request, response) {
    const connections = await BalanceByBeepModel._query(1)

    try {
      const { description } = request.body
      const userId = request.user.id

      await BalanceByBeepService.create({description, userId}, connections)

      await connections.transaction.commit()
      return response.status(201).json({
        message: 'Balance created successfully'
      })
    } catch (error) {
      await connections.transaction.rollback()
      errorCath(error, response)
    }
  },
  async createBeep(request, response) {
    const connections = await BalanceByBeepModel._query(1)
    try {
      const { serialNumber } = request.body
      const userId = request.user.id

      const result = await BalanceByBeepService.createBeep(serialNumber, userId, connections)

      await connections.transaction.commit()
      return response.status(201).json(result)
    } catch (error) {
      await connections.transaction.rollback()
      errorCath(error, response)
    }
  },
  async createBeepNotFound(request, response) {
    const connections = await BalanceByBeepModel._query(1)
    try {
      const { serialNumber, productId } = request.body
      const userId = request.user.id

      await BalanceByBeepService.createBeepNotFound(serialNumber, productId, userId, connections)

      await connections.transaction.commit()
      return response.status(201).json({message: 'Beep created successfully'})
    } catch (error) {
      errorCath(error, response)
      await connections.transaction.rollback()
    }
  },
  async reportBalance(request, response){
    try {
      
    } catch (error) {
      errorCath(error, response)
    }
  }
}