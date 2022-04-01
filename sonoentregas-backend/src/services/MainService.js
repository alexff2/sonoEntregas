// @ts-check
const MaintenanceAttempt = require('../models/MaintenanceAttempt')
const Maintenance = require('../models/Maintenance')
const ViewMaintenance = require('../models/ViewMaintenance')

const Prodlojas = require('../services/ProdLojaService')

/**
 * @typedef {Object} Condicions
 * @property {string} typeSeach
 * @property {string} search
 * @property {number} codloja
 */

module.exports = {
  /**

   * @param {Condicions} condicions 
   * @returns {Promise<Object[]>}
   */
  async findMain(condicions) {
    const { codloja, search, typeSeach } = condicions
    var main

    const codLoja = codloja === 0 ? '' : `AND CODLOJA = ${codloja}`

    if (typeSeach === 'STATUS') main = await ViewMaintenance.findSome(0, `STATUS = 'Finalizada' AND D_MAINTENANCE = '${search}' ${codLoja}`)
    else if (typeSeach === 'NOMECLI')  main = await ViewMaintenance.findSome(0, `${typeSeach} LIKE '${search}%' ${codLoja}`)
    else main = await ViewMaintenance.findSome(0, `${typeSeach} = '${search}' ${codLoja}`)

    return main
  },
  /**
   * @param {number} idMainAtt 
   * @param {Object} main 
   */
  async moveToMain(idMainAtt, main){
    try {
      //Valores para Kardex
      const kardex = {
        MODULO: 'ASSISTENCIA',
        DOC: main.ID_SALE,
        OBS: 'Saida de mercadoria para assistência',
        VALOR: main.UNITARIO1,
        USUARIO: 'DEFAULT',
        tipo: 'S'
      }

      await MaintenanceAttempt.updateNotReturn(0, `D_PROCESS = '${main.date}'`, idMainAtt)

      if(main.CHANGE_PRODUCT) await Prodlojas.updateEstProdloja(main, kardex)
  
      await Maintenance.updateNotReturn(0, `STATUS = 'Em deslocamento'`, main.ID)
    } catch (error) {
      console.log(error)
    }
  },
  /**
   * 
   * @param {number} idMainAtt 
   * @param {Object} main 
   */
  async finishToMainNotReturn(idMainAtt, main){
    try {
      //Valores para Kardex
      const kardex = {
        MODULO: 'ASSISTENCIA',
        DOC: main.ID_SALE,
        OBS: 'Entrada de mercadoria vindo de assistência / Provável Defeito',
        VALOR: main.UNITARIO1,
        USUARIO: 'DEFAULT',
        tipo: 'E'
      }

      await MaintenanceAttempt.updateNotReturn(0, `D_MAINTENANCE = '${main.date}'`,idMainAtt)

      if(main.CHANGE_PRODUCT) await Prodlojas.updateEstProdloja(main, kardex)
  
      await Maintenance.update(0, `STATUS = 'Finalizada'`, main.ID)
    } catch (error) {
      console.log(error)
    }
  },
  /**
   * @param {number} idMainAtt 
   * @param {Object} main 
   */
  async finishToMainReturn(idMainAtt, main){
    try {
      //Valores para Kardex
      const kardex = {
        MODULO: 'ASSISTENCIA',
        DOC: main.ID_SALE,
        OBS: 'Retorno de mercadoria vindo de assistência',
        VALOR: main.UNITARIO1,
        USUARIO: 'DEFAULT',
        tipo: 'E'
      }

      await MaintenanceAttempt.updateNotReturn(0, `DONE = 0,  D_MAINTENANCE = '${main.date}', REASON_RETURN = '${main.reasonReturn}'`, idMainAtt)

      if(main.CHANGE_PRODUCT) await Prodlojas.updateEstProdloja(main, kardex)

      await Maintenance.update(0, `STATUS = 'Enviado'`, main.ID)
    } catch (error) {
      console.log(error)
    }
  },
}