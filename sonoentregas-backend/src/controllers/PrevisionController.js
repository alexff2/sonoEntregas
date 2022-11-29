const { createPrevision, validationSale } = require('../services/PrevisionService')
const { checkDateBr } = require('../functions/checkDate')

module.exports = {
  async findOpenPrevision(){},
  async findClosedPrevision(){},
  async create(req, res){
    try {
      const { datePrevision, sales } = req.body
      const { id: userId } = req.user

      if (!datePrevision || !sales) {
        return res.status(400).json('Informe a data da previsão no formato mes(2 char)/dia(2 char)/ano(4 char) e as vendas num array de objetos')
      }

      checkDateBr(datePrevision)

      await createPrevision({ datePrevision, userId, sales }) 

      return res.status(201).json('')
    } catch (e) {
      console.log(e)

      let status = e.status ? e.status : 400
      let error = e.error ? e.error : e

      return res.status(status).json(error)
    }
  },
  async validation(req, res){
    try {
      const { id, validationStatus, contact } = req.body
      
      const { id: userId } = req.user

      if (!id || !validationStatus, contact) {
        return res.status(400).json('Informe todos os dados necessários')
      }

      await validationSale({
        id,
        validationStatus,
        contact,
        userId
      })

      return res.status(200).json('')
    } catch (e) {
      console.log(e)

      let status = e.status ? e.status : 400
      let error = e.error ? e.error : e

      return res.status(status).json(error)
    }
  },
  async finishPrevision(req, res){}
}