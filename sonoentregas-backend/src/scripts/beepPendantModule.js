//@ts-check
/**
 * 
 * @typedef {Object} WhereInput
 * @property {'TRANSFERENCIA ENTRADA' | 'TRANSFERENCIA SAIDA' | 'ROTA DE ENTREGA' | 'NOTA DE ENTRADA'} [module]
 * @property {string} [id]
 * @property {string} [data]
 * @property {string} [obs]
 */

const getObj = require('../functions/getObj')

const scriptDefault =`
SELECT * FROM (
  SELECT 'ROTA DE ENTREGA' AS MODULE, C.ID, C.D_MOUNTING DATA, A.QTD, ISNULL(B.QTD_BEEP, 0) QTD_BEEP, C.DESCRIPTION+' - '+C.DRIVER+' / '+C.ASSISTANT OBS
  FROM (
    SELECT A.ID_DELIVERY, SUM(A.QTD) QTD FROM (
      SELECT ID_DELIVERY, SUM(QTD_DELIV) QTD, 'DELIVERYS_PROD' TIPO
      FROM DELIVERYS_PROD
      GROUP BY ID_DELIVERY
      UNION
      SELECT B.ID_DELIV_MAIN, SUM(A.QUANTIDADE) QTD, 'MAINTENANCE' TIPO
      FROM MAINTENANCE A
      INNER JOIN MAINTENANCE_DELIV B ON A.ID = B.ID_MAINT
      GROUP BY B.ID_DELIV_MAIN
    ) A
    GROUP BY A.ID_DELIVERY
  ) A
  LEFT JOIN (
    SELECT outputModuleId, COUNT(id) QTD_BEEP FROM ${process.env.CD_BASE}..PRODLOJAS_SERIES_MOVIMENTOS A
    INNER JOIN ${process.env.CD_BASE}..PRODUTOS B ON A.productId = B.CODIGO
    WHERE outputModule = 'Delivery'
    GROUP BY outputModuleId
    ) B ON A.ID_DELIVERY = B.outputModuleId
  INNER JOIN VIEW_DELIVERYS C ON A.ID_DELIVERY = C.ID
  WHERE C.D_MOUNTING >= '${process.env.DATE_START}'
  AND (A.QTD - ISNULL(B.QTD_BEEP, 0)) <> 0
  UNION
  SELECT 'ROTA DE ENTREGA - RETORNO' AS MODULE, C.ID, C.D_MOUNTING, A.QTD, ISNULL(B.QTD_BEEP, 0) QTD_BEEP, '' OBS
  FROM (
    SELECT A.ID_DELIVERY, SUM(A.QTD) QTD FROM (
      SELECT ID_DELIVERY, SUM(QTD_DELIV) QTD, 'DELIVERYS_PROD' TIPO
      FROM DELIVERYS_PROD
      WHERE DELIVERED = 1
      GROUP BY ID_DELIVERY
      UNION
      SELECT B.ID_DELIV_MAIN, SUM(A.QUANTIDADE) QTD, 'MAINTENANCE' TIPO
      FROM MAINTENANCE A
      INNER JOIN MAINTENANCE_DELIV B ON A.ID = B.ID_MAINT
      WHERE B.DONE = 0
      GROUP BY B.ID_DELIV_MAIN
    ) A
    GROUP BY A.ID_DELIVERY
  ) A
  LEFT JOIN (
    SELECT inputModuleId, COUNT(id) QTD_BEEP FROM ${process.env.CD_BASE}..PRODLOJAS_SERIES_MOVIMENTOS A
    INNER JOIN ${process.env.CD_BASE}..PRODUTOS B ON A.productId = B.CODIGO
    WHERE inputModule = 'Delivery'
    GROUP BY inputModuleId
    ) B ON A.ID_DELIVERY = B.inputModuleId
  INNER JOIN DELIVERYS C ON A.ID_DELIVERY = C.ID
  WHERE C.D_MOUNTING >= '${process.env.DATE_START}'
  AND (A.QTD - ISNULL(B.QTD_BEEP, 0)) <> 0
  UNION
  SELECT 'TRANSFERENCIA SAIDA' AS MODULE, C.CODIGO, C.EMISSAO, A.QTD, ISNULL(B.QTD_BEEP, 0) QTD_BEEP, '' OBS
  FROM (
    SELECT REGISTRO, SUM(QUANTIDADE) QTD
    FROM ${process.env.CD_BASE}..TRANSPRODLOJAI
    GROUP BY REGISTRO
  ) A
  LEFT JOIN (
    SELECT outputModuleId, COUNT(id) QTD_BEEP FROM ${process.env.CD_BASE}..PRODLOJAS_SERIES_MOVIMENTOS A
    INNER JOIN ${process.env.CD_BASE}..PRODUTOS B ON A.productId = B.CODIGO
    WHERE outputModule = 'Transfer'
    GROUP BY outputModuleId
    ) B ON A.REGISTRO = B.outputModuleId
  INNER JOIN ${process.env.CD_BASE}..TRANSPRODLOJA C ON A.REGISTRO= C.CODIGO
  WHERE C.EMISSAO >= '${process.env.DATE_START}' AND C.TIPODC = 'D'
  AND (A.QTD - ISNULL(B.QTD_BEEP, 0)) <> 0
  UNION
  SELECT 'TRANSFERENCIA ENTRADA' AS MODULE, C.CODIGO, C.EMISSAO, A.QTD, ISNULL(B.QTD_BEEP, 0) QTD_BEEP, '' OBS
  FROM (
    SELECT REGISTRO, SUM(QUANTIDADE) QTD
    FROM ${process.env.CD_BASE}..TRANSPRODLOJAI
    GROUP BY REGISTRO
  ) A
  LEFT JOIN (
    SELECT inputModuleId, COUNT(id) QTD_BEEP FROM ${process.env.CD_BASE}..PRODLOJAS_SERIES_MOVIMENTOS A
    INNER JOIN ${process.env.CD_BASE}..PRODUTOS B ON A.productId = B.CODIGO
    WHERE inputModule = 'transfer'
    GROUP BY inputModuleId
    ) B ON A.REGISTRO = B.inputModuleId
  INNER JOIN ${process.env.CD_BASE}..TRANSPRODLOJA C ON A.REGISTRO= C.CODIGO
  WHERE C.EMISSAO >= '${process.env.DATE_START}' AND C.TIPODC = 'C'
  AND (A.QTD - ISNULL(B.QTD_BEEP, 0)) <> 0
  UNION
  SELECT 'NOTA DE ENTRADA' AS MODULE, A.NUM_DOC, A.EMISSAO, A.QTD, ISNULL(B.QTD_BEEP, 0) QTD_BEEP, '' OBS
  FROM (
    SELECT B.NUM_DOC, SUM(A.QUANTIDADE) QTD, B.EMISSAO
    FROM ${process.env.CD_BASE}..NFITENS A
    INNER JOIN ${process.env.CD_BASE}..NFISCAL B ON A.NNF = B.NF
    WHERE B.EMISSAO >= '${process.env.DATE_START}' AND B.PARTICIPA_ESTOQUE = 'S'
    GROUP BY B.NUM_DOC, B.EMISSAO
  ) A
  LEFT JOIN (
    SELECT inputModuleId, COUNT(id) QTD_BEEP FROM ${process.env.CD_BASE}..PRODLOJAS_SERIES_MOVIMENTOS A
    INNER JOIN ${process.env.CD_BASE}..PRODUTOS B ON A.productId = B.CODIGO
    WHERE inputModule = 'purchaseNote'
    GROUP BY inputModuleId
    ) B ON A.NUM_DOC = B.inputModuleId
  WHERE (A.QTD - ISNULL(B.QTD_BEEP, 0)) <> 0
) A
`
/**
 * @param {WhereInput} whereObj
 * @returns {string}
 */
function beepPendantModule(whereObj = {}) {
  const where = Object.keys(whereObj).length === 0 
    ? 'ORDER BY MODULE, DATA, ID' 
    : `WHERE ${getObj(whereObj, ' AND ')} ORDER BY MODULE, DATA, ID`

  const script = `${scriptDefault} ${where}`

  return script
}

module.exports = beepPendantModule
