const Sales = require('../models/Sales')
const { QueryTypes } = require('sequelize')

const { getDate } = require('../functions/getDate')
const { decimalAdjust } = require('../functions/roundNumber')

module.exports = {
  async issueDate(datesearch, days = 15){
    const issue = []

    issue.push(new Date(datesearch))

    for (let index = 0; index < days-1; index++) {
      const date1 = new Date(issue[index])
      date1.setDate(date1.getDate()-1)
      issue.push(date1)
    }
    
    issue.sort( (a,b) => a - b )
    
    for (let i = 0; i < issue.length; i++) {
      issue[i] = getDate(issue[i]) 
    }
    return issue
  },

  async salesByDeliv(issue){
    const issueStart = issue[0]
    const issueEnd = issue[issue.length - 1]

    const salesArray = []
    const delivArray = []

    const sales = await Sales.count(0, `WHERE EMISSAO BETWEEN '${issueStart}' AND '${issueEnd}'`, 'EMISSAO')
    const deliv = await Sales._query(0, `SELECT * FROM VIEW_DELIVERED_BY_DAYS WHERE D_DELIVERED BETWEEN '${issueStart}' AND '${issueEnd}'`)
    
    issue.forEach(elEmis => {
      const foundSale = sales.find(elSales => getDate(elSales.EMISSAO) === elEmis )
      foundSale ? salesArray.push(foundSale.SALES) : salesArray.push(0)
      
      const foundDeliv = deliv[0].find(elDeliv => getDate(elDeliv.D_DELIVERED) === elEmis )
      foundDeliv ? delivArray.push(foundDeliv.QTD_SALES) : delivArray.push(0)
    })

    return { salesArray, delivArray}
  },

  async onTime(issue){
    const issueStart = issue[0]
    const issueEnd = issue[issue.length - 1]

    const delivOnTime = await Sales._query(0, `SELECT COUNT(ID_SALE) delivOnTime FROM VIEW_DELIV_FINISH_SALES where D_DELIVERED BETWEEN '${issueStart}' and '${issueEnd}' AND D_DELIVERED <= D_ENTREGA1`, QueryTypes.SELECT)
    
    const delivTot = await Sales._query(0, `SELECT COUNT(ID_SALE) delivTot FROM VIEW_DELIV_FINISH_SALES where D_DELIVERED BETWEEN '${issueStart}' and '${issueEnd}'`, QueryTypes.SELECT)
  
    const delivLate = delivTot[0].delivTot - delivOnTime[0].delivOnTime

    const valueCalcPerc = (delivOnTime[0].delivOnTime / delivTot[0].delivTot) * 100

    const percDelivOnTime = decimalAdjust( 'round',valueCalcPerc, -1)

    return { delivTot: delivTot[0].delivTot, delivOnTime: delivOnTime[0].delivOnTime, delivLate, percDelivOnTime }
  },

  async salesOpen(){
    const sales = await Sales.findSome(0, "STATUS = 'Aberta'", 'ID_SALES, D_ENTREGA1, SCHEDULED')
  
    const totSalesOpen = sales.length
    var salesLate = 0, salesAwait = 0, scheduledSales = 0
    sales.forEach(sale => {
      if (getDate(sale.D_ENTREGA1) < getDate()){
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

    const data = await Sales._query(0,`SELECT COUNT(ID_SALE) QTD_SALES, B.DESC_ABREV FROM VIEW_DELIV_FINISH_SALES A INNER JOIN LOJAS B ON A.CODLOJA = B.CODLOJA WHERE D_DELIVERED BETWEEN '${issueStart}' AND '${issueEnd}' GROUP BY A.CODLOJA, B.DESC_ABREV ORDER BY A.CODLOJA `,QueryTypes.SELECT)

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

    var devFinish = await Sales._query(0,`SELECT COUNT(ID_DELIVERY) QTD_DELIV FROM VIEW_D_DELV_ROUTES WHERE D_DELIVERED = '${issueEnd}'`, QueryTypes.SELECT)
    
    devFinish.length > 0 ? devFinish = devFinish[0].QTD_DELIV : devFinish = 0

    return { salesFinish, devFinish }
  }
}