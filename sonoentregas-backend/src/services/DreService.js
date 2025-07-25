const { QueryTypes } = require('sequelize')
const ViewVenda = require('../models/ViewVendas')

class DreService {
  async revenues({ shop, dateStart, dateEnd }) {
    const scriptGrossRevenues = `
    SELECT SUM(N.VALOR) value, N.SITUACAO id, N.NOMEPAGTO name FROM VIEW_OS_VENDA_FATURADA N 
    WHERE N.EMISSAO BETWEEN '${dateStart}' AND '${dateEnd}'
    GROUP BY N.SITUACAO, N.NOMEPAGTO
    ORDER BY N.NOMEPAGTO
    `

    const scriptReturns = `
    SELECT SUM(VALOR_DEVOLUCAO) value FROM DEVOLUCAO  
    WHERE DATA BETWEEN '${dateStart}' AND '${dateEnd}'
    `

    const scriptCostReturns = `
    SELECT SUM(A.QUANTIDADE_DEVOLVIDA * C.PCO_COMPRA) cost
    FROM ITENS_DEVOLUCAO A
    INNER JOIN DEVOLUCAO B ON A.CODDEVOLUCAO = B.CODIGO
    INNER JOIN NVENDI2 C ON C.NUMVENDA = A.CODVENDA AND C.CODPRODUTO = A.CODPRODUTO
    WHERE A.QUANTIDADE_DEVOLVIDA > 0
    AND B.DATA BETWEEN '${dateStart}' AND '${dateEnd}'`

    const totalReturns = await ViewVenda._query(shop, scriptReturns, QueryTypes.SELECT)

    const costReturns = await ViewVenda._query(shop, scriptCostReturns, QueryTypes.SELECT)

    const grossRevenues = await ViewVenda._query(shop, scriptGrossRevenues, QueryTypes.SELECT)

    const grossRevenue = {
      value: grossRevenues.reduce((acc, cur) => acc + cur.value, 0),
      percent: 100
    }

    const salesReturns = {
      value: totalReturns[0].value - costReturns[0].cost,
      percent: ((totalReturns[0].value - costReturns[0].cost) / grossRevenue.value) * 100,
    }

    const netRevenue = {
      value: grossRevenue.value - salesReturns.value,
      percent: (grossRevenue.value - salesReturns.value) / grossRevenue.value * 100
    }

    grossRevenues.forEach(revenue => {
      revenue.percent = (revenue.value / grossRevenue.value) * 100
    })

    return { 
      grossRevenues,
      grossRevenue,
      salesReturns,
      netRevenue
    }
  }
  async variableExpenses({ shop, dateStart, dateEnd, totRevenues }) {
    const scriptCMV = `
    SELECT SUM(V.PCO_COMPRA * CQTE) AS value    
    FROM VIEW_PROD_ANALYSE V  
    WHERE V.PCO_COMPRA <> 0  
    AND V.DATA >= '${dateStart}' AND V.DATA <= '${dateEnd}' 
    AND V.CODLOJA = 1
    `

    const scriptVE = `
    SELECT SUM(VALOR) value, NOMEDESPESA name, CODIGODESP id 
    FROM VIEW_DRE 
    WHERE FIXO_VARIAVEL='V'
    AND TIPODC='D'
    AND DATA BETWEEN '${dateStart}' AND '${dateEnd}' 
    GROUP BY NOMEDESPESA, CODIGODESP 
    ORDER BY NOMEDESPESA
    `

    const resultCmv = await ViewVenda._query(shop, scriptCMV, QueryTypes.SELECT)

    const variableExpenses = await ViewVenda._query(shop, scriptVE, QueryTypes.SELECT)

    const total = variableExpenses.reduce((acc, cur) => acc + cur.value, 0) + resultCmv[0].value

    variableExpenses.forEach(expense => {
      expense.percent = (expense.value / totRevenues) * 100
    })

    return { 
      variableExpenses, 
      total: {
        value: total,
        percent: (total / totRevenues) * 100
      },
      cmv: { 
        value: resultCmv[0].value, 
        percent: (resultCmv[0].value / totRevenues) * 100 
      }
    }
  }
  async FixedExpenses({ shop, dateStart, dateEnd, totRevenues }) {
    const scriptF = `
    SELECT SUM(VALOR) value, NOMEDESPESA name, CODIGODESP id 
    FROM VIEW_DRE 
    WHERE FIXO_VARIAVEL='F'
    AND TIPODC='D'
    AND DATA BETWEEN '${dateStart}' AND '${dateEnd}' 
    GROUP BY NOMEDESPESA, CODIGODESP 
    ORDER BY NOMEDESPESA
    `

    const fixedExpenses = await ViewVenda._query(shop, scriptF, QueryTypes.SELECT)

    const total = fixedExpenses.reduce((acc, cur) => acc + cur.value, 0)

    fixedExpenses.forEach(expense => {
      expense.percent = (expense.value / totRevenues) * 100
    })

    return { 
      fixedExpenses, 
      total: {
        value: total,
        percent: (total / totRevenues) * 100
      }
    }
  }
  async financialSummary({ shop, dateStart, dateEnd }) {
    const script = `
    select SUM(WTOTALDEBITO) value, ORIGEM AS origin from VIEW_DEBITOCLIENTE 
    where PAGAMENTO IS NULL
    AND VENCIMENTO BETWEEN '${dateStart}' AND '${dateEnd}'
    GROUP BY ORIGEM`

    const scriptBillsToPay = `
    select SUM(WTOTALDEBITO) value from VIEW_DEBITOFORNECEDOR 
    where PAGAMENTO IS NULL 
    AND VENCIMENTO BETWEEN '${dateStart}' AND '${dateEnd}'`

    const scriptPurchase = `
    select SUM(TOTNF) value FROM NFISCAL WITH(NOLOCK) 
    WHERE PROCESS='T'
    AND EMISSAO BETWEEN '${dateStart}' AND '${dateEnd}'`

    const scriptCash = `SELECT ROUND(SUM(CASE WHEN B.TIPODC = 'C' THEN A.VALOR ELSE A.VALOR * -1 END), 2) value
    FROM MOVCAIXA A
    INNER JOIN FIN_DESPESAS B ON A.CODLAN = B.CODIGO
    WHERE A.DATA <= '${dateEnd}'`

    const scriptTreasury = `SELECT ROUND(SUM(CASE WHEN B.TIPODC = 'C' THEN A.VALOR ELSE A.VALOR * -1 END), 2) value
    FROM TESOURARIA A
    INNER JOIN FIN_DESPESAS B ON A.CODDESPREC = B.CODIGO
    WHERE A.DATA <= '${dateEnd}'`


    const result = await ViewVenda._query(shop, script, QueryTypes.SELECT)
    const resultBills = await ViewVenda._query(shop, scriptBillsToPay, QueryTypes.SELECT)
    const resultPurchase = await ViewVenda._query(shop, scriptPurchase, QueryTypes.SELECT)
    const resultCash = await ViewVenda._query(shop, scriptCash, QueryTypes.SELECT)
    const resultTreasury = await ViewVenda._query(shop, scriptTreasury, QueryTypes.SELECT)

    const data = {
      titles: 0,
      card: 0,
      check: 0,
      billsToPay: resultBills[0].value || 0,
      purchases: resultPurchase[0].value || 0,
      cash: resultCash[0].value || 0,
      treasury: resultTreasury[0].value || 0
    }

    result.forEach(r => {
      if (r.origin === 'TITULO') {
        data.titles = r.value
      } else if (r.origin === 'CARTAO') {
        data.card = r.value
      } else if (r.origin === 'CHEQUE') {
        data.check = r.value
      }
    })

    return data
  }
  async currentStock({ shop }) {
    const script = `
    SELECT COUNT(CODIGO) qtdDifferentProducts, SUM( PCO_REMAR * EST_ATUAL ) salePrice, 
    SUM( PCO_LIQ * EST_ATUAL ) saleCostPrice, 
    SUM( EST_ATUAL ) stock, 
    SUM( C_AQUIS * EST_ATUAL ) purchaseCostPrice, 
    SUM( PCO_COMPRA * EST_ATUAL ) purchasePrice FROM VPRODUTOS_APR P 
    WHERE (PCO_REMAR > 0) AND (C_AQUIS > 0) AND (PCO_LIQ > 0)
    AND (PCO_COMPRA > 0) AND (EST_ATUAL > 0) AND P.CODLOJA = 1
    `

    const result = await ViewVenda._query(shop, script, QueryTypes.SELECT)

    return result[0]
  }
  async billingByCategory({ shop, dateStart, dateEnd }) {
    const script = `
    SELECT D.NOME, ROUND(SUM(B.NVTOTAL), 2) VALOR
    FROM NVENDA2 A
    INNER JOIN NVENDI2 B ON A.CODIGOVENDA = B.NUMVENDA
    INNER JOIN PRODUTOS C ON C.CODIGO = B.CODPRODUTO
    INNER JOIN CATEGPRODUTOS D ON D.CODIGO = C.CODCATEGORIA
    WHERE A.EMISSAO BETWEEN '${dateStart}' AND '${dateEnd}'
    AND A.O_V = 2
    GROUP BY D.NOME`

    const result = await ViewVenda._query(shop, script, QueryTypes.SELECT)

    return result
  }
}

module.exports = new DreService()
