module.exports = {
  findToBeepDelivery(id) {
    return `SELECT B.CODIGO id, B.APLICACAO mask, B.NOME [nameFull], SUM(A.QTD_DELIV) quantity,
      ISNULL(C.quantityBeep, 0) quantityBeep, A.ID_DELIVERY moduleId, B.SUBG subGroupId, 
      (SUM(A.QTD_DELIV) - ISNULL(C.quantityBeep, 0)) quantityPedding, 'delivery' module
      FROM ${process.env.ENTREGAS_BASE}..DELIVERYS_PROD A
      INNER JOIN PRODUTOS B ON A.COD_ORIGINAL = B.ALTERNATI
      LEFT JOIN ( SELECT productId, COUNT(id) quantityBeep
          FROM PRODLOJAS_SERIES_MOVIMENTOS
          WHERE outputModule = 'delivery'
          AND outputModuleId = ${id}
          GROUP BY productId) C ON C.productId = B.CODIGO
      WHERE A.ID_DELIVERY = ${id}
      GROUP BY A.ID_DELIVERY, B.CODIGO,  B.APLICACAO, B.NOME, C.quantityBeep, B.SUBG
      UNION
      SELECT C.CODIGO id, C.APLICACAO mask, C.NOME nameFull, A.QUANTIDADE quantity,
      ISNULL(D.quantityBeep, 0) quantityBeep, A.ID moduleId, C.SUBG subGroupId,
      A.QUANTIDADE - ISNULL(D.quantityBeep, 0) quantityBeep, 'maintenance' module
      FROM ${process.env.ENTREGAS_BASE}..MAINTENANCE A
      INNER JOIN ${process.env.ENTREGAS_BASE}..MAINTENANCE_DELIV B ON A.ID = B.ID_MAINT
      INNER JOIN PRODUTOS C ON C.ALTERNATI = A.COD_ORIGINAL
      LEFT JOIN ( SELECT productId, COUNT(id) quantityBeep, outputModuleId
          FROM PRODLOJAS_SERIES_MOVIMENTOS
          WHERE outputModule = 'maintenance'
          GROUP BY productId, outputModuleId) D ON D.productId = C.CODIGO AND D.outputModuleId = A.ID
      WHERE B.ID_DELIV_MAIN = ${id}`
  },
  findToBeepDeliveryReturn(id) {
    return `
      SELECT B.CODIGO id, B.APLICACAO mask, B.NOME [nameFull], SUM(A.QTD_DELIV) quantity,
      ISNULL(C.quantityBeep, 0) quantityBeep, A.ID_DELIVERY moduleId, B.SUBG subGroupId, 
      (SUM(A.QTD_DELIV) - ISNULL(C.quantityBeep, 0)) quantityPedding, 'delivery' module
      FROM ${process.env.ENTREGAS_BASE}..DELIVERYS_PROD A
      INNER JOIN PRODUTOS B ON A.COD_ORIGINAL = B.ALTERNATI
      LEFT JOIN ( SELECT productId, COUNT(id) quantityBeep
            FROM PRODLOJAS_SERIES_MOVIMENTOS
            WHERE inputModule = 'delivery'
            AND inputModuleId = ${id}
            GROUP BY productId) C ON C.productId = B.CODIGO
      WHERE A.ID_DELIVERY = ${id} AND A.DELIVERED = 1
      GROUP BY A.ID_DELIVERY, B.CODIGO,  B.APLICACAO, B.NOME, C.quantityBeep, B.SUBG
      UNION
      SELECT C.CODIGO id, C.APLICACAO mask, C.NOME nameFull, B.quantity,
      ISNULL(D.quantityBeep, 0) quntityBeep, A.id moduleId, C.SUBG subGroupId,
      B.quantity - ISNULL(D.quantityBeep, 0) quantityPedding, 'saleReturn' module
      FROM ${process.env.ENTREGAS_BASE}..RETURNS_SALES A
      INNER JOIN ${process.env.ENTREGAS_BASE}..RETURNS_SALES_PRODUCTS B ON A.id = B.returnsSalesId
      INNER JOIN PRODUTOS C ON B.alternativeCode = C.ALTERNATI
      LEFT JOIN ( SELECT productId, COUNT(id) quantityBeep, inputModuleId
          FROM PRODLOJAS_SERIES_MOVIMENTOS
          WHERE inputModule = 'saleReturn'
          GROUP BY productId, inputModuleId) D ON D.productId = C.CODIGO AND A.id = D.inputModuleId
      WHERE A.deliveryId = ${id}`
  }
}