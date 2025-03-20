//@ts-check

/**
 * @typedef {Object} IProduct
 * @property {string} COD_ORIGINAL
 * @property {string} NOME
 * 
 * @typedef {Object} IProduct_Month1
 * @property {string} COD_ORIGINAL
 * @property {string} NOME
 * @property {number} QTD_MES1
 * 
 * @typedef {Object} IProduct_Month2
 * @property {string} COD_ORIGINAL
 * @property {string} NOME
 * @property {number} QTD_MES2
 * 
 * @typedef {Object} IProduct_Month3
 * @property {string} COD_ORIGINAL
 * @property {string} NOME
 * @property {number} QTD_MES3
 * 
 */

const { QueryTypes } = require('sequelize')
const Products = require('../models/Produtos')
const SalesService = require('../services/salesService')
const PurchaseOrderService = require('../services/PurchaseOrderService')
const DreService = require('../services/DreService')
const DeliveryService = require('../services/DeliveryService')
const ShopSceService = require('../services/ShopSceService')
const connections = require('../databases/MSSQL/connections')

module.exports = {
  /**
   * @param {any} req
   * @param {any} res
   */
  async listProducts(req, res) {
    try {
      const { monthBase, yearBase } = req.query

      let month1 = parseInt(monthBase)-1
      let month2 = parseInt(monthBase)
      let month3 = parseInt(monthBase)+1

      let script_month1
      let script_month2
      let script_month3

      /** @type{IProduct[]} */
      const products = await Products._query(1, `
       SELECT A.ALTERNATI AS COD_ORIGINAL, A.NOME,
       CASE WHEN B.QTD IS NULL THEN 0 ELSE B.QTD END PENDENTE,
       CASE WHEN C.PEDIDO IS NULL THEN 0 ELSE C.PEDIDO END PEDIDO, D.EST_LOJA, D.EST_DEPOSITO, D.EST_ATUAL
       FROM PRODUTOS A
       INNER JOIN PRODLOJAS D ON D.CODIGO = A.CODIGO
       LEFT JOIN (
        SELECT COD_ORIGINAL, SUM(QUANTIDADE) QTD
        FROM ${connections[0].database}..SALES_PROD where STATUS IN ('Enviado', 'Em Previsão', 'Em Lançamento')
        GROUP BY COD_ORIGINAL
       ) B ON A.ALTERNATI = B.COD_ORIGINAL
       LEFT JOIN (
           SELECT CODPRODUTO, SUM(QTE_PEDIDO) - SUM(QTE_CHEGADA) PEDIDO
           FROM VIEW_SALDO_PEDIDO_PRODUTO
           GROUP BY CODPRODUTO
       ) C ON A.CODIGO = C.CODPRODUTO
       WHERE A.ATIVO = 'S'
       AND D.CODLOJA = 1
       ORDER BY B.QTD DESC
      `, QueryTypes.SELECT)

      if (month1 === -1) {
        month1 = 11
        script_month1 = `
          SELECT A.COD_ORIGINAL, B.NOME, SUM(A.QUANTIDADE) QTD_MES1
          FROM SALES_PROD A
          INNER JOIN ${process.env.CD_BASE}..PRODUTOS B ON A.COD_ORIGINAL = B.ALTERNATI
          INNER JOIN SALES C ON A.CODLOJA = C.CODLOJA AND A.ID_SALES = C.ID_SALES
          WHERE SUBSTRING(CONVERT(CHAR(8),C.EMISSAO,112),1,6)='${yearBase-1}${month1}'
          AND B.ATIVO = 'S'
          GROUP BY A.COD_ORIGINAL, B.NOME
        `
      } else if (month1 === 0) {
        month1 = 12
        script_month1 = `
          SELECT A.COD_ORIGINAL, B.NOME, SUM(A.QUANTIDADE) QTD_MES1
          FROM SALES_PROD A
          INNER JOIN ${process.env.CD_BASE}..PRODUTOS B ON A.COD_ORIGINAL = B.ALTERNATI
          INNER JOIN SALES C ON A.CODLOJA = C.CODLOJA AND A.ID_SALES = C.ID_SALES
          WHERE SUBSTRING(CONVERT(CHAR(8),C.EMISSAO,112),1,6)='${yearBase-1}${month1}'
          AND B.ATIVO = 'S'
          GROUP BY A.COD_ORIGINAL, B.NOME
        `
      } else {
        script_month1 = `
          SELECT A.COD_ORIGINAL, B.NOME, SUM(A.QUANTIDADE) QTD_MES1
          FROM SALES_PROD A
          INNER JOIN ${process.env.CD_BASE}..PRODUTOS B ON A.COD_ORIGINAL = B.ALTERNATI
          INNER JOIN SALES C ON A.CODLOJA = C.CODLOJA AND A.ID_SALES = C.ID_SALES
          WHERE SUBSTRING(CONVERT(CHAR(8),C.EMISSAO,112),1,6)='${yearBase}${monthBase.length === 1 ? '0'+month1 : month1}'
          AND B.ATIVO = 'S'
          GROUP BY A.COD_ORIGINAL, B.NOME
        `
      }

      /** @type{IProduct_Month1[]} */
      const products_month1 = await Products._query(0, script_month1, QueryTypes.SELECT)

      if (month2 === 0) {
        month2 = 12
        script_month2 = `
          SELECT A.COD_ORIGINAL, B.NOME, SUM(A.QUANTIDADE) QTD_MES2
          FROM SALES_PROD A
          INNER JOIN ${process.env.CD_BASE}..PRODUTOS B ON A.COD_ORIGINAL = B.ALTERNATI
          INNER JOIN SALES C ON A.CODLOJA = C.CODLOJA AND A.ID_SALES = C.ID_SALES
          WHERE SUBSTRING(CONVERT(CHAR(8),C.EMISSAO,112),1,6)='${yearBase-1}${month2}'
          AND B.ATIVO = 'S'
          GROUP BY A.COD_ORIGINAL, B.NOME
        `
      } else {
        script_month2 = `
          SELECT A.COD_ORIGINAL, B.NOME, SUM(A.QUANTIDADE) QTD_MES2
          FROM SALES_PROD A
          INNER JOIN ${process.env.CD_BASE}..PRODUTOS B ON A.COD_ORIGINAL = B.ALTERNATI
          INNER JOIN SALES C ON A.CODLOJA = C.CODLOJA AND A.ID_SALES = C.ID_SALES
          WHERE SUBSTRING(CONVERT(CHAR(8),C.EMISSAO,112),1,6)='${yearBase}${monthBase.length === 1 ? '0'+ month2 : month2}'
          AND B.ATIVO = 'S'
          GROUP BY A.COD_ORIGINAL, B.NOME
        `
      }

      /** @type{IProduct_Month2[]} */
      const products_month2 = await Products._query(0, script_month2, QueryTypes.SELECT)

      script_month3 = `
        SELECT A.COD_ORIGINAL, B.NOME, SUM(A.QUANTIDADE) QTD_MES3
        FROM SALES_PROD A
        INNER JOIN ${process.env.CD_BASE}..PRODUTOS B ON A.COD_ORIGINAL = B.ALTERNATI
        INNER JOIN SALES C ON A.CODLOJA = C.CODLOJA AND A.ID_SALES = C.ID_SALES
        WHERE SUBSTRING(CONVERT(CHAR(8),C.EMISSAO,112),1,6)='${yearBase}${monthBase.length === 1 ? '0'+month3 : month3}'
          AND B.ATIVO = 'S'
          GROUP BY A.COD_ORIGINAL, B.NOME
        `

      /** @type{IProduct_Month3[]} */
      const products_month3 = await Products._query(0, script_month3, QueryTypes.SELECT)

      products.forEach( prod => {
        const pm1 = products_month1.find( pm1 => prod.COD_ORIGINAL === pm1.COD_ORIGINAL)
        const pm2 = products_month2.find( pm2 => prod.COD_ORIGINAL === pm2.COD_ORIGINAL)
        const pm3 = products_month3.find( pm3 => prod.COD_ORIGINAL === pm3.COD_ORIGINAL)

        if (pm1) {
          prod['QTD_MES1'] = pm1.QTD_MES1
        } else {
          prod['QTD_MES1'] = 0
        }

        if (pm2) {
          prod['QTD_MES2'] = pm2.QTD_MES2
        } else {
          prod['QTD_MES2'] = 0
        }

        if (pm3) {
          prod['QTD_MES3'] = pm3.QTD_MES3
        } else {
          prod['QTD_MES3'] = 0
        }

      })

      return res.json(products)
    } catch (e) {
      console.log(e)

      let status = e.status ? e.status : 400
      let error = e.error ? e.error : e

      return res.status(status).json(error)
    }
  },
  /**
   * @param {any} req
   * @param {any} res
   */
  async salesOpen(req, res) {
    try {
      const sales = await SalesService.findSalesToReport()

      return res.json(sales)
    } catch (e) {
      console.log(e)

      let status = e.status ? e.status : 400
      let error = e.error ? e.error : e

      return res.status(status).json(error)
    }
  },
  /**
   * @param {any} req
   * @param {any} res
   */
  async purchaseRequest(req, res){
    try {
      const purchase = await PurchaseOrderService.findToReport()

      return res.json(purchase)
    } catch (e) {
      console.log(e)

      let status = e.status ? e.status : 400
      let error = e.error ? e.error : e

      return res.status(status).json(error)
    }
  },
  /**
   * @param {any} req
   * @param {any} res
   */
  async productsMovement(req, res){
    try {
      const { date, typeMovement } = req.query

      if (!date || !typeMovement) {
        throw {
          status: 409,
          error: {
            message: 'outdated forecast!'
          }
        }
      }

      const types = {
        all: '',
        movement: '      WHERE A.QTD_ENT <> 0 OR A.QTD_SAI <> 0',
        notMovement: '      WHERE A.QTD_ENT = 0 AND A.QTD_SAI = 0'
      }

      const script = `
      SELECT * FROM (
        SELECT A.CODIGO, A.ALTERNATI, A.NOME, A.ESTOQUE_KARDEX + (ISNULL(B.QTD_MOV, 0)*-1) EST_INI, ISNULL(B.QTD_ENT, 0) QTD_ENT,
        ISNULL(B.QTD_SAI, 0) *-1 QTD_SAI, A.ESTOQUE_KARDEX EST_ATUAL
        FROM VIEW_KARDEX_DIF_EST A
        LEFT JOIN  (SELECT CODPRODUTO, SUM(QUANT_ENTRADA) QTD_ENT, SUM(QUANT_SAIDA) QTD_SAI, SUM(QUANT_ENTRADA) - SUM(QUANT_SAIDA) QTD_MOV
          FROM VIEW_KARDEX_PRODUTOS
          WHERE DATA >= '${date}'
          AND LOJA = 1
          GROUP BY CODPRODUTO) B ON A.CODIGO = B.CODPRODUTO) A\n`+types[typeMovement]

      const getProductsMovement = await Products._query(1, script, QueryTypes.SELECT)

      return res.json(getProductsMovement)
    } catch (e) {
      console.log(e)

      let status = e.status ? e.status : 400
      let error = e.error ? e.error : e

      return res.status(status).json(error)
    }
  },
  /**
   * @param {any} req
   * @param {any} res
   */
  async dre(req, res) {
    try {
      const { dateStart, dateEnd, shop } = req.query

      if (!dateStart || !dateEnd || !shop) {
        throw {
          status: 409,
          error: {
            message: 'pleases provide dates!'
          }
        }
      }

      if (dateEnd < dateStart) {
        throw {
          status: 409,
          error: {
            message: 'date end is less than date start!'
          }
        }
      }

      const shopSelected = await ShopSceService.findByShop(shop)
      const revenues = await DreService.revenues({ shop, dateStart, dateEnd })
      const variableExpenses = await DreService.variableExpenses({
        shop,
        dateStart,
        dateEnd,
        totRevenues: revenues.grossRevenue.value,
      })
      const fixedExpenses = await DreService.FixedExpenses({
        shop,
        dateStart,
        dateEnd,
        totRevenues: revenues.grossRevenue.value
      })
      const financialSummary = await DreService.financialSummary({ shop, dateStart, dateEnd })
      const currentStock = await DreService.currentStock({ shop })

      const grossContributionMargin = {
        value: revenues.grossRevenue.value - variableExpenses.total.value,
        percent: ((revenues.grossRevenue.value - variableExpenses.total.value) / revenues.grossRevenue.value) * 100
      }

      const netResult = {
        value: grossContributionMargin.value - fixedExpenses.total.value - revenues.salesReturns.value,
        percent: ((grossContributionMargin.value - fixedExpenses.total.value - revenues.salesReturns.value) / revenues.grossRevenue.value) * 100
      }

      const balancePoint = {
        value: (fixedExpenses.total.value / grossContributionMargin.percent) * 100,
        percent: (((fixedExpenses.total.value / grossContributionMargin.percent) * 100) / revenues.grossRevenue.value) * 100
      }

      return res.json({
        revenues,
        variableExpenses,
        grossContributionMargin,
        fixedExpenses,
        netResult,
        balancePoint,
        financialSummary,
        currentStock,
        shopSelected
      })
    } catch (e) {
      console.log(e)

      let status = e.status ? e.status : 400
      let error = e.error ? e.error : e

      return res.status(status).json(error)
    }
  },
  /**
   * @param {any} req
   * @param {any} res
   */
  async deliveries(req, res) {
    const { dateStart, dateEnd } = req.query

    try {
      const deliveriesByAssistants = await DeliveryService.deliveriesByAssistants(dateStart, dateEnd)
      const deliveriesByDriver = await DeliveryService.deliveriesByDriver(dateStart, dateEnd)
      const deliveriesByStore = await DeliveryService.deliveriesByStore(dateStart, dateEnd)

      const deliveryCd = {
        'SONO' :'CD São Luís',
        'SONO_CD_PIAUI' :'CD Piauí',
        'SONO_CD_PARA' :'CD Para',
      }

      return res.json({
        deliveriesByAssistants,
        deliveriesByDriver,
        deliveriesByStore,
        deliveryCd: deliveryCd[connections[1].database]
      })
    } catch (e) {
      console.log(e)

      let status = e.status ? e.status : 400
      let error = e.error ? e.error : e

      return res.status(status).json(error)
    }
  }
}
