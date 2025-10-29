module.exports = {
  openTransfers: (productId) => {
    return `SELECT * FROM (
      SELECT A.CODIGO id, D.NOME [to], CONVERT(VARCHAR(10), A.EMISSAO, 103) date, B.QUANTIDADE, B.CODPRODUTO,
	  ISNULL(C.QTD_BEEP, 0) QTD_BEEP,B.QUANTIDADE - ISNULL(C.QTD_BEEP, 0) quantity
      FROM TRANSPRODLOJA A
      INNER JOIN TRANSPRODLOJAI B ON A.CODIGO = B.REGISTRO
      LEFT JOIN (
        SELECT productId, COUNT(productId) QTD_BEEP, outputModuleId
        FROM PRODLOJAS_SERIES_MOVIMENTOS
        WHERE outputModule = 'transfer'
        GROUP BY productId, outputModuleId
      ) C ON B.CODPRODUTO = C.productId AND A.CODIGO = C.outputModuleId
	  INNER JOIN EMPRESA D ON D.CODIGO = A.LOJAORIGEM
      WHERE A.EMISSAO >= '${process.env.DATE_START}'
      AND A.TIPODC = 'D'
    ) A WHERE A.QTD_BEEP <> A.QUANTIDADE AND A.CODPRODUTO = ${productId}`
  },
  openForecasts: (alternativeId) => {
    return `SELECT A.id, D.ID_SALES idSales, CONVERT(VARCHAR(10), A.date, 103) date, SUM(C.quantityForecast) quantity
      FROM FORECAST A
      INNER JOIN FORECAST_SALES B ON A.id = B.idForecast
      INNER JOIN FORECAST_PRODUCT C ON B.id = C.idForecastSale
      INNER JOIN SALES D ON B.idSale = D.ID
      WHERE (A.status IS NULL OR A.status = 1) AND C.COD_ORIGINAL = '${alternativeId}'
      GROUP BY A.id, A.date, C.COD_ORIGINAL, D.ID_SALES`
  },
  openRoutes: (alternativeId) => {
    return `SELECT B.ID id, A.ID_SALE idSale, CONVERT(VARCHAR(10), B.D_MOUNTING, 103) [date], B.DESCRIPTION [route], A.QTD_DELIV quantity, 'VEN' SIT
    FROM DELIVERYS_PROD A INNER JOIN DELIVERYS B ON A.ID_DELIVERY = B.ID
    WHERE B.STATUS = 'Em lançamento' AND A.COD_ORIGINAL = '${alternativeId}'
    UNION
    SELECT B.ID id, A.ID_SALE idSale, CONVERT(VARCHAR(10), C.D_MOUNTING, 103) [date], C.DESCRIPTION [route], A.QUANTIDADE quantity, 'MAN' SIT
    FROM MAINTENANCE A
    INNER JOIN MAINTENANCE_DELIV B ON A.ID = B.ID_MAINT
    INNER JOIN DELIVERYS C ON C.ID = B.ID_DELIV_MAIN
    WHERE C.STATUS = 'Em lançamento' AND A.COD_ORIGINAL = '${alternativeId}'`
  },
  pendingPurchaseOrder: (productId) => {
    return `SELECT A.CODIGOPEDIDO id, CONVERT(VARCHAR(10), A.EMISSAO, 103) [date], B.QUANTIDADE - ISNULL(C.QUANTIDADE, 0) quantity
    FROM PEDFOR A
    INNER JOIN PEDFORI B ON A.CODIGOPEDIDO = B.NUMPEDIDO
    LEFT JOIN (
      SELECT A.PEDIDO, B.PRODUTO, SUM(B.QUANTIDADE) QUANTIDADE
      FROM NFISCAL A
      INNER JOIN NFITENS B ON A.NF = B.NNF
      GROUP BY A.PEDIDO, B.PRODUTO
    ) C ON C.PRODUTO = B.CODPRODUTO AND C.PEDIDO = A.CODIGOPEDIDO
    WHERE B.QUANTIDADE - ISNULL(C.QUANTIDADE, 0) <> 0 AND A.EMISSAO >= '${process.env.DATE_PURCHASE}' AND B.CODPRODUTO = ${productId}`
  }
}