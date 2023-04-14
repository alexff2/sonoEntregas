const { QueryTypes } = require('sequelize')
const Produtos = require("../models/Produtos")
const { difDate } = require('../functions/getDate')

class PurchaseService {
  async findPurchaseRequestToReport(){
    const script = `
      SELECT A.CODIGOPEDIDO, A.EMISSAO, A.VALORBRUTO, A.CODALTERNATIVO, A.OBSERVACAO OBS, SUM(B.VLUNITARIO * B.QTE_CHEGADA) VALOR_CHEGADA
      FROM PEDFOR A
      INNER JOIN VIEW_SALDO_PEDIDO_PRODUTO_VALOR B ON A.CODIGOPEDIDO = B.NUMPEDIDO
      WHERE B.QTE_PEDIDO > B.QTE_CHEGADA
      AND A.EMISSAO > '2022-06-01'
      GROUP BY A.CODIGOPEDIDO, A.EMISSAO, A.VALORBRUTO, A.CODALTERNATIVO, A.OBSERVACAO    
    `
    const purchases = await Produtos._query(1, script, QueryTypes.SELECT)

    purchases.forEach(purchase => {
      const millisecondsIssuance = new Date(purchase.EMISSAO).setHours(0,0,0,0)
      const millisecondsNow = new Date().setHours(0,0,0,0)

      const daysIssuance = difDate(millisecondsIssuance, millisecondsNow)

      purchase['DIAS_EMIS'] = daysIssuance
      purchase['difValue'] = purchase.VALORBRUTO - purchase.VALOR_CHEGADA
    })

    return purchases
  }
}

module.exports = new PurchaseService()