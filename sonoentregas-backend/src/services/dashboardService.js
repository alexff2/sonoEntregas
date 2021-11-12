const Sales = require('../models/Sales')
const { getDate } = require('../functions/getDate')

module.exports = {
  async salesByDate(datesearch, days = 15){

    const dates = []

    dates.push({EMISSAO: new Date(datesearch), SALES: 0})

    for (let index = 0; index < days-1; index++) {
      const date1 = new Date(dates[index].EMISSAO)
      date1.setDate(date1.getDate()-1)
      dates.push({EMISSAO: date1, SALES: 0})
    }

    const sales = await Sales.count(0, `WHERE EMISSAO BETWEEN '${getDate(dates[days-1].EMISSAO)}' AND '${datesearch}'`, 'EMISSAO')

    dates.forEach(el => {// Tentar otimizar posteriormente
      sales.forEach(elSales => {
        getDate(el.EMISSAO) === getDate(elSales.EMISSAO) ? el.SALES = elSales.SALES : null
      })
    })

    dates.sort( (a,b) => a.EMISSAO - b.EMISSAO )

    return dates
  }
}