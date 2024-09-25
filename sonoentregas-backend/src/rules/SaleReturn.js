//const SaleReturnModel = require('../models/tables/Returns/index')
const ProdLojaSeriesMovimentosModel = require('../models/tables/ProdLojaSeriesMovimentos')
class SaleReturnRules {
  async checkIfReturnedSaleStartedBeeping(saleReturnId) {
    const productSerial = await ProdLojaSeriesMovimentosModel.findAny(1, {
      inputModule: 'saleReturn',
      inputModuleId: saleReturnId
    })
    return productSerial.length > 0
  }
}

module.exports = new SaleReturnRules()