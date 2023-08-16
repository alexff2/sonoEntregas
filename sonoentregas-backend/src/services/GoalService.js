const { QueryTypes } = require('sequelize')
const Goals = require('../models/tables/Goals')

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
}

module.exports = new GoalService()