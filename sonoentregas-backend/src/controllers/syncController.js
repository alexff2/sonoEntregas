const shopsConnection = require('../databases/MSSQL/connections')
const SynchroService = require('../services/SynchroService')

module.exports = {
  async synchronize(request, response) {
    try {
      const shops = {}
    let productsSoldQuery = []

    for(const shopId in shopsConnection) {
      if (shopId >= 2) {
        const resultConnection = await SynchroService.getTableProductsSoldInShops(shopId)

        if (resultConnection.data) {
          productsSoldQuery = [ ...productsSoldQuery,...resultConnection.data]
        }

        shops[shopsConnection[shopId].database] = resultConnection.msg
      }
    }

    if (productsSoldQuery.length > 0) {
      await SynchroService.checkTableProductSold(productsSoldQuery)
    }

    return response.status(200).json({ message: 'Sincronização realizada com sucesso!', shops })
    } catch (e) {
      console.log(e)

      let status = e.status ? e.status : 400
      let error = e.error ? e.error : e

      return response.status(status).json(error)
    }
    
  }
}