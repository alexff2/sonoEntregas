module.exports = {
  findSaleProductToForecast({ idSale, idShops }){
    return `
    SELECT A.ID_SALE_ID, A.ID_SALES, C.CODIGO CODPRODUTO, A.COD_ORIGINAL, A.CODLOJA, A.DESCONTO, C.NOME, A.[STATUS],
    A.QUANTIDADE, ISNULL(D.qtdForecast, 0) qtdForecast, E.EST_LOJA, E.EST_LOJA - ISNULL(D.qtdForecast, 0) availableStock,
    ISNULL(B.QTD_MOUNTING, 0) QTD_MOUNTING, A.QUANTIDADE - (ISNULL(B.QTD_MOUNTING, 0)) openQuantity
    FROM SALES_PROD A
    LEFT JOIN (	SELECT ID_SALE, COD_ORIGINAL, CODLOJA, SUM(QTD_DELIV) QTD_MOUNTING
          FROM DELIVERYS_PROD A
          INNER JOIN DELIVERYS B ON A.ID_DELIVERY = B.ID
          WHERE DELIVERED = 0
          GROUP BY ID_SALE, COD_ORIGINAL, CODLOJA) B
    ON A.CODLOJA = B.CODLOJA AND A.ID_SALES = B.ID_SALE AND A.COD_ORIGINAL = B.COD_ORIGINAL
    INNER JOIN ${process.env.CD_BASE}..PRODUTOS C ON A.COD_ORIGINAL = C.ALTERNATI
    LEFT JOIN ( SELECT A.COD_ORIGINAL, SUM(A.qtdForecast) qtdForecast FROM (
                  SELECT COD_ORIGINAL, SUM(QUANTIDADE) qtdForecast, 'sales' TIPO
                  FROM SALES_PROD
                  WHERE [STATUS] IN ('Em Previsão', 'Em lançamento')
                  GROUP BY COD_ORIGINAL
                  UNION
                  SELECT A.COD_ORIGINAL, SUM(QUANTIDADE) qtdForecast, 'maintenance' TIPO
                  FROM MAINTENANCE A
                  INNER JOIN MAINTENANCE_DELIV B ON A.ID = B.ID_MAINT
                  WHERE A.[STATUS] IN ('Em Previsão', 'Em lançamento')
                  GROUP BY COD_ORIGINAL) A
                GROUP BY A.COD_ORIGINAL
                ) D
    ON A.COD_ORIGINAL = D.COD_ORIGINAL
    LEFT JOIN ${process.env.CD_BASE}..PRODLOJAS E ON E.CODIGO = C.CODIGO
    WHERE E.CODLOJA = 1 AND A.ID_SALES = ${idSale} AND A.CODLOJA IN (${idShops})`
  },
  findSaleProductMaintenanceToForecast({ idSale, idShops }){
    return `
    SELECT A.ID_SALE_ID, A.ID_SALES, C.CODIGO CODPRODUTO, A.COD_ORIGINAL, A.CODLOJA, A.DESCONTO, C.NOME, 'Enviado' STATUS,
    F.QUANTIDADE, ISNULL(D.qtdForecast, 0) qtdForecast, E.EST_LOJA, E.EST_LOJA - ISNULL(D.qtdForecast, 0) availableStock,
    0 QTD_MOUNTING, F.QUANTIDADE openQuantity, F.ID ID_MAINTENANCE
    FROM SALES_PROD A
    INNER JOIN ${process.env.CD_BASE}..PRODUTOS C ON A.COD_ORIGINAL = C.ALTERNATI
    LEFT JOIN ( SELECT A.COD_ORIGINAL, SUM(A.qtdForecast) qtdForecast FROM (
                  SELECT COD_ORIGINAL, SUM(QUANTIDADE) qtdForecast, 'sales' TIPO
                  FROM SALES_PROD
                  WHERE [STATUS] IN ('Em Previsão', 'Em lançamento')
                  GROUP BY COD_ORIGINAL
                  UNION
                  SELECT A.COD_ORIGINAL, SUM(QUANTIDADE) qtdForecast, 'maintenance' TIPO
                  FROM MAINTENANCE A
                  INNER JOIN MAINTENANCE_DELIV B ON A.ID = B.ID_MAINT
                  WHERE A.[STATUS] IN ('Em Previsão', 'Em lançamento')
                  GROUP BY COD_ORIGINAL) A
                GROUP BY A.COD_ORIGINAL
                ) D
    ON A.COD_ORIGINAL = D.COD_ORIGINAL
    LEFT JOIN ${process.env.CD_BASE}..PRODLOJAS E ON E.CODIGO = C.CODIGO
    INNER JOIN MAINTENANCE F ON F.CODLOJA = A.CODLOJA AND F.ID_SALE = A.ID_SALES AND F.COD_ORIGINAL = A.COD_ORIGINAL
    WHERE E.CODLOJA = 1 AND F.STATUS = 'No CD' AND A.ID_SALES = ${idSale} AND A.CODLOJA IN (${idShops})`
  },
  findSaleMaintenance({ idSale }) {
    return `
    SELECT B.ID, B.ID_SALES, B.NOMECLI, B.CODLOJA, B.D_ENTREGA1, B.BAIRRO, A.ID ID_MAINTENANCE, A.STATUS
    FROM MAINTENANCE A
    INNER JOIN SALES B ON A.ID_SALE = B.ID_SALES AND A.CODLOJA = B.CODLOJA
    WHERE A.ID_SALE = ${idSale}`
  }
}