// @ts-check
const MaintenanceDeliv = require('../models/tables/MaintenanceDeliv')
const Maintenance = require('../models/tables/Maintenance')
const ViewMaintenance = require('../models/views/ViewMaintenance')

const Prodlojas = require('../services/ProdLojaService')
const { setDaysInDate } = require('../functions/getDate')

/**
 * @typedef {Object} Conditions
 * @property {string} typeSeach
 * @property {string} search
 * @property {number} codloja
 */

module.exports = {
  /**

   * @param {Conditions} conditions 
   * @returns {Promise<Object[]>}
   */
  async findMain(conditions, cd = false) {
    const { codloja, search, typeSeach } = conditions
    var maint

    const codLoja = codloja === 0 ? '' : ` AND CODLOJA = ${codloja}`
    const toCd = cd ? ' AND TO_CD = 1' : ''

    if (typeSeach === 'close') maint = await ViewMaintenance.findSome(0, `STATUS = 'Finalizada' AND D_FINISH = '${search}'${codLoja}${toCd} ORDER BY ID`)
    else if (typeSeach === 'NOMECLI') maint = await ViewMaintenance.findSome(0, `${typeSeach} LIKE '${search}%'${codLoja}${toCd}`)
    else maint = await ViewMaintenance.findSome(0, `${typeSeach} = '${search}'${codLoja}${toCd}`)

    return maint
  },
  /**
   * @param {number} id 
   * @param {Object} maint 
   */
  async moveToMaint(id, maint){
    try {
      //Valores para Kardex
      const kardex = {
        MODULO: 'ASSISTENCIA',
        DOC: maint.ID_SALE,
        OBS: `Entrega de assistência Nº ${maint.ID}`,
        VALOR: maint.UNITARIO1,
        USUARIO: 'DEFAULT',
        tipo: 'S'
      }

      await MaintenanceDeliv.updateAny(0, { D_DELIVING: maint.date }, { ID: id })

      if(maint.CHANGE_PROD) await Prodlojas.updateEstProdloja(maint, kardex)
  
      await Maintenance.updateAny(0, { STATUS: 'Em deslocamento' }, { ID: maint.ID })
    } catch (error) {
      console.log(error)
    }
  },
  /**
   * 
   * @param {number} ID 
   * @param {Object} maint 
   */
  async finishToMaintNotReturn(ID, maint){
    try {
      //Valores para Kardex
      const kardex = {
        MODULO: 'ASSISTENCIA',
        DOC: maint.ID_SALE,
        OBS: `Retorno de assistência Nº ${maint.ID} com defeito`,
        VALOR: maint.UNITARIO1,
        USUARIO: 'DEFAULT',
        tipo: 'E'
      }

      await MaintenanceDeliv.updateAny(0, { 
        D_DELIVERED: maint.date,
      }, { ID })

      if(maint.CHANGE_PROD) await Prodlojas.updateEstProdloja(maint, kardex)

      await Maintenance.updateAny(0, { 
        D_FINISH: maint.date,
        STATUS: 'Finalizada'
      }, { ID: maint.ID })
    } catch (error) {
      console.log(error)
    }
  },
  /**
   * @param {number} ID 
   * @param {Object} maint
   */
  async finishToMaintReturn(ID, maint){
    try {
      //Valores para Kardex
      const kardex = {
        MODULO: 'ASSISTENCIA',
        DOC: maint.ID_SALE,
        OBS: `Retorno de assistência Nº ${maint.ID}`,
        VALOR: maint.UNITARIO1,
        USUARIO: 'DEFAULT',
        tipo: 'E'
      }

      await MaintenanceDeliv.updateAny(0, {
        DONE: 0,
        D_DELIVERED: maint.date,
        REASON_RETURN: maint.reasonReturn
      }, { ID })

      if(maint.CHANGE_PROD) await Prodlojas.updateEstProdloja(maint, kardex)

      await Maintenance.updateAny(0, { STATUS: 'No CD' }, {ID: maint.ID})
    } catch (error) {
      console.log(error)
    }
  },
  /**
   * @param {string} codloja
   * @param {string} loc
   * @returns 
   */
  async getViewMaint(codloja = '', loc = 'Shop'){
    codloja = codloja !== 'null' ? ` AND CODLOJA = ${codloja}` : ''
    loc = loc === 'Shop' ? '' : ' AND TO_CD = 1'

    const maint = await ViewMaintenance.findSome(0, `STATUS <> 'Finalizada'${codloja}${loc} ORDER BY ID`)

    for(var i in maint){
      maint[i].DATE_PREV = maint[i].DATE_PREV !== null && setDaysInDate(maint[i].DATE_PREV,2)
      maint[i].DATE_VISIT = maint[i].DATE_VISIT !== null && setDaysInDate(maint[i].DATE_VISIT,2)
    }
    return maint
  },
}