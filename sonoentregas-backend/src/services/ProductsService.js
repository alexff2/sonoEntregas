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
const productScripts = require('../scripts/products')

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
  async findProduct(type, search, active = false) {
    const condition = type === 'code'
      ? {COD_ORIGINAL: `${search}%`}
      : {NOME: `${search}%`}

      const scriptProductsStock = process.env.STOCK_BEEP === '1'
      ? productScripts.stockBeep(condition, 'LIKE', active)
      : productScripts.stockNotBeep(condition, 'LIKE', active)

    const products = await ProductModel._query(1, scriptProductsStock, QueryTypes.SELECT)
    const productsValueScript = productScripts.values(products.map(product => product.CODIGO))
    const productsValues = await ProductModel._query(1, productsValueScript, QueryTypes.SELECT)

    return products.map(product => {
      const productValue = productsValues.find(productValue => productValue.CODIGO === product.CODIGO)

      return {
      ...product,
      code: product.CODIGO,
      generalCode: product.COD_ORIGINAL,
      name: product.NOME,
      stock: product.availableStock,
      purchasePrice: productValue.PCO_COMPRA
    }})
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
  },
  async findProductToBeepById(originalId) {
    const script = `SELECT CODIGO code, NOME name, ORIGINAL originalId FROM PRODUTOS
    WHERE ORIGINAL = ${originalId} AND ATIVO = 'S'
    `

    const product = await ProductModel._query(1, script, QueryTypes.SELECT)

    if (product.length === 0) {
      throw {
        error: 'Product not found'
      }
    }

    if (product.length > 1) {
      throw {
        error: 'More than one product found'
      }
    }

    const serialNumbers = await ProductModel._query(1, `SELECT serialNumber FROM PRODLOJAS_SERIES_MOVIMENTOS WHERE productId = ${product[0].code} AND outputModule IS NULL`, QueryTypes.SELECT)

    product[0].serialNumbers = serialNumbers.map( serial => serial.serialNumber)

    return product[0]
  }
}
