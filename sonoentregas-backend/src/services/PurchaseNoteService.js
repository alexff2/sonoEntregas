//@ts-check
/**
* @typedef {Object} ProductsToBeep
* @property {number} id
* @property {string} mask
* @property {string} nameFull
* @property {number} quantity
* @property {number} quantityBeep
* @property {number} quantityPedding
* @property {number} subGroupId
* @property {number} moduleId
 */
const { QueryTypes } = require('sequelize')
const PurchaseNoteModel = require('../models/tables/PurchaseNote')
const scriptsPurchaseNoteProducts = require('../scripts/purchaseNote')
const SerieService = require('../services/SerieService')
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

  async findToBeep(id) {
    const script = `
    SELECT B.CODIGO id, B.ORIGINAL originalId, B.APLICACAO mask, B.NOME [nameFull], A.QUANTIDADE quantity,
    ISNULL(C.quantityBeep, 0) quantityBeep, A.NUM_DOC moduleId, B.SUBG subGroupId, 
    A.QUANTIDADE - ISNULL(C.quantityBeep, 0) quantityPedding
    FROM (
      SELECT A.PRODUTO, SUM(A.QUANTIDADE) QUANTIDADE, B.NUM_DOC FROM NFITENS A
      INNER JOIN NFISCAL B ON A.NNF = B.NF
      WHERE B.CODFOR = 1 AND B.NUM_DOC = ${id}
      GROUP BY B.NUM_DOC, A.PRODUTO
    ) A
    INNER JOIN PRODUTOS B ON A.PRODUTO = B.CODIGO
    LEFT JOIN ( SELECT productId, COUNT(id) quantityBeep
            FROM PRODLOJAS_SERIES_MOVIMENTOS
            WHERE inputModule = 'purchaseNote'
            AND inputModuleId = ${id}
            GROUP BY productId) C ON C.productId = B.CODIGO`
    /**@type {ProductsToBeep[]} */
    const purchaseNoteProducts = await PurchaseNoteModel._query(1, script, QueryTypes.SELECT)

    if (purchaseNoteProducts.length === 0) {
      throw {
        error: 'not found purchase note!'
      }
    }

    const scriptGroup = `
    SELECT CODIGO id, NOME name
    FROM SUB_GRUPOS WHERE CODIGO IN (${purchaseNoteProducts.map(product => product.subGroupId)})`

    /**@type {import('./ProductsService').IGroup[]} */
    const groups = await PurchaseNoteModel._query(1, scriptGroup, QueryTypes.SELECT)

    const products = groups.map(group => ({
      group: group.name,
      products: purchaseNoteProducts.filter(product => group.id === product.subGroupId)
    }))

    return products
  }

  async updateId({ newId, oldId, t }) {
    const note = await PurchaseNoteModel.find({
      loja: 1,
      where: { NUM_DOC: newId }
    })

    if(note.length > 0) throw {
      error: 'It already exists'
    }

    await PurchaseNoteModel.updateAny(1, {
      NUM_DOC: newId
    }, {
      NUM_DOC: oldId
    }, t)

    await SerieService.changeInputModuleId({
      oldModuleId: oldId,
      newModuleId: newId,
      transaction: t
    })
  }
}

module.exports = new PurchaseNoteService()
