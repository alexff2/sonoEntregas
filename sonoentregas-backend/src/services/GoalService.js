const { QueryTypes } = require('sequelize')
const Goals = require('../models/tables/Goals')
const ShopsModel = require('../models/tables/Shops')

class GoalService {
  async getAmountReached(shop, monthYear) {
    monthYear = monthYear.split('-')

    const script = `
    SELECT SUM(ORCPARC.VALOR) ValorLiquido
    FROM ORCPARC WITH (NOLOCK), NVENDA2 NVENDA WITH (NOLOCK), PAGTO P WITH (NOLOCK)
    where (NVENDA.CODIGOVENDA=ORCPARC.TITULO)
    AND (P.CODIGO=ORCPARC.FORMPAGTO)
    AND (NVENDA.O_V='2')
    AND (NVENDA.CODLOJA = 1)
    AND MONTH(NVENDA.Emissao) = ${monthYear[0]}
    AND YEAR(NVENDA.Emissao) = ${monthYear[1]}
    and ORCPARC.FORMPAGTO IS NOT NULL
    and (NVENDA.TotalVenda<>0)
    `

    const script2 = `
    SELECT SUM(ORCPARC.VALOR) ValorLiquido
    FROM ORCPARC WITH (NOLOCK), NVENDA2 NVENDA WITH (NOLOCK), PAGTO P WITH (NOLOCK)
    where (NVENDA.CODIGOVENDA=ORCPARC.TITULO)
    AND (P.CODIGO=ORCPARC.FORMPAGTO)
    AND (NVENDA.O_V='2')
    AND (NVENDA.CODLOJA = 1)
    AND MONTH(NVENDA.Emissao) = ${monthYear[0]}
    AND YEAR(NVENDA.Emissao) = ${monthYear[1]}
    AND P.NOME = 'ABAT CREDITO'
    AND (NVENDA.TotalVenda<>0)
    `

    const sales = await Goals._query(shop, script, QueryTypes.SELECT)
    const salesReturns = await Goals._query(shop, script2, QueryTypes.SELECT)

    if (!sales[0].ValorLiquido) sales[0].ValorLiquido = 0
    if (!salesReturns[0].ValorLiquido) salesReturns[0].ValorLiquido = 0

    return { amountReached: sales[0].ValorLiquido, amountReturns: salesReturns[0].ValorLiquido }
  }

  async updateAmounts(amountReached, amountReturns, idShop, monthYear) {
    await Goals.updateAny(0, { amountReached, amountReturns }, { idShop, monthYear })
  }

  async createGoalsIfNotExists(storeId, month, year, values, user_id) {
    const shop = await ShopsModel.findAny(0, { CODLOJA: storeId })
    if (shop.length === 0) throw { status: 400, error: 'Loja não encontrada' }
    const existingGoal = await Goals.findAny(0, { store_id: storeId, month, year })
    if (existingGoal.length > 0) throw { status: 400, error: 'Meta já cadastrada para essa loja nesse mês/ano' }
    const goals = await Goals.create(0, [{ store_id: storeId, month, year, ...values, created_by: user_id }])

    return goals
  }

  async valueUpdate(id, values, user_id) {
    await Goals.updateAny(0, { ...values, updated_by: user_id, updated_at: new Date().toISOString() }, { id })
    const goals = await Goals.findAny(0, { id })
    return goals
  }
}

module.exports = new GoalService()