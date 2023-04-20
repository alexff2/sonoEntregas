const { salesDevInf } = require('../services/homeService')

module.exports = {
  async index( req, res){
    const { salesPending,
      salesOnRelease,
      salesOnDelivering,
      devOnRelease,
      delivering } = await salesDevInf()

    return res.json({ 
      salesPending,
      salesOnRelease,
      salesOnDelivering,
      devOnRelease,
      delivering
    })
  }
}