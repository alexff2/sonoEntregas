const { QueryTypes } = require('sequelize')
const connections = require('../databases/MSSQL/Model')
const salesQueries = require('../scripts/sales')

const db = new connections()

class SalesReportService {
  async getSalesCommissions({ shopId, startDate, endDate }) {
    const salesCommissions = await db._query(
      shopId,
      salesQueries.salesCommissions({ startDate, endDate }),
      QueryTypes.SELECT
    )
    if (salesCommissions.length === 0) return []

    const salesPeopleIds = salesCommissions.map(item => item.CODVENDEDOR)
    const salesPeople = await db._query(
      shopId,
      salesQueries.findSalesPerson(salesPeopleIds),
      QueryTypes.SELECT
    )

    const returnsSales = await db._query(
      shopId,
      salesQueries.returnSales({ startDate, endDate }),
      QueryTypes.SELECT
    )

    return salesPeople.map(salesPerson => {
      const payments = salesCommissions.filter(item => item.CODVENDEDOR === salesPerson.id)
      const grossRevenue = payments.reduce((acc, curr) => acc + curr.amount, 0)
      const returns = returnsSales.length > 0
        ? (returnsSales.find(item => item.CODVENDEDOR === salesPerson.id)?.value || 0)
        : 0
      const netRevenue = grossRevenue - returns
      let commissionPercent = 0

      if (netRevenue >= 85000 && netRevenue < 100000) {
        commissionPercent = 0.03
      }

      if (netRevenue >= 100000 && netRevenue < 150000) {
        commissionPercent = 0.035
      }

      if (netRevenue >= 150000) {
        commissionPercent = 0.04
      }

      return {
        ...salesPerson,
        payments,
        grossRevenue,
        returns,
        netRevenue,
        commissionPercent: commissionPercent * 100,
        commissionValue: (netRevenue * commissionPercent) - (commissionPercent > 0 ? 1690 : 0)
      }
    })
  }
}

module.exports = new SalesReportService()
