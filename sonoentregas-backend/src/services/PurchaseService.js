const { QueryTypes } = require('sequelize')
const Produtos = require("../models/Produtos")
const { difDate } = require('../functions/getDate')

class PurchaseService {
  async findPurchaseRequestToReport(){
    const script = `
    SELECT A.CODIGOPEDIDO, C.NOME NOME_FOR, A.EMISSAO, A.VALORBRUTO, D.VALOR_CHEGADA, A.VALORBRUTO - D.VALOR_CHEGADA VL_REST, A.CODALTERNATIVO,
    A.OBSERVACAO OBS
    FROM PEDFOR A
    INNER JOIN VIEW_SALDO_PEDIDO_PRODUTO_VALOR B ON A.CODIGOPEDIDO = B.NUMPEDIDO
    INNER JOIN CADFOR C ON A.CODFOR = C.CODIGO
    INNER JOIN (
        SELECT NUMPEDIDO, SUM(QTE_CHEGADA * VLUNITARIO) VALOR_CHEGADA 
        FROM VIEW_SALDO_PEDIDO_PRODUTO_VALOR
        GROUP BY NUMPEDIDO ) D ON A.CODIGOPEDIDO = D.NUMPEDIDO
    WHERE B.QTE_PEDIDO > B.QTE_CHEGADA
    GROUP BY A.CODIGOPEDIDO, A.EMISSAO, A.VALORBRUTO, A.CODALTERNATIVO, A.OBSERVACAO, C.NOME, D.VALOR_CHEGADA`

    const purchases = await Produtos._query(1, script, QueryTypes.SELECT)
    const purchasesProducts = await this.findProductPurchase(purchases.map( purchase => purchase.CODIGOPEDIDO))

    purchases.forEach(purchase => {
      const millisecondsIssuance = new Date(purchase.EMISSAO).setHours(0,0,0,0)
      const millisecondsNow = new Date().setHours(0,0,0,0)

      const daysIssuance = difDate(millisecondsIssuance, millisecondsNow)

      purchase['DIAS_EMIS'] = daysIssuance
      purchase['difValue'] = purchase.VALORBRUTO - purchase.VALOR_CHEGADA

      purchase['products'] = purchasesProducts.filter(product => product.NUMPEDIDO === purchase.CODIGOPEDIDO)
    })

    return purchases
  }

  async findProductPurchase(idsPurchase){
    const script = `
      SELECT A.*, B.NOME, B.ALTERNATI
      FROM VIEW_SALDO_PEDIDO_PRODUTO_VALOR A
      INNER JOIN PRODUTOS B ON A.CODPRODUTO = B.CODIGO
      WHERE A.NUMPEDIDO IN (${idsPurchase})
      ORDER BY NOME
    `

    const productsPurchase = await Produtos._query(1, script, QueryTypes.SELECT)

    return productsPurchase
  }
}

module.exports = new PurchaseService()