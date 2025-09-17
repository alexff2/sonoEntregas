const { QueryTypes } = require('sequelize')
const connections = require('../databases/MSSQL/Model')

const db = new connections()
const GoalsModel = require('../models/tables/Goals')
const salesQueries = require('../scripts/sales')

class SalesReportService {
  async getSalesCommissions({ shopId, month, year }) {
    const [monthlyGoals] = await GoalsModel.findAny(0, { month: Number(month), year })
    if (!monthlyGoals) {
      throw {
        status: 400,
        message: 'Não existe meta cadastrada para este mês e ano. Por favor, cadastre uma meta para gerar o relatório.'
      }
    }

    const salesBySellerAndPaymentType = await db._query(
      shopId,
      salesQueries.salesBySellerAndPaymentType({ month, year }),
      QueryTypes.SELECT
    )
    if (salesBySellerAndPaymentType.length === 0) return []

    const sellerIds = salesBySellerAndPaymentType.map(item => item.sellerId)
    const sellers = await db._query(
      shopId,
      salesQueries.findVendor(sellerIds),
      QueryTypes.SELECT
    )

    const returnsSales = await db._query(
      shopId,
      salesQueries.returnSales({ month, year }),
      QueryTypes.SELECT
    )

    const salesCommissionsBy = sellers.map(salesPerson => {
      const payments = salesBySellerAndPaymentType.filter(item => item.sellerId === salesPerson.id)
      const grossRevenue = payments.reduce((acc, curr) => acc + curr.amount, 0)
      const returns = returnsSales.length > 0
        ? (returnsSales.find(item => item.sellerId === salesPerson.id)?.value || 0)
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

    const totals = {
      grossRevenue: salesCommissionsBy.reduce((acc, curr) => acc + curr.grossRevenue, 0),
      returns: salesCommissionsBy.reduce((acc, curr) => acc + curr.returns, 0),
      netRevenue: salesCommissionsBy.reduce((acc, curr) => acc + curr.netRevenue, 0),
      commissionPercent: 0,
      commissionValue: 0,
      payments: salesBySellerAndPaymentType.reduce((acc, curr) => {
        const paymentIndex = acc.findIndex(p => p.type === curr.type)
        if (paymentIndex > -1) {
          acc[paymentIndex].amount += curr.amount
        } else {
          acc.push({ type: curr.type, amount: curr.amount })
        }
        return acc
      }, [])
    }

    if (totals.netRevenue >= monthlyGoals.value_1 && totals.netRevenue < monthlyGoals.value_2) {
      totals.commissionPercent = 0.006
    }

    if (totals.netRevenue >= monthlyGoals.value_2 && totals.netRevenue < monthlyGoals.value_3) {
      totals.commissionPercent = 0.007
    }

    if (totals.netRevenue >= monthlyGoals.value_3) {
      totals.commissionPercent = 0.008
    }

    return {
      salesCommissionsBy,
      totals: {
        ...totals,
        commissionValue: (totals.netRevenue * totals.commissionPercent),
        commissionPercent: totals.commissionPercent * 100
      }
    }
  }
}

module.exports = new SalesReportService()
