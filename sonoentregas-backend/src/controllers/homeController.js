const { QueryTypes } = require('sequelize')
const Deliverys = require('../models/Deliverys')
const Sales = require('../models/Sales')

module.exports = {
  async index( req, res){
    const salesPending = await Sales._query(0, `SELECT COUNT(ID_SALES) AS PENDINGSALES FROM SALES WHERE STATUS = 'Aberta'`, QueryTypes.SELECT)
    
    const OnReleaseSales = await Sales._query(0, `SELECT COUNT(A.ONRELEASESALES) ONRELEASESALES FROM (SELECT COUNT(ID_SALES) AS ONRELEASESALES FROM SALES_PROD WHERE STATUS <> 'Finalizada' AND STATUS <> 'Enviado' GROUP BY ID_SALES) A`, QueryTypes.SELECT)
    
    const OnSalesDelivring = await Sales._query(0, `SELECT COUNT(A.ONRELEASESALES) ONRELEASESALES FROM (SELECT COUNT(ID_SALES) AS ONRELEASESALES FROM SALES_PROD WHERE STATUS = 'Entregando' GROUP BY ID_SALES) A`, QueryTypes.SELECT)

    const OnReleaseDev = await Deliverys._query(0, `SELECT COUNT(ID) AS ONRELEASEDEV FROM DELIVERYS WHERE STATUS = 'Em lançamento'`, QueryTypes.SELECT)
    
    const delivering = await Deliverys._query(0, `SELECT COUNT(ID) AS DELIVERYN FROM DELIVERYS WHERE STATUS = 'Entregando'`, QueryTypes.SELECT)

    res.json({ 
      salesPending: salesPending[0].PENDINGSALES,
      OnReleaseSales: OnReleaseSales[0].ONRELEASESALES,
      OnSalesDelivring: OnSalesDelivring[0].ONRELEASESALES,
      OnReleaseDev: OnReleaseDev[0].ONRELEASEDEV,
      delivering: delivering[0].DELIVERYN,
    })
  }
}