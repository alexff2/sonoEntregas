const { QueryTypes } = require('sequelize')
const Deliverys = require('../models/Deliverys')
const Sales = require('../models/Sales')

module.exports = {
  async index( req, res){
    const salesPending = await Sales._query(0, `SELECT COUNT(ID_SALES) AS PENDINGSALES FROM SALES WHERE STATUS = 'Enviado'`, QueryTypes.SELECT)
    
    const OnReleaseSales = await Sales._query(0, `SELECT COUNT(ID_SALES) AS ONRELEASESALES FROM SALES WHERE STATUS <> 'Finalizada' AND STATUS <> 'Enviado'`, QueryTypes.SELECT)

    const OnReleaseDev = await Deliverys._query(0, `SELECT COUNT(ID) AS ONRELEASEDEV FROM DELIVERYS WHERE STATUS = 'Em lançamento'`, QueryTypes.SELECT)
    
    const delivering = await Deliverys._query(0, `SELECT COUNT(ID) AS DELIVERYN FROM DELIVERYS WHERE STATUS = 'Entregando'`, QueryTypes.SELECT)

    res.json({ 
      salesPending: salesPending[0].PENDINGSALES,
      OnReleaseSales: OnReleaseSales[0].ONRELEASESALES,
      OnReleaseDev: OnReleaseDev[0].ONRELEASEDEV,
      delivering: delivering[0].DELIVERYN,
    })
  }
}