const Sales = require('../models/Sales')
const { getDate } = require('../functions/getDate')

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

  async salesByDate(issue){
    const salesArray = []
    const delivArray = []

    const sales = await Sales.count(0, `WHERE EMISSAO BETWEEN '${issue[0]}' AND '${issue[issue.length - 1]}'`, 'EMISSAO')
    const deliv = await Sales._query(0, `SELECT * FROM VIEW_DELIVERED_BY_DAYS WHERE D_DELIVERED BETWEEN '${issue[0]}' AND '${issue[issue.length - 1]}'`)
    
    issue.forEach(elEmis => {
      const foundSale = sales.find(elSales => getDate(elSales.EMISSAO) === elEmis )
      foundSale ? salesArray.push(foundSale.SALES) : salesArray.push(0)
      
      const foundDeliv = deliv[0].find(elDeliv => getDate(elDeliv.D_DELIVERED) === elEmis )
      foundDeliv ? delivArray.push(foundDeliv.QTD_SALES) : delivArray.push(0)
    })

    return {issue, salesArray, delivArray}
  }
}