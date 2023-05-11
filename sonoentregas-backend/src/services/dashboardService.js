//@ts-check
const { QueryTypes } = require('sequelize')
const Sales = require('../models/Sales')

const ObjDate = require('../functions/getDate')
const { decimalAdjust } = require('../functions/roundNumber')

module.exports = {
  async issueDate(dateSearch, days = 15){
    const issue = []

    issue.push(new Date(dateSearch))

    for (let index = 0; index < days-1; index++) {
      const date1 = new Date(issue[index])

      date1.setDate(date1.getDate()-1)

      issue.push(date1)
    }
    
    issue.sort( (a,b) => a - b )
    
    for (let i = 0; i < issue.length; i++) {
      issue[i] = ObjDate.getDate(issue[i], true)
    }

    return issue
  },

  async salesByDelivery(issue){
    const issueStart = issue[0]
    const issueEnd = issue[issue.length - 1]

    const salesArray = []
    const deliveriesArray = []

    const sales = await Sales.count(0, `WHERE EMISSAO BETWEEN '${issueStart}' AND '${issueEnd}'`, 'EMISSAO')
    const deliveries = await Sales._query(0, `SELECT * FROM VIEW_DELIVERED_BY_DAYS WHERE D_DELIVERED BETWEEN '${issueStart}' AND '${issueEnd}'`)

    issue.forEach(elEmis => {
      const foundSale = sales.find(elSales => ObjDate.getDate(elSales.EMISSAO, true) === elEmis )
      foundSale ? salesArray.push(foundSale.SALES) : salesArray.push(0)
      
      const foundDelivery = deliveries[0].find(elDelivery => ObjDate.getDate(elDelivery.D_DELIVERED) === elEmis )

      foundDelivery ? deliveriesArray.push(foundDelivery.QTD_SALES) : deliveriesArray.push(0)
    })

    return { salesArray, deliveriesArray}
  },

  async onTime(issue){
    const issueStart = issue[0]
    const issueEnd = issue[issue.length - 1]

    const deliveryOnTime = await Sales._query(0, `SELECT COUNT(ID_SALE) deliveryOnTime FROM VIEW_DELIV_FINISH_SALES where D_DELIVERED BETWEEN '${issueStart}' and '${issueEnd}' AND D_DELIVERED <= D_ENTREGA1`, QueryTypes.SELECT)
    
    const deliveryTot = await Sales._query(0, `SELECT COUNT(ID_SALE) deliveryTot FROM VIEW_DELIV_FINISH_SALES where D_DELIVERED BETWEEN '${issueStart}' and '${issueEnd}'`, QueryTypes.SELECT)
  
    const deliveryLate = deliveryTot[0].deliveryTot - deliveryOnTime[0].deliveryOnTime

    const valueCalcPercentage = (deliveryOnTime[0].deliveryOnTime / deliveryTot[0].deliveryTot) * 100

    const percentageDeliveryOnTime = decimalAdjust( 'round',valueCalcPercentage, -1)

    return { deliveryTot: deliveryTot[0].deliveryTot, deliveryOnTime: deliveryOnTime[0].deliveryOnTime, deliveryLate, percentageDeliveryOnTime }
  },

  async salesOpen(){
    const sales = await Sales.findSome(0, "STATUS = 'Aberta'", 'ID_SALES, D_ENTREGA1, SCHEDULED')
  
    const totSalesOpen = sales.length
    var salesLate = 0, salesAwait = 0, scheduledSales = 0
    sales.forEach(sale => {
      if (ObjDate.getDate(sale.D_ENTREGA1, true) < ObjDate.getDate()){
        salesLate++
      } else if (sale.SCHEDULED) {
        scheduledSales++
      } else {
        salesAwait++
      }
    })

    const statusSales = [ salesLate, salesAwait, scheduledSales ]

    return { totSalesOpen, statusSales }
  },

  async salesByShop(issue){
    const issueStart = issue[0]
    const issueEnd = issue[issue.length - 1]
    const labels = []
    const datas = []

    const script = 
      `SELECT COUNT(ID_SALE) QTD_SALES, B.DESC_ABREV
      FROM VIEW_DELIV_FINISH_SALES A
      INNER JOIN LOJAS B ON A.CODLOJA = B.CODLOJA
      WHERE D_DELIVERED BETWEEN '${issueStart}' AND '${issueEnd}'
      GROUP BY A.CODLOJA, B.DESC_ABREV
      ORDER BY A.CODLOJA`

    const data = await Sales._query(0,script,QueryTypes.SELECT)

    data.forEach( item => {
      datas.push(item.QTD_SALES)
      labels.push(item.DESC_ABREV)
    })

    return { labels, datas }
  },

  async salesEndDevFinish(issue){
    const issueEnd = issue[issue.length - 1]

    var salesFinish = await Sales._query(0,`SELECT QTD_SALES FROM VIEW_DELIVERED_BY_DAYS WHERE D_DELIVERED = '${issueEnd}'`, QueryTypes.SELECT)
    salesFinish.length > 0 ? salesFinish = salesFinish[0].QTD_SALES : salesFinish = 0

    const salesReturnDeliveries = await Sales._query(0,`SELECT DELIVERED, COUNT(DELIVERED) qtdSales
    FROM (SELECT ID_DELIVERY, ID_SALE, CODLOJA, DELIVERED
    FROM DELIVERYS_PROD
    WHERE D_DELIVERED = '2023-05-08'
    GROUP BY ID_DELIVERY, ID_SALE, CODLOJA, DELIVERED) A
    GROUP BY DELIVERED`, QueryTypes.SELECT)

    var devFinish = await Sales._query(0,`SELECT COUNT(ID_DELIVERY) QTD_DELIV FROM VIEW_D_DELV_ROUTES WHERE D_DELIVERED = '${issueEnd}'`, QueryTypes.SELECT)

    devFinish.length > 0 ? devFinish = devFinish[0].QTD_DELIV : devFinish = 0

    return { salesFinish, devFinish }
  }
}