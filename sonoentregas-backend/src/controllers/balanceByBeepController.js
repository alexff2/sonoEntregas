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
  async findById(request, response) {
    try {
      const { id } = request.params

      const balance = await BalanceByBeepService.findById(id)

      return response.status(200).json({
        balance
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
      const { serialNumber, balanceId } = request.body
      const userId = request.user.id

      if(serialNumber.length > 10 || isNaN(Number(serialNumber)) || Number(serialNumber) <= 0) {
        throw {
          status: 400,
          message: 'Número invalido!',
        }
      }

      const result = await BalanceByBeepService.createBeep(connections, {
        serialNumber,
        userId,
        balanceId
      })

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
      const { serialNumber, productId, balanceId } = request.body
      const userId = request.user.id

      await BalanceByBeepService.createBeepNotFound(connections, {
        serialNumber,
        userId,
        productId,
        balanceId
      })

      await connections.transaction.commit()
      return response.status(201).json({message: 'Beep created successfully'})
    } catch (error) {
      errorCath(error, response)
      await connections.transaction.rollback()
    }
  },
  async reportBalance(request, response){
    try {
      const { id } = request.params

      const data = await BalanceByBeepService.reportBalance(id)
      const balance = await BalanceByBeepService.findById(id)
      data.balance = balance
      return response.status(200).json(data)
    } catch (error) {
      errorCath(error, response)
    }
  },
  async close(request, response) {
    const connections = await BalanceByBeepModel._query(1)
    try {
      const { id } = request.params
      const userId = request.user.id

      await BalanceByBeepService.close(connections, {id, userId })

      await connections.transaction.commit()
      return response.status(200).json({message: 'Balance closed successfully'})
    } catch (error) {
      await connections.transaction.rollback()
      errorCath(error, response)
    }
  },
}