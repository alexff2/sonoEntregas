const { salesDevInf } = require('../services/homeService')

module.exports = {
  async index( _req, res){
    const {
      salesPending,
      salesUnscheduled,
      salesOnRelease,
      salesOnDelivering,
      devOnRelease,
      delivering
    } = await salesDevInf()

    return res.json({ 
      salesPending,
      salesUnscheduled,
      salesOnRelease,
      salesOnDelivering,
      devOnRelease,
      delivering
    })
  }
}