const { QueryTypes } = require('sequelize')
const Deliveries = require('../models/Deliverys')
const Sales = require('../models/Sales')

module.exports = {
  async salesDevInf(){
    const scriptSalesOnDelivering = `
    SELECT COUNT(A.ID_SALES) salesOnDelivering
    FROM (SELECT ID_SALES
          FROM SALES_PROD 
          WHERE STATUS = 'Entregando' 
          GROUP BY ID_SALES) A`
    const salesPending = await Sales._query(0, `SELECT COUNT(ID_SALES) AS salesPending FROM SALES WHERE STATUS = 'Aberta'`, QueryTypes.SELECT)

    const salesOnRelease = await Sales._query(0, `SELECT COUNT(A.ID_SALES) salesOnRelease FROM (SELECT ID_SALES FROM SALES_PROD WHERE STATUS = 'Em lançamento' GROUP BY ID_SALES) A`, QueryTypes.SELECT)

    const salesOnDelivering = await Sales._query(0, scriptSalesOnDelivering, QueryTypes.SELECT)

    const devOnRelease = await Deliveries._query(0, `SELECT COUNT(ID) AS devOnRelease FROM DELIVERYS WHERE STATUS = 'Em lançamento'`, QueryTypes.SELECT)

    const delivering = await Deliveries._query(0, `SELECT COUNT(ID) AS delivering FROM DELIVERYS WHERE STATUS = 'Entregando'`, QueryTypes.SELECT)

    return { 
      salesPending: salesPending[0].salesPending,
      salesOnRelease: salesOnRelease[0].salesOnRelease,
      salesOnDelivering: salesOnDelivering[0].salesOnDelivering,
      devOnRelease: devOnRelease[0].devOnRelease,
      delivering: delivering[0].delivering,
    }
  }
}