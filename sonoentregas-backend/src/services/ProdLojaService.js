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
   * @param {number} prodCodOrig 
   * @returns 
   */
  async findProdLoja(prodCodOrig) {
    try {
      const prod = await Prodlojas._query(1, 
        `SELECT * FROM PRODUTOS A
        INNER JOIN PRODLOJAS B ON A.CODIGO = B.CODIGO
        WHERE B.CODLOJA = 1 AND A.ALTERNATI = '${prodCodOrig}'`
      )
      return prod[0][0]
    } catch (error) {
      console.log(error)
    }
  },
  /**
   * @param {Object} prod 
   * @param {Kardex} kardex 
   */
  async updateEstProdloja(prod, kardex) {
    var est = 'EST_LOJA'

    const prodLoja = await this.findProdLoja(prod.COD_ORIGINAL)

      var estoque, estAtual
      if(kardex.tipo === 'E'){
        !prod.returnMaint && (est = 'EST_DEPOSITO')

        estAtual = prodLoja.EST_ATUAL + prod.QUANTIDADE

        estoque = prod.returnMaint
          ? prodLoja.EST_LOJA + prod.QUANTIDADE
          : prodLoja.EST_DEPOSITO + prod.QUANTIDADE
      } else {
        estAtual = prodLoja.EST_ATUAL - prod.QUANTIDADE

        estoque = prodLoja.EST_LOJA - prod.QUANTIDADE
      }

    await Prodlojas._query(1,`
      UPDATE PRODLOJAS
      SET EST_ATUAL = ${estAtual}, ${est} = ${estoque}
      WHERE CODLOJA = 1 AND CODIGO = ${prodLoja.CODIGO}
    `)

    prod["saldo"] = estAtual
    prod["CODIGO"] = prodLoja.CODIGO

    await InsertKardex.createKardex(prod, kardex)
  }
}