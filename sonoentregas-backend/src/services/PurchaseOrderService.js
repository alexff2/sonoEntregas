// @ts-check
const { QueryTypes } = require('sequelize')
const Produtos = require("../models/Produtos")
const DB = require("../models/Produtos")
const scriptPurchaseOrder = require('../scripts/purchaseOrder')
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

  async findByCodeOrIssueOrOpen({code = '', issue =''}, connection) {
    const script = scriptPurchaseOrder.purchaseOrder({code, issue})

    const purchaseOrder = await Produtos._query(1, script, QueryTypes.SELECT, connection)

    return purchaseOrder
  }

  async findProducts(idsPurchase, order = 'NOME', connection){
    const script = scriptPurchaseOrder.purchaseOrderProduct(idsPurchase, order)

    const productsPurchaseOrder = await Produtos._query(1, script, QueryTypes.SELECT, connection)

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

  async create(connection) {
    const date = new DateTime().getISODateTimeBr2().date

    const maxId = await DB._query(1, scriptPurchaseOrder.maxId(), QueryTypes.SELECT, connection)
    const maxSequence = await DB._query(1, scriptPurchaseOrder.maxSequence(), QueryTypes.SELECT, connection)

    const script = scriptPurchaseOrder.insert({
      id: 1 + maxId[0].MAX_ID,
      issue: date,
      sequence: 1 + maxSequence[0].MAX_SEQUENCIA
    })

    await DB._query(1, script, QueryTypes.INSERT, connection)

    const purchaseStart = await this.findByCodeOrIssueOrOpen({}, connection)

    return purchaseStart[0]
  }

  async update(field, value, id, connection) {
    const fieldData = {
      issue: 'EMISSAO',
      type: 'TIPOFRETE',
      type1: 'TIPO_PEDIDO',
      factoryData: 'FACTORY_DATA',
      obs: 'OBSERVACAO',
      employeeId: 'COMPRADOR',
    }

    if (field === 'type') {
      value === 'normal'
        ? await DB._query(1, scriptPurchaseOrder.setProductValues(id), QueryTypes.UPDATE, connection)
        : await DB._query(1, scriptPurchaseOrder.setProductMaintenanceValues(id), QueryTypes.UPDATE, connection)

      value = value === 'normal' ? 'CIF' : 'FOB'

      await DB._query(1, scriptPurchaseOrder.updateTotalValues(id), QueryTypes.UPDATE, connection)
    }

    if (field === 'type1') {
      value = value === 'normal' ? '1' : '0'
    }

    if (fieldData[field] === undefined) {
      throw new Error('Error interno!')
    }

    await DB._query(1, scriptPurchaseOrder.updateByField(fieldData[field], value, id), QueryTypes.UPDATE, connection)
  }

  async addProduct({
    id,
    productId,
    productName,
    quantity,
    value,
    type1,
    connection
  }) {
    const itemDb = await DB._query(1, scriptPurchaseOrder.maxItem(id), QueryTypes.SELECT, connection)

    const item = !itemDb[0].MAX_ITEM ? 1 : itemDb[0].MAX_ITEM + 1

    const script = scriptPurchaseOrder.insertProduct({
      id,
      productId,
      productName,
      quantity,
      value: type1 === 'normal' ? value : 0,
      item
    })

    await DB._query(1, script, QueryTypes.INSERT, connection)

    return item
  }

  async updateTotalValues(id, connection) {
    const script = scriptPurchaseOrder.updateTotalValues(id)

    await DB._query(1, script, QueryTypes.UPDATE, connection)
  }

  async rmvProduct({id, item}, connection) {
    const script = scriptPurchaseOrder.rmvProduct(id, item)

    await DB._query(1, script, QueryTypes.DELETE, connection)
  }

  async changeQuantity({ id, item, quantity}, connection) {
    const script = scriptPurchaseOrder.changeQuantity(id, item, quantity)

    await DB._query(1, script, QueryTypes.UPDATE, connection)
  }

  async close(id, connection) {
    const script = scriptPurchaseOrder.close(id)

    await DB._query(1, script, QueryTypes.UPDATE, connection)
  }

  async open(id, connection) {
    const script = scriptPurchaseOrder.open(id)

    await DB._query(1, script, QueryTypes.UPDATE, connection)
  }
}

module.exports = new PurchaseOrderService()
