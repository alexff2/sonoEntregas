// @ts-check
const Produto = require('../models/Produtos')
const { getDate, getHours } = require('../functions/getDate')

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
  * @param {Object} prod
  * @param {Kardex} kardex
  */
  async createKardex(prod, kardex){
    try {
      const KardexId = await Produto._query(1, 'SELECT MAX(CODIGO) CODIGO FROM KARDEX_PRODUTOS_HISTORICO')

      const ID = KardexId[0][0].CODIGO + 1
      const dateNow = getDate()
      const horasNow = getHours()
      const qtdEntra = kardex.tipo === 'E' ? prod.QUANTIDADE : 0
      const qtdSai = kardex.tipo === 'S' ? prod.QUANTIDADE : 0

      const script = `INSERT KARDEX_PRODUTOS_HISTORICO `+
      `VALUES `+
        `(${ID}`+
        `, 1`+
        `, '${dateNow}'`+
        `, '${horasNow}'`+
        `, '${kardex.MODULO}'`+
        `, '${kardex.DOC}'`+
        `, ${prod.CODIGO}`+
        `, ${qtdEntra}`+
        `, ${qtdSai}`+
        `, '${kardex.tipo}'`+
        `, '${kardex.OBS}'`+
        `, -1`+
        `, ''`+
        `, 1`+
        `, 'S'`+
        `, ${kardex.VALOR}`+
        `, 0`+
        `, -1`+
        `, '${kardex.USUARIO}'`+
        `, 1`+
        `, -1`+
        `, ${prod.QUANTIDADE}`+
        `, 'UN'`+
        `, ${ID}`+
        `, ${prod.saldo}`+
        `, 'S')`
      await Produto._query(1, script)
    } catch (error) {
      console.log(error)
    }
  }
}

