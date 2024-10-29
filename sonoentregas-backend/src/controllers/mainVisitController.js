// @ts-check
const MaintenanceVisit = require('../models/tables/MaintenanceVisit')
const Maintenance = require('../models/tables/Maintenance')

const ObjDate = require('../functions/getDate')
const MainService = require('../services/MainService')

module.exports = {
  /**
  * @param {*} req 
  * @param {*} res 
  */
  async create(req, res){
    try {
      const { ID_MAIN, DATE, HOURS, ID_USER } = req.body

      const scrip = `${ID_MAIN}, '${DATE}', '${HOURS}', '', ${ID_USER}`

      await MaintenanceVisit.creatorNotReturn(0, scrip, true)

      await Maintenance.updateAny(0, { STATUS: 'Agendada' }, { ID: ID_MAIN })

      const ViewMain = await MainService.getViewMaint('null', undefined, undefined)

      return res.json(ViewMain)
    } catch (error) {
      console.log(error)
    }
  },
  /**
  * @param {*} req
  * @param {*} res
  */
  async startVisit(req, res){
    const { id } = req.params
    const { date } = req.body
    try {
      await MaintenanceVisit.updateAny(0, {DATE: date}, {ID_MAIN: id})

      await Maintenance.updateAny(0, { STATUS: 'Visitando' }, { ID: id })

      return res.json(await MainService.getViewMaint('null', undefined, undefined))
    } catch (error) {
      console.log(error)
      return res.status(400).json(error)
    }
  },
  /**
  * @param {*} req
  * @param {*} res
  */
  async finishVisit(req, res){
    try {
      const { id } = req.params
      const { situation, changeProd, obs } = req.body
      var msg

      if (situation === 1) {
        await MaintenanceVisit.updateAny(0, {
          TO_CD: 0,
          OBS: obs
        },{ ID_MAIN: id })

        await Maintenance.updateAny(0, { 
          STATUS: 'Finalizada',
          D_FINISH: ObjDate.getDate()
        }, { ID: id })
        
        msg = 'Assistência finalizada com sucesso'
      } else {
        await MaintenanceVisit.updateAny(0, {
          TO_CD: 1,
          CHANGE_PROD: changeProd ? 1 : 0,
          OBS: obs
        },{ ID_MAIN: id })

        await Maintenance.updateAny(0, { STATUS: 'No CD' }, { ID: id })

        msg = 'Assistência enviada ao CD!'
      }

      return res.json({ main: await MainService.getViewMaint('null', undefined, undefined), msg })
    } catch (error) {
      console.log(error)
      return res.status(400).json(error)
    }
  },
  /**
   * @param {*} req
   * @param {*} res
   */
  async reschedule(req, res){
    const { id } = req.params
    const { dateVisit, hoursVisit } = req.body

    try {
      await MainService.reschedule({
        dateVisit,
        hoursVisit,
        idMaintenance: id
      })

      const maintenanceVisit = await MainService.getViewMaint('null', undefined, undefined)

      return res.json(maintenanceVisit)
    } catch (error) {
      console.log(error)
      return res.status(400).json(error)
    }
  }
}