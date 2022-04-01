// @ts-check
const Prodlojas = require('../models/Produtos')
const InsertKardex = require('./InsertKardex')

/**
 * @typedef {Object} Kardex
 * @property {string} MODULO
 * @property {string} DOC
 * @property {string} OBS
 * @property {number} VALOR
 * @property {string} USUARIO
 * @property {string} tipo
 */

module.exports = {
  /**
   * @param {string} collumn 
   * @param {number} prodCodOrig 
   * @returns 
   */
  async findProdLoja(collumn, prodCodOrig) {
    const prod = await Prodlojas._query(1, 
      `SELECT ${collumn} FROM PRODUTOS A
      INNER JOIN PRODLOJAS B ON A.CODIGO = B.CODIGO
      WHERE B.CODLOJA = 1 AND A.ALTERNATI = '${prodCodOrig}'`
    )
    return prod[0][0]
  },
  /**
   * @param {Object} prod 
   * @param {Kardex} kardex 
   */
  async updateEstProdloja(prod, kardex) {

    const prodLoja = await this.findProdLoja('A.CODIGO, B.EST_ATUAL', prod.COD_ORIGINAL)

    const saldo = kardex.tipo === 'E' 
      ? prodLoja.EST_ATUAL + prod.QUANTIDADE
      : prodLoja.EST_ATUAL - prod.QUANTIDADE

    await Prodlojas._query(1,`
      UPDATE PRODLOJAS
      SET EST_ATUAL = ${saldo}, EST_LOJA = ${saldo}
      WHERE CODLOJA = 1 AND CODIGO = ${prodLoja.CODIGO}
    `)

    prod["saldo"] = saldo
    prod["CODIGO"] = prodLoja.CODIGO

    await InsertKardex.createKardex(prod, kardex)
  }
}