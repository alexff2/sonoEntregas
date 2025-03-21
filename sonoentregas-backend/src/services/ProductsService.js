//@ts-check

/**
 * @typedef {Object} IGroup
 * @property {number} id
 * @property {string} name
 * 
 * @typedef {Object} IProduct
 * @property {number} id
 * @property {string} nameFull
 * @property {string} mask
 * @property {number} groupId
 */
const { QueryTypes } = require('sequelize')
const ProductModel = require('../models/ViewProdutos')

module.exports = {
  async findProductsSceCd(wheres){
    try {
      const products = ProductModel.find({
        loja: 1,
        toCompare: 'LIKE',
        where: wheres
      })

      return products
    } catch (error) {
      console.log(error)
    }
  },
  async updateBarCode(barCode, code ) {
    const product = await ProductModel._query(1, `SELECT CBARRA FROM PRODUTOS WHERE CBARRA = '${barCode}'`, QueryTypes.SELECT)

    if (product.length > 0) {
      throw{
        error: 'barCode already'
      }
    }

    await ProductModel._query(1, `UPDATE PRODUTOS SET CBARRA = '${barCode}' WHERE CODIGO = ${code}`)
  },
  async findProduct(type, search) {
    const script = 
    `SELECT A.CODIGO code, B.ALTERNATI generalCode, B.NOME name, A.EST_ATUAL stock, A.PCO_COMPRA purchasePrice, B.CBARRA barCode
    FROM PRODLOJAS A
    INNER JOIN PRODUTOS B ON A.CODIGO = B.CODIGO
    WHERE A.CODLOJA = 1 AND ${type === 'code' ? 'B.ALTERNATI' : 'B.NOME'} LIKE '${search}%'AND B.ATIVO = 'S'`

    const products = await ProductModel._query(1, script, QueryTypes.SELECT)

    return products
  },
  /**@param {number[]} ids*/
  async findGrouped(ids) {
    const script = `
    SELECT CODIGO id, NOME nameFull, APLICACAO mask, SUBG groupId
    FROM PRODUTOS
    WHERE CODIGO IN (${ids})`

    /**@type {IProduct[]} */
    const products = await ProductModel._query(1, script, QueryTypes.SELECT)

    const scriptGroup = `
    SELECT CODIGO id, NOME name
    FROM SUB_GRUPOS WHERE CODIGO IN (${products.map(product => product.groupId)})`

    /**@type {IGroup[]} */
    const groups = await ProductModel._query(1, scriptGroup, QueryTypes.SELECT)

    return groups.map( group => ({
      group: group.name,
      products: products.filter(product => product.groupId === group.id)
    }))
  },
  /**
   * @param {string} typeSearch
   * @param {string} search
   */
  async findStock(typeSearch, search){
    const where = {
      maior: 'B.ESTOQUE > 0',
      igual: 'ISNULL(B.ESTOQUE, 0) = 0',
      generalCode: `A.ALTERNATI LIKE '${search}'`,
      name: `A.NOME LIKE '${search}%'`
    }

    const script = `
    SELECT A.CODIGO id, A.ALTERNATI generalCode, A.NOME name, ISNULL(B.ESTOQUE, 0) stock
    FROM PRODUTOS A
    LEFT JOIN (
      SELECT productId, COUNT(productId) ESTOQUE
      FROM PRODLOJAS_SERIES_MOVIMENTOS
      WHERE outputBeepDate IS NULL
      GROUP BY productId
      ) B ON A.CODIGO = B.productId
    WHERE ${where[typeSearch]} AND A.ATIVO = 'S'
    `

    return await ProductModel._query(1, script, QueryTypes.SELECT)
  }
}
