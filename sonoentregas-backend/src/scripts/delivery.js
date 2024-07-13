module.exports = {
  findToBeep(id, status) {
    const script = status === 'Finalizada'
      ?`SELECT B.CODIGO id, B.APLICACAO mask, B.NOME [nameFull], SUM(A.QTD_DELIV) quantity,
      ISNULL(C.quantityBeep, 0) quantityBeep, A.ID_DELIVERY moduleId, B.SUBG subGroupId, 
      (SUM(A.QTD_DELIV) - ISNULL(C.quantityBeep, 0)) quantityPedding
      FROM ${process.env.ENTREGAS_BASE}..DELIVERYS_PROD A
      INNER JOIN PRODUTOS B ON A.COD_ORIGINAL = B.ALTERNATI
      LEFT JOIN ( SELECT productId, COUNT(id) quantityBeep
            FROM PRODLOJAS_SERIES_MOVIMENTOS
            WHERE inputModule = 'delivery'
            AND inputModuleId = ${id}
            GROUP BY productId) C ON C.productId = B.CODIGO
      WHERE A.ID_DELIVERY = ${id} AND A.DELIVERED = 1
      GROUP BY A.ID_DELIVERY, B.CODIGO,  B.APLICACAO, B.NOME, C.quantityBeep, B.SUBG`
      :`SELECT B.CODIGO id, B.APLICACAO mask, B.NOME [nameFull], SUM(A.QTD_DELIV) quantity,
      ISNULL(C.quantityBeep, 0) quantityBeep, A.ID_DELIVERY moduleId, B.SUBG subGroupId, 
      (SUM(A.QTD_DELIV) - ISNULL(C.quantityBeep, 0)) quantityPedding
      FROM ${process.env.ENTREGAS_BASE}..DELIVERYS_PROD A
      INNER JOIN PRODUTOS B ON A.COD_ORIGINAL = B.ALTERNATI
      LEFT JOIN ( SELECT productId, COUNT(id) quantityBeep
            FROM PRODLOJAS_SERIES_MOVIMENTOS
            WHERE outputModule = 'delivery'
            AND outputModuleId = ${id}
            GROUP BY productId) C ON C.productId = B.CODIGO
      WHERE A.ID_DELIVERY = ${id}
      GROUP BY A.ID_DELIVERY, B.CODIGO,  B.APLICACAO, B.NOME, C.quantityBeep, B.SUBG`

    return script
  }

}