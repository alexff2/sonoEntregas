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

    const delivOnTime = await Sales._query(0, `SELECT COUNT(ID_SALE) delivOnTime FROM view_deliv_finish_sales where D_DELIVERED BETWEEN '${issueStart}' and '${issueEnd}' AND D_DELIVERED <= D_ENTREGA1`, QueryTypes.SELECT)
    
    const delivTot = await Sales._query(0, `SELECT COUNT(ID_SALE) delivTot FROM view_deliv_finish_sales where D_DELIVERED BETWEEN '${issueStart}' and '${issueEnd}'`, QueryTypes.SELECT)
  
    const delivLate = delivTot[0].delivTot - delivOnTime[0].delivOnTime

    const valueCalcPerc = (delivOnTime[0].delivOnTime / delivTot[0].delivTot) * 100

    const percDelivOnTime = decimalAdjust( 'round',valueCalcPerc, -1)

    return { delivTot: delivTot[0].delivTot, delivOnTime: delivOnTime[0].delivOnTime, delivLate, percDelivOnTime }
  },

  async salesOpen(){
    const sales = await Sales.findSome(0, "STATUS = 'Aberta'", 'ID_SALES, D_ENTREGA1')
  
    const totSalesOpen = sales.length
    var salesLate = 0, salesAwait = 0, salesOutOfStock = 0

    sales.forEach(sale => {
      getDate(sale.D_ENTREGA1) < getDate() && salesLate++
    })

    console.log(totSalesOpen, salesLate)

    return { totSalesOpen, salesLate, salesAwait, salesOutOfStock }
  }
}