const { extraRoutes } = require("../services/DeliveryService")

module.exports = {
  findToBeepDelivery(id) {
    return `
      SELECT B.CODIGO id, B.APLICACAO mask, B.NOME [nameFull], SUM(A.QTD_DELIV) quantity,
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
      ISNULL(D.quantityBeep, 0) quantityBeep, B.ID moduleId, C.SUBG subGroupId,
      A.QUANTIDADE - ISNULL(D.quantityBeep, 0) quantityBeep, 'maintenance' module
      FROM ${process.env.ENTREGAS_BASE}..MAINTENANCE A
      INNER JOIN ${process.env.ENTREGAS_BASE}..MAINTENANCE_DELIV B ON A.ID = B.ID_MAINT
      INNER JOIN PRODUTOS C ON C.ALTERNATI = A.COD_ORIGINAL
      LEFT JOIN ( SELECT productId, COUNT(id) quantityBeep, outputModuleId
          FROM PRODLOJAS_SERIES_MOVIMENTOS
          WHERE outputModule = 'maintenance'
          GROUP BY productId, outputModuleId) D ON D.productId = C.CODIGO AND D.outputModuleId = B.ID
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
      SELECT C.CODIGO id, C.APLICACAO mask, C.NOME nameFull, A.QUANTIDADE quantity,
      ISNULL(D.quantityBeep, 0) quantityBeep, B.ID moduleId, C.SUBG subGroupId,
      A.QUANTIDADE - ISNULL(D.quantityBeep, 0) quantityBeep, 'maintenance' module
      FROM ${process.env.ENTREGAS_BASE}..MAINTENANCE A
      INNER JOIN ${process.env.ENTREGAS_BASE}..MAINTENANCE_DELIV B ON A.ID = B.ID_MAINT
      INNER JOIN PRODUTOS C ON C.ALTERNATI = A.COD_ORIGINAL
      LEFT JOIN ( SELECT productId, COUNT(id) quantityBeep, inputModuleId
          FROM PRODLOJAS_SERIES_MOVIMENTOS
          WHERE inputModule = 'maintenance'
          GROUP BY productId, inputModuleId) D ON D.productId = C.CODIGO AND D.inputModuleId = B.ID
      WHERE B.DONE = 0 AND B.ID_DELIV_MAIN = ${id}
      UNION
      SELECT C.CODIGO id, C.APLICACAO mask, C.NOME nameFull, B.quantity,
      ISNULL(D.quantityBeep, 0) quntityBeep, B.id moduleId, C.SUBG subGroupId,
      B.quantity - ISNULL(D.quantityBeep, 0) quantityPedding, 'saleReturn' module
      FROM ${process.env.ENTREGAS_BASE}..RETURNS_SALES A
      INNER JOIN ${process.env.ENTREGAS_BASE}..RETURNS_SALES_PRODUCTS B ON A.id = B.returnsSalesId
      INNER JOIN PRODUTOS C ON B.alternativeCode = C.ALTERNATI
      LEFT JOIN ( SELECT productId, COUNT(id) quantityBeep, inputModuleId
          FROM PRODLOJAS_SERIES_MOVIMENTOS
          WHERE inputModule = 'saleReturn'
          GROUP BY productId, inputModuleId) D ON D.productId = C.CODIGO AND A.id = D.inputModuleId
      WHERE A.deliveryId = ${id}`
  },
  deliveriesByDriver(dateStart, dateEnd) {
    return `
    select *, (a.qtd_realized + a.qtd_return) total from (
      SELECT DESCRIPTION,
        (SELECT COUNT(ID_SALE) FROM (SELECT ID_SALE
        FROM DELIVERYS_PROD DP
        INNER JOIN DELIVERYS D ON DP.ID_DELIVERY = D.ID
        WHERE D.D_DELIVERED BETWEEN '${dateStart}' AND '${dateEnd}'
        AND D.ID_DRIVER = USERS.ID AND DP.DELIVERED = 0
        GROUP BY DP.ID_DELIVERY, DP.ID_SALE, D.ID_DRIVER,
        DP.CODLOJA) COUNT_D) qtd_realized,
        (SELECT COUNT(ID_SALE) FROM (SELECT ID_SALE
        FROM DELIVERYS_PROD DP
        INNER JOIN DELIVERYS D ON DP.ID_DELIVERY = D.ID
        WHERE D.D_DELIVERED BETWEEN '${dateStart}' AND '${dateEnd}'
        AND D.ID_DRIVER = USERS.ID AND DP.DELIVERED = 1
        GROUP BY DP.ID_DELIVERY, DP.ID_SALE, D.ID_DRIVER,
        DP.CODLOJA) COUNT_D) qtd_return
      FROM USERS
      WHERE OFFICE = 'Driver'
    ) a
    where a.qtd_realized + a.qtd_return > 0
    order by a.DESCRIPTION`
  },
  deliveriesByAssistants(dateStart, dateEnd) {
    return `
    select *, (a.qtd_realized + a.qtd_return) total from (
      SELECT DESCRIPTION,
        (SELECT COUNT(ID_SALE) FROM (SELECT ID_SALE
        FROM DELIVERYS_PROD DP
        INNER JOIN DELIVERYS D ON DP.ID_DELIVERY = D.ID
        WHERE D.D_DELIVERED BETWEEN '${dateStart}' AND '${dateEnd}'
        AND D.ID_ASSISTANT = USERS.ID AND DP.DELIVERED = 0
        GROUP BY DP.ID_DELIVERY, DP.ID_SALE, D.ID_ASSISTANT,
        DP.CODLOJA) COUNT_D) qtd_realized,
        (SELECT COUNT(ID_SALE) FROM (SELECT ID_SALE
        FROM DELIVERYS_PROD DP
        INNER JOIN DELIVERYS D ON DP.ID_DELIVERY = D.ID
        WHERE D.D_DELIVERED BETWEEN '${dateStart}' AND '${dateEnd}'
        AND D.ID_ASSISTANT = USERS.ID AND DP.DELIVERED = 1
        GROUP BY DP.ID_DELIVERY, DP.ID_SALE, D.ID_ASSISTANT,
        DP.CODLOJA) COUNT_D) qtd_return
      FROM USERS
      WHERE OFFICE = 'Assistant'
    ) a
    where a.qtd_realized + a.qtd_return > 0
    order by a.DESCRIPTION`
  },
  deliveriesByStore(dateStart, dateEnd) {
    return `
    select *, (a.qtd_realized + a.qtd_return) total from (
      SELECT DESCRICAO DESCRIPTION,
        (SELECT COUNT(ID_SALE) FROM (SELECT ID_SALE
        FROM DELIVERYS_PROD DP
        INNER JOIN DELIVERYS D ON DP.ID_DELIVERY = D.ID
        WHERE D.D_DELIVERED BETWEEN '${dateStart}' AND '${dateEnd}'
        AND DP.CODLOJA = LOJAS.CODLOJA AND DP.DELIVERED = 0
        GROUP BY DP.ID_DELIVERY, DP.ID_SALE, DP.CODLOJA) COUNT_D
      ) qtd_realized,
      (SELECT COUNT(ID_SALE) FROM (SELECT ID_SALE
        FROM DELIVERYS_PROD DP
        INNER JOIN DELIVERYS D ON DP.ID_DELIVERY = D.ID
        WHERE D.D_DELIVERED BETWEEN '${dateStart}' AND '${dateEnd}'
        AND DP.CODLOJA = LOJAS.CODLOJA AND DP.DELIVERED = 1
        GROUP BY DP.ID_DELIVERY, DP.ID_SALE, DP.CODLOJA) COUNT_D
      ) qtd_return
      FROM LOJAS
    ) a
    where a.qtd_realized + a.qtd_return > 0
    order by a.DESCRIPTION`
  },
  extraRoutesAssistants({dateStart, dateEnd}){
    return `
    SELECT A.DESCRIPTION, SUM(A.QTD) QTD, A.CHAVE_PIX, (SUM(A.QTD) * 125) VALOR FROM (
      SELECT B.DESCRIPTION, (COUNT(A.ID_ASSISTANT) - 1) QTD, A.D_DELIVERED, B.CHAVE_PIX
      FROM DELIVERYS A
      INNER JOIN USERS B ON A.ID_ASSISTANT = B.ID
      WHERE D_DELIVERED BETWEEN '${dateStart}' AND '${dateEnd}'
      GROUP BY A.ID_ASSISTANT, A.D_DELIVERED, B.DESCRIPTION, B.CHAVE_PIX
      HAVING (COUNT(A.ID_ASSISTANT) - 1) > 0
    ) A
    GROUP BY A.DESCRIPTION, A.CHAVE_PIX
    ORDER BY A.DESCRIPTION`
  },
  extraRoutesDrivers({dateStart, dateEnd}){
    return `
    SELECT A.DESCRIPTION, SUM(A.QTD) QTD, A.CHAVE_PIX, (SUM(A.QTD) * 125) VALOR FROM (
      SELECT B.DESCRIPTION, (COUNT(A.ID_DRIVER) - 1) QTD, A.D_DELIVERED, B.CHAVE_PIX
      FROM DELIVERYS A
      INNER JOIN USERS B ON A.ID_DRIVER = B.ID
      WHERE D_DELIVERED BETWEEN '${dateStart}' AND '${dateEnd}' AND B.DESCRIPTION NOT IN ('FRETEIRO')
      GROUP BY A.ID_DRIVER, A.D_DELIVERED, B.DESCRIPTION, B.CHAVE_PIX
      HAVING (COUNT(A.ID_DRIVER) - 1) > 0
    ) A
    GROUP BY A.DESCRIPTION, A.CHAVE_PIX
    ORDER BY A.DESCRIPTION`
  },
}