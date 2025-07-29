module.exports = {
  getPendingProductsOutOfStock({date}) {
    return `
    SELECT a.DESCRICAO, A.PEDIDO, A.QTD, A.PED_LOTE_CARGA FROM (
      SELECT A.DESCRICAO, A.PEDIDO, SUM(A.QUANTIDADE) QTD, C.EST_ATUAL, ISNULL(B.FACTORY_DATA, '') PED_LOTE_CARGA
      FROM (
        SELECT
          ID_SALES DAV, DESCRICAO, QUANTIDADE, SP.COD_ORIGINAL, 
          ISNULL((SELECT MIN(B.NUMPEDIDO) FROM PRODUTOS A
          INNER JOIN VIEW_SALDO_PEDIDO_PRODUTO_VALOR B
          ON A.CODIGO = B.CODPRODUTO
          WHERE A.ALTERNATI = SP.COD_ORIGINAL
          AND QTE_CHEGADA <> QTE_PEDIDO
          ), '') PEDIDO
        FROM ${process.env.ENTREGAS_BASE}..SALES_PROD SP
        WHERE ID_SALE_ID IN (
          SELECT ID FROM ${process.env.ENTREGAS_BASE}..SALES
          where D_ENTREGA1 <= '${date}'
          and status = 'Aberta')
        AND SP.STATUS = 'Enviado'
      ) A
      LEFT JOIN PEDFOR B ON A.PEDIDO = B.CODIGOPEDIDO
      LEFT JOIN (
        SELECT A.CODIGO CODPRODUTO, B.EST_ATUAL, A.ALTERNATI
        FROM PRODUTOS A INNER JOIN PRODLOJAS B ON A.CODIGO = B.CODIGO
        WHERE B.CODLOJA = 1
      ) C ON C.ALTERNATI = A.COD_ORIGINAL
      GROUP BY  A.DESCRICAO, A.PEDIDO, B.FACTORY_DATA, C.EST_ATUAL
    ) A WHERE A.EST_ATUAL < A.QTD`
  },
  stockBeep(condition, type = 'IN'){
    const where = Object.keys(condition) === 'COD_ORIGINAL' 
      ? `A.ALTERNATI IN (${Object.values(condition)})`
      : `A.${Object.keys(condition)} ${type === 'IN' ? `IN (${Object.values(condition)})` : `LIKE '${Object.values(condition)}%'`}`

      return`SELECT A.CODIGO, A.ALTERNATI COD_ORIGINAL, A.NOME, ISNULL(C.EST_LOJA, 0) EST_LOJA, ISNULL(B.qtdForecast, 0) qtdForecast, ISNULL(D.qtdTransfer, 0) qtdTransfer, ISNULL(C.EST_LOJA, 0) - ISNULL(B.qtdForecast, 0) - ISNULL(D.qtdTransfer, 0) availableStock
    FROM PRODUTOS A
    LEFT JOIN (
      SELECT A.COD_ORIGINAL, A.qtdForecast - ISNULL(B.qtdBeep, 0) qtdForecast FROM (
        SELECT B.COD_ORIGINAL, SUM(B.quantityForecast) qtdForecast
        FROM ${process.env.ENTREGAS_BASE}..FORECAST_SALES A
        INNER JOIN ${process.env.ENTREGAS_BASE}..FORECAST_PRODUCT B ON A.id = B.idForecastSale
        INNER JOIN ${process.env.ENTREGAS_BASE}..FORECAST C ON C.id = A.idForecast
        WHERE (C.status IS NULL OR C.status = 1)
        GROUP BY B.COD_ORIGINAL) A
      LEFT JOIN (
        SELECT B.ALTERNATI, COUNT(*) qtdBeep
        FROM PRODLOJAS_SERIES_MOVIMENTOS A
        INNER JOIN PRODUTOS B ON A.productId = B.CODIGO
        WHERE A.outputBeepDate IS NOT NULL AND outputModule = 'delivery' AND A.outputModuleId IN (
          SELECT A.idDelivery
          FROM ${process.env.ENTREGAS_BASE}..FORECAST_SALES A
          INNER JOIN ${process.env.ENTREGAS_BASE}..FORECAST_PRODUCT B ON A.id = B.idForecastSale
          INNER JOIN ${process.env.ENTREGAS_BASE}..FORECAST C ON C.id = A.idForecast
          WHERE (C.status IS NULL OR C.status = 1)
        )
        GROUP BY B.ALTERNATI
      ) B ON A.COD_ORIGINAL = B.ALTERNATI
    ) B ON A.ALTERNATI = B.COD_ORIGINAL
    LEFT JOIN (
      SELECT productId, COUNT(*) EST_LOJA
        FROM PRODLOJAS_SERIES_MOVIMENTOS
        WHERE outputBeepDate IS NULL
        GROUP BY productId
    ) C ON C.productId = A.CODIGO
    LEFT JOIN (
      SELECT A.CODPRODUTO, A.QUANTIDADE - ISNULL(B.qtd_beep, 0) qtdTransfer
      FROM (
        SELECT B.CODPRODUTO, SUM(B.QUANTIDADE) QUANTIDADE
        FROM TRANSPRODLOJA A
        INNER JOIN TRANSPRODLOJAI B ON A.CODIGO = B.REGISTRO
        WHERE A.EMISSAO >= '2025-04-08' AND A.LOJAORIGEM = 1
        GROUP BY B.CODPRODUTO
      ) A LEFT JOIN (
        SELECT productId, COUNT(*) qtd_beep
        FROM PRODLOJAS_SERIES_MOVIMENTOS
        WHERE outputModule = 'transfer'
        GROUP BY productId
      ) B ON A.CODPRODUTO = B.productId
      WHERE (A.QUANTIDADE - ISNULL(B.qtd_beep, 0)) <> 0
    ) D ON D.CODPRODUTO = A.CODIGO
    WHERE ${where}`
  },
  stockNotBeep(condition, type = 'IN'){
    const where = Object.keys(condition) === 'COD_ORIGINAL' 
      ? `A.ALTERNATI IN (${Object.values(condition)})`
      : `A.${Object.keys(condition)} ${type === 'IN' ? `IN (${Object.values(condition)})` : `LIKE '${Object.values(condition)}%'`}`

    return `SELECT A.CODIGO, A.ALTERNATI COD_ORIGINAL, A.NOME, ISNULL(C.EST_LOJA, 0) EST_LOJA, ISNULL(B.qtdForecast, 0) qtdForecast, ISNULL(C.EST_LOJA, 0) - ISNULL(B.qtdForecast, 0) availableStock
    FROM PRODUTOS A
    LEFT JOIN (
      SELECT B.COD_ORIGINAL, SUM(B.quantityForecast) qtdForecast
      FROM SONOENTREGAS..FORECAST_SALES A
      INNER JOIN SONOENTREGAS..FORECAST_PRODUCT B ON A.id = B.idForecastSale
      INNER JOIN SONOENTREGAS..FORECAST C ON C.id = A.idForecast
      WHERE (C.status IS NULL OR C.status = 1)
      GROUP BY B.COD_ORIGINAL
    ) B ON A.ALTERNATI = B.COD_ORIGINAL
    LEFT JOIN PRODLOJAS C ON C.CODIGO = A.CODIGO
    WHERE C.CODLOJA = 1
    AND ${where}`
  },
}