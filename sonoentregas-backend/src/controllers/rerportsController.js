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
       LEFT JOIN SONOENTREGAS..VIEW_QTD_PROD_PENDENTE B ON A.ALTERNATI = B.COD_ORIGINAL
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
          SELECT A.COD_ORIGINAL, B.NOME, SUM(A.QTD_DELIV) QTD_MES1
          FROM SALES_PROD A
          INNER JOIN SONO..PRODUTOS B ON A.COD_ORIGINAL = B.ALTERNATI
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
          INNER JOIN SONO..PRODUTOS B ON A.COD_ORIGINAL = B.ALTERNATI
          INNER JOIN SALES C ON A.CODLOJA = C.CODLOJA AND A.ID_SALES = C.ID_SALES
          WHERE SUBSTRING(CONVERT(CHAR(8),C.EMISSAO,112),1,6)='${yearBase-1}${month1}'
          AND B.ATIVO = 'S'
          GROUP BY A.COD_ORIGINAL, B.NOME
        `
      } else {
        script_month1 = `
          SELECT A.COD_ORIGINAL, B.NOME, SUM(A.QUANTIDADE) QTD_MES1
          FROM SALES_PROD A
          INNER JOIN SONO..PRODUTOS B ON A.COD_ORIGINAL = B.ALTERNATI
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
          INNER JOIN SONO..PRODUTOS B ON A.COD_ORIGINAL = B.ALTERNATI
          INNER JOIN SALES C ON A.CODLOJA = C.CODLOJA AND A.ID_SALES = C.ID_SALES
          WHERE SUBSTRING(CONVERT(CHAR(8),C.EMISSAO,112),1,6)='${yearBase-1}${month2}'
          AND B.ATIVO = 'S'
          GROUP BY A.COD_ORIGINAL, B.NOME
        `
      } else {
        script_month2 = `
          SELECT A.COD_ORIGINAL, B.NOME, SUM(A.QUANTIDADE) QTD_MES2
          FROM SALES_PROD A
          INNER JOIN SONO..PRODUTOS B ON A.COD_ORIGINAL = B.ALTERNATI
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
        INNER JOIN SONO..PRODUTOS B ON A.COD_ORIGINAL = B.ALTERNATI
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
  }
}

