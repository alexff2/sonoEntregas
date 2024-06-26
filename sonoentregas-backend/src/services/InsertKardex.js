// @ts-check
/**
 * @typedef {Object} Kardex
 * @property {string} MODULO
 * @property {string} DOC
 * @property {string} OBS
 * @property {string} USUARIO
 * @property {'E' | 'S'} tipo
 * 
 * @typedef {Object} IProduct
 * @property {number} id
 * @property {number} quantity
 * @property {number} value
 * @property {number} balance
 * 
 * @typedef {Object} PropDeleteByModule
 * @property {string} module
 * @property {string} document
 * @property {number | boolean} productId
 * @property {any} connection
 */
const Produto = require('../models/Produtos')
const ObjDate = require('../functions/getDate')
const { QueryTypes } = require('sequelize')
const { deleteByModule } = require('../scripts/kardex')

module.exports = {
  /**
  * @param {Object} prod
  * @param {Kardex} kardex
  * @param {any} connection
  */
  async createKardex(prod, kardex, connection){
    const KardexCodes = await Produto._query(
      1,
      'SELECT MAX(CODIGO) id, MAX(SEQUENCIA) seq FROM KARDEX_PRODUTOS_HISTORICO',
      QueryTypes.SELECT,
      connection
    )

    const ID = KardexCodes[0].id + 1
    const SEQ = KardexCodes[0].seq + 1
    const dateNow = ObjDate.getDate()
    const horasNow = ObjDate.getHours()
    const qtdEntra = kardex.tipo === 'E' ? prod.QUANTIDADE : 0
    const qtdSai = kardex.tipo === 'S' ? prod.QUANTIDADE : 0

    const script = `INSERT KARDEX_PRODUTOS_HISTORICO
    VALUES 
      (${ID}, 1, '${dateNow}', '${horasNow}', '${kardex.MODULO}', '${kardex.DOC}', ${prod.CODIGO}, ${qtdEntra}, ${qtdSai}, '${kardex.tipo}', '${kardex.OBS}', -1, '', 1, 'S', ${prod.value}, 0, -1, '${kardex.USUARIO}', 1, -1, ${prod.QUANTIDADE}, 'UN', ${SEQ}, ${prod.saldo}, 'S', ${kardex.DOC}, NULL , NULL)`
    await Produto._query(1, script, QueryTypes.INSERT, connection)
  },
  /**
  * @param {IProduct[]} products
  * @param {Kardex} kardex
  * @param {any} connection
  */
  async multiProducts(products, kardex, connection){
    const KardexCodes = await Produto._query(
      1,
      'SELECT MAX(CODIGO) id, MAX(SEQUENCIA) seq FROM KARDEX_PRODUTOS_HISTORICO',
      QueryTypes.SELECT,
      connection
    )

    const ID = KardexCodes[0].id + 1
    const SEQ = KardexCodes[0].seq + 1
    const dateNow = ObjDate.getDate()
    const horasNow = ObjDate.getHours()
    let script = 'INSERT KARDEX_PRODUTOS_HISTORICO VALUES'
    
    products.forEach((product, index) => {
      script += `${index !== 0 ? ',':''}(${ID + index}, 1, '${dateNow}', '${horasNow}', '${kardex.MODULO}', '${kardex.DOC}', ${product.id}, ${kardex.tipo === 'E' ? product.quantity : 0}, ${kardex.tipo === 'S' ? product.quantity : 0}, '${kardex.tipo}', '${kardex.OBS}', -1, '', 1, 'S', ${product.value}, 0, -1, '${kardex.USUARIO}', 1, -1, ${product.quantity}, 'UN', ${SEQ + index}, ${product.balance}, 'S', ${kardex.DOC}, NULL , NULL)`
    })

    await Produto._query(1, script, QueryTypes.SELECT, connection)
  },
  /**
   * @param {PropDeleteByModule} param0
   */
  async deleteByModule({module, document, productId, connection}){
    const script = deleteByModule(module, document, productId)

    await Produto._query(1, script, QueryTypes.DELETE, connection)
  }
}

