const { QueryTypes } = require('sequelize')
const Deliverys = require('../models/Deliverys')
const Sales = require('../models/Sales')

module.exports = {
  async salesDevInf(){
    const salesPending = await Sales._query(0, `SELECT COUNT(ID_SALES) AS SALESPENDING FROM SALES WHERE STATUS = 'Aberta'`, QueryTypes.SELECT)
    
    const salesOnRelease = await Sales._query(0, `SELECT COUNT(A.SALESONRELEASE) SALESONRELEASE FROM (SELECT COUNT(ID_SALES) AS SALESONRELEASE FROM SALES_PROD WHERE STATUS = 'Em lançamento' GROUP BY ID_SALES) A`, QueryTypes.SELECT)
    
    const salesOnDelivering = await Sales._query(0, `SELECT A.SALESONDELIV FROM (SELECT COUNT(ID_SALES) AS SALESONDELIV FROM SALES_PROD WHERE STATUS = 'Entregando' GROUP BY ID_SALES) A`, QueryTypes.SELECT)

    const devOnRelease = await Deliverys._query(0, `SELECT COUNT(ID) AS ONRELEASEDEV FROM DELIVERYS WHERE STATUS = 'Em lançamento'`, QueryTypes.SELECT)
    
    const delivering = await Deliverys._query(0, `SELECT COUNT(ID) AS DELIVERYN FROM DELIVERYS WHERE STATUS = 'Entregando'`, QueryTypes.SELECT)

    return { 
      salesPending: salesPending[0].SALESPENDING,
      salesOnRelease: salesOnRelease[0].SALESONRELEASE,
      salesOnDelivering: salesOnDelivering[0].SALESONDELIV,
      devOnRelease: devOnRelease[0].ONRELEASEDEV,
      delivering: delivering[0].DELIVERYN,
    }
  }
}