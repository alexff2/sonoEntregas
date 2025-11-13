const { QueryTypes } = require('sequelize')
const ProductSceModel = require('../../models/ProdutosSce')

class UpdatePurchaseCost {
  async execute(id, purchaseCost) {
    const sql = `UPDATE PRODLOJAS SET PCO_COMPRA = ${purchaseCost} WHERE CODLOJA = 1 AND CODIGO = ${id}`
    await ProductSceModel._query(1, sql, QueryTypes.UPDATE)
  }
}

module.exports = new UpdatePurchaseCost()
