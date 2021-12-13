const { salesDevInf } = require('../services/homeService')

module.exports = {
  async index( req, res){
    const { salesPending,
      salesOnRelease,
      salesOnDelivring,
      devOnRelease,
      delivering } = await salesDevInf()

    return res.json({ 
      salesPending,
      salesOnRelease,
      salesOnDelivring,
      devOnRelease,
      delivering
    })
  }
}