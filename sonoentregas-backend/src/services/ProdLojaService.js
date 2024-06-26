// @ts-check
const { QueryTypes } = require('sequelize')
const Prodlojas = require('../models/Produtos')
const InsertKardex = require('./InsertKardex')

/**
 * @typedef {Object} Kardex
 * @property {string} MODULO
 * @property {string} DOC
 * @property {string} OBS
 * @property {string} USUARIO
 * @property {string} VALOR
 * @property {'E' |'S'} tipo
 */

module.exports = {
  /**
   * @param {number} prodCodOrig 
   * @param {Object} connection 
   * @returns 
   */
  async findProdLoja(prodCodOrig, connection) {
    try {
      const prod = await Prodlojas._query(1, 
        `SELECT * FROM PRODUTOS A
        INNER JOIN PRODLOJAS B ON A.CODIGO = B.CODIGO
        WHERE B.CODLOJA = 1 AND A.ALTERNATI = '${prodCodOrig}'`,
        QueryTypes.SELECT,
        connection
      )
      return prod[0]
    } catch (error) {
      console.log(error)
    }
  },
  /**
   * @param {Object} prod 
   * @param {Kardex} kardex 
   * @param {Object} connection
   */
  async updateEstProdloja(prod, kardex, connection) {
    var est = 'EST_LOJA'

    const prodLoja = await this.findProdLoja(prod.COD_ORIGINAL, connection)

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
    `, QueryTypes.UPDATE, connection)

    prod["saldo"] = estAtual
    prod["CODIGO"] = prodLoja.CODIGO
    prod["value"] = kardex.VALOR

    await InsertKardex.createKardex(prod, kardex, connection)
  }
}
