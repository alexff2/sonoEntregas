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
    `SELECT A.CODIGO code, B.ALTERNATI generalCode, B.NOME name, A.EST_ATUAL stock, A.PCO_COMPRA, B.CBARRA barCode
      FROM PRODLOJAS A
      INNER JOIN PRODUTOS B ON A.CODIGO = B.CODIGO
      WHERE A.CODLOJA = 1 AND ${type === 'code' ? 'B.ALTERNATI' : 'B.NOME'} LIKE '${search}%'AND B.ATIVO = 'S'`

    const products = await ProductModel._query(1, script, QueryTypes.SELECT)

    return products
  }
}
