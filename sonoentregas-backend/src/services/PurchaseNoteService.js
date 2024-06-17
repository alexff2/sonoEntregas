const { QueryTypes } = require('sequelize')
const PurchaseNoteModel = require('../models/tables/PurchaseNote')
const scriptsPurchaseNoteProducts = require('../scripts/purchaseNote')
const DateTime = require('../class/Date')
const { decimalToCoin } = require('../functions/TransformCoin')

class PurchaseNoteService {
  async find({ typeSearch, search }){
    const fieldSearch = {
      docNumber: 'NUM_DOC',
      issue: 'EMISSAO',
    }

    const purchaseNotes = await PurchaseNoteModel.findAny(1, {
      [fieldSearch[typeSearch]]: search
    }, '*')

    return purchaseNotes.map(note => ({
      id: note.NF,
      docNumber: note.NUM_DOC,
      purchaseOrderId: note.PEDIDO,
      issue: new DateTime(note.EMISSAO).getBRDateTime().date,
      release: new DateTime(note.DATA_LANCAMENTO).getBRDateTime().date,
      releaseTime: note.HORA_LANCAMENTO,
      value: decimalToCoin(note.TOTNF)
    }))
  }

  async findProducts({ id }) {
    const script = scriptsPurchaseNoteProducts.findProducts(id)

    const purchaseNoteProducts = await PurchaseNoteModel._query(1, script, QueryTypes.SELECT)

    return purchaseNoteProducts.map(product => ({
      ...product,
      amount: decimalToCoin(product.amount),
      unitaryValue: decimalToCoin(product.unitaryValue),
    }))
  }
}

module.exports = new PurchaseNoteService()
