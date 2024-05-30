const PurchaseService = require("../services/PurchaseService");

module.exports = {
  async findPurchaseOrder(request, response) {
    try {
      const {type, search} = request.query

      const purchaseOrder = await PurchaseService.findPurchaseOrderByCodeOrIssue(
        type === 'code' ? search : '',
        type === 'issue' ? search : ''
      )

      return response.status(200).json({ purchaseOrder })
    } catch (e) {
      console.log(e)

      let status = e.status ? e.status : 400
      let error = e.error ? e.error : e

      return res.status(status).json(error)
    }
  },
  async findPurchaseOrderProduct(request, response) {
    try {
      const {id} = request.params

      const productsPurchaseOrder = await PurchaseService.findProductPurchase([id], 'ITEM')

      return response.status(200).json({ 
        productsPurchaseOrder: productsPurchaseOrder
          .map(prod => ({
            item: prod.ITEM,
            code: prod.CODPRODUTO,
            originalCode: prod.ALTERNATI,
            name: prod.NOME,
            quantify: prod.QTE_PEDIDO,
            value: prod.VLUNITARIO,
            total: prod.QTE_PEDIDO * prod.VLUNITARIO
          }))
      })
    } catch (e) {
      console.log(e)

      let status = e.status ? e.status : 400
      let error = e.error ? e.error : e

      return res.status(status).json(error)
    }
  },
}