// @ts-check

/**
 * @typedef {Object} Params
 * @property {number} id
 */

 const Maintenance = require('../models/tables/Maintenance')
 const MaintDeliv = require('../models/tables/MaintenanceDeliv')
 const ViewMaintDeliv = require('../models/views/ViewMaintDeliv')
 
 const MainService = require('../services/MainService')
 
 const { getDate } = require('../functions/getDate')
 
 module.exports = {
   /**
    * @param {*} req 
    * @param {*} res 
    * @returns 
    */
   async index(req, res) {
     try {
       const maint = await MainService.getViewMaint('null', 'CD')
 
       return res.json(maint)
     } catch (error) {
       console.log(error)
       return res.status(400).json(error)
     }
   },
   /**
    * @param {*} req 
    * @param {*} res 
    * @returns 
    */
   async findMaintDeliv(req, res) {
     try {
       const params = req.params
 
       params.codloja = 0
 
       const maint = await MainService.findMain(params, true)
 
       return res.json(maint)
     } catch (error) {
       console.log(error)
       return res.status(400).json(error)
     }
   },
   /**
    * @param {*} req 
    * @param {*} res 
    * @returns 
    */
   async findMaintId(req, res) {
     const { idMain } = req.params
 
     try {
       const mainDeliv = await ViewMaintDeliv.findSome(0, `ID_MAINT = ${idMain} ORDER BY ID`)
 
       return res.json(mainDeliv)
     } catch (error) {
       console.log(error)
       return res.status(400).json(error)
     }
   },
   /**
    * @param {*} req 
    * @param {*} res 
    * @returns 
    */
   async create(req, res) {
     try {
       var { idMaint, idDriver, idAssist, idDelivMain, idUser, obs } = req.body
 
       const D_MOUNTING = getDate()
 
       idDelivMain =  idDelivMain === 0 ? 'NULL' : idDelivMain
       obs =  obs === '' ? 'NULL' : `'${obs}'`
 
       await MaintDeliv.creatorNotReturn(0, `${idMaint}, '${D_MOUNTING}', NULL, NULL, 1, NULL, ${idDriver}, ${idAssist}, ${idDelivMain}, ${idUser}, ${obs}`)
 
       await Maintenance.update(0,`STATUS = 'Em lançamento'`, idMaint)
 
       return res.json(await MainService.getViewMaint('null', 'CD'))
     } catch (error) {
       console.log(error)
       return res.json(error)
     }
   },
   /**
    * @param {*} req
    * @param {*} res 
    * @returns 
    */
   async update(req, res) {
     /** @type {Params} */
     const { id } = req.params
     const maint = req.body
 
     try {
       if (maint.STATUS === 'Em lançamento') await MainService.moveToMaint(id, maint)
       else if (maint.STATUS === 'Em deslocamento') {
         if (!maint.returnMaint) {
           await MainService.finishToMaintNotReturn(id, maint)
         } else {
           await MainService.finishToMaintReturn(id, maint)
         }
       }
 
       return res.json(await MainService.getViewMaint('null', 'CD'))
     } catch (error) {
      console.log(error)
      res.status(401).json(error)
     }
   }
 }