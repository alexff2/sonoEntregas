const { QueryTypes } = require('sequelize')
const Produtos = require("../models/Produtos")
const DB = require("../models/Produtos")
const scriptPurchaseOrder = require('../scripts/purchaseOrder')
const { difDate } = require('../functions/getDate')
const DateTime = require('../class/Date')

class PurchaseOrderService {
  async findToReport(){
    const script = scriptPurchaseOrder.findPurchaseOrderToReport()

    const purchases = await Produtos._query(1, script, QueryTypes.SELECT)
    const purchasesProducts = await this.findProducts(purchases.map( purchase => purchase.CODIGOPEDIDO))

    purchases.forEach(purchase => {0
      purchase['products'] = purchasesProducts.filter(product => product.NUMPEDIDO === purchase.CODIGOPEDIDO)
    })

    return purchases
  }

  async findByCodeOrIssueOrOpen({code = '', issue ='', open = true}) {
    const script = scriptPurchaseOrder.purchaseOrder({code, issue, open})

    const purchaseOrder = await Produtos._query(1, script, QueryTypes.SELECT)

    return purchaseOrder
  }

  async findProducts(idsPurchase, order = 'NOME'){
    const script = scriptPurchaseOrder.purchaseOrderProduct(idsPurchase, order)

    const productsPurchaseOrder = await Produtos._query(1, script, QueryTypes.SELECT)

    return productsPurchaseOrder
      .map(prod => ({
        item: prod.ITEM,
        code: prod.CODPRODUTO,
        originalCode: prod.ALTERNATI,
        name: prod.NOME,
        quantity: prod.QTE_PEDIDO,
        quantityArrived: prod.QTE_CHEGADA,
        value: prod.VLUNITARIO,
        total: prod.QTE_PEDIDO * prod.VLUNITARIO,
        ...prod,
      }))
  }

  async create() {
    const date = new DateTime().getISODateTimeBr2().date

    const maxId = await DB._query(1, scriptPurchaseOrder.maxId(), QueryTypes.SELECT)
    const maxSequence = await DB._query(1, scriptPurchaseOrder.maxSequence(), QueryTypes.SELECT)

    const script = scriptPurchaseOrder.insert({
      id: 1 + maxId[0].MAX_ID,
      issue: date,
      sequence: 1 + maxSequence[0].MAX_SEQUENCIA
    })

    await DB._query(1, script)

    const purchaseStart = await this.findByCodeOrIssueOrOpen({})

    return purchaseStart[0]
  }

  async update(field, value, id) {
    const fieldData = {
      issue: 'EMISSAO',
      type: 'TIPOFRETE',
      factoryData: 'FACTORY_DATA',
      obs: 'OBSERVACAO',
      employeeId: 'COMPRADOR',
    }

    if (field === 'type') {
      value = value === 'normal' ? 'CIF' : 'FOB'
    }

    if (fieldData[field] === undefined) {
      throw new Error('Error interno!')
    }

    await DB._query(1, scriptPurchaseOrder.updateByField(fieldData[field], value, id))
  }

  async addProduct({
    id,
    productId,
    productName,
    quantity,
    value
  }) {
    const itemDb = await DB._query(1, scriptPurchaseOrder.maxItem(id), QueryTypes.SELECT)

    const item = !itemDb[0].MAX_ITEM ? 1 : itemDb[0].MAX_ITEM + 1

    const script = scriptPurchaseOrder.insertProduct({
      id,
      productId,
      productName,
      quantity,
      value,
      item
    })

    await DB._query(1, script)

    return item
  }

  async updateValues(id) {
    const script = scriptPurchaseOrder.updateValues(id)

    await DB._query(1, script)
  }

  async rmvProduct({id, item}) {
    const script = scriptPurchaseOrder.rmvProduct(id, item)

    await DB._query(1, script)
  }

  async changeQuantity({ id, item, quantity}) {
    const script = scriptPurchaseOrder.changeQuantity(id, item, quantity)

    await DB._query(1, script)
  }

  async close(id) {
    const script = scriptPurchaseOrder.close(id)

    await DB._query(1, script)
  }

  async open(id) {
    const script = scriptPurchaseOrder.open(id)

    await DB._query(1, script)
  }
}

module.exports = new PurchaseOrderService()