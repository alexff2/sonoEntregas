// @ts-check
const MaintenanceDeliv = require('../models/tables/MaintenanceDeliv')
const Maintenance = require('../models/tables/Maintenance')
const ViewMaintenance = require('../models/views/ViewMaintenance')

const ProdLojaService = require('../services/ProdLojaService')
const ObjDate = require('../functions/getDate')

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
   * @param {Object} connections
   */
  async moveToMaint(id, maint, connections = {entrega: false, sce: false}){
    const { entrega, sce } = connections
    await MaintenanceDeliv.updateAny(0, { D_DELIVING: maint.date }, { ID: id }, entrega)

    if(maint.CHANGE_PROD) await ProdLojaService.updateEstProdloja(maint, {
      MODULO: 'ASSISTENCIA',
      DOC: maint.ID_SALE,
      OBS: `Entrega de assistência Nº ${maint.ID}`,
      VALOR: maint.UNITARIO1,
      USUARIO: 'DEFAULT',
      tipo: 'S'
    }, sce)

    await Maintenance.updateAny(0, { STATUS: 'Em deslocamento' }, { ID: maint.ID }, entrega)
  },
  /**
   * @param {number} ID
   * @param {Object} maint
   * @param {Object} connection
   */
  async finishToMaintNotReturn(ID, maint, connection){
    await MaintenanceDeliv.updateAny(0, { D_DELIVERED: maint.date }, { ID }, connection)

    await Maintenance.updateAny(0, { 
      D_FINISH: maint.date,
      STATUS: 'Finalizada'
    }, { ID: maint.ID }, connection)
  },
  /**
   * @param {number} ID 
   * @param {Object} maint
   * @param {Object} connections
   */
  async finishToMaintReturn(ID, maint, connections){
    //Valores para Kardex
    await MaintenanceDeliv.updateAny(0, {
      DONE: 0,
      D_DELIVERED: maint.date,
      REASON_RETURN: maint.reasonReturn
    }, { ID })

    if(maint.CHANGE_PROD) await ProdLojaService.updateEstProdloja(maint, {
      MODULO: 'ASSISTÊNCIA',
      DOC: maint.ID_SALE,
      OBS: `Retorno de assistência Nº ${maint.ID}`,
      VALOR: maint.UNITARIO1,
      USUARIO: 'DEFAULT',
      tipo: 'E'
    }, connections.sce)

    await Maintenance.updateAny(0, { STATUS: 'No CD' }, {ID: maint.ID}, connections.entrega)
  },
  /**
   * @param {string} codloja
   * @param {string} loc
   * @param {Object | null} connection
   * @returns 
   */
  async getViewMaint(codloja = '', loc = 'Shop', connection){
    codloja = codloja !== 'null' ? ` AND CODLOJA = ${codloja}` : ''
    loc = loc === 'Shop' ? '' : ' AND TO_CD = 1'

    const maint = await ViewMaintenance.findSome(0, `STATUS <> 'Finalizada'${codloja}${loc} ORDER BY ID`, '*', connection)

    for(var i in maint){
      maint[i].DATE_PREV = maint[i].DATE_PREV !== null && ObjDate.setDaysInDate(maint[i].DATE_PREV,0)
      maint[i].DATE_VISIT = maint[i].DATE_VISIT !== null && ObjDate.setDaysInDate(maint[i].DATE_VISIT,0)
    }
    return maint
  },
}