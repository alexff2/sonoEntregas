module.exports = {
  findToBeepDelivery(id) {
    return `
      SELECT B.CODIGO id, B.APLICACAO mask, B.NOME [nameFull], A.quantity, ISNULL(C.quantityBeep, 0) quantityBeep, 
      ${id} moduleId, B.SUBG subGroupId, A.quantity - ISNULL(C.quantityBeep, 0) quantityPedding, 'delivery' module
      FROM (
        SELECT ID_DELIVERY, COD_ORIGINAL, SUM(QTD_DELIV) quantity, 'DELIVERY_PROD' TIPO
        FROM ${process.env.ENTREGAS_BASE}..DELIVERYS_PROD
        WHERE ID_DELIVERY = ${id}
        GROUP BY ID_DELIVERY, COD_ORIGINAL
        UNION
        SELECT A.ID_DELIV_MAIN, B.COD_ORIGINAL, SUM(B.QUANTIDADE) quantity, 'MAINTENANCE' TIPO
        FROM ${process.env.ENTREGAS_BASE}..MAINTENANCE_DELIV A
        INNER JOIN ${process.env.ENTREGAS_BASE}..MAINTENANCE B ON A.ID_MAINT = B.ID
        WHERE A.ID_DELIV_MAIN = ${id}
        GROUP BY A.ID_DELIV_MAIN, B.COD_ORIGINAL
      ) A
      INNER JOIN PRODUTOS B ON A.COD_ORIGINAL = B.ALTERNATI
      LEFT JOIN (
        SELECT productId, COUNT(id) quantityBeep
          FROM PRODLOJAS_SERIES_MOVIMENTOS
          WHERE outputModule = 'delivery'
          AND outputModuleId = ${id}
          GROUP BY productId
      ) C ON C.productId = B.CODIGO`
  },
  findToBeepDeliveryReturn(id) {
    return `
      SELECT B.CODIGO id, B.APLICACAO mask, B.NOME [nameFull], A.quantity, ISNULL(C.quantityBeep, 0) quantityBeep, ${id} moduleId, B.SUBG subGroupId, A.quantity - ISNULL(C.quantityBeep, 0) quantityPedding, 'delivery' module
      FROM (
        SELECT ID_DELIVERY, COD_ORIGINAL, SUM(QTD_DELIV) quantity, 'DELIVERY_PROD' TIPO
        FROM ${process.env.ENTREGAS_BASE}..DELIVERYS_PROD
        WHERE ID_DELIVERY = ${id} AND DELIVERED = 1
        GROUP BY ID_DELIVERY, COD_ORIGINAL
        UNION
        SELECT A.ID_DELIV_MAIN, B.COD_ORIGINAL, SUM(B.QUANTIDADE) quantity, 'MAINTENANCE' TIPO
        FROM ${process.env.ENTREGAS_BASE}..MAINTENANCE_DELIV A
        INNER JOIN ${process.env.ENTREGAS_BASE}..MAINTENANCE B ON A.ID_MAINT = B.ID
        WHERE A.ID_DELIV_MAIN = ${id} AND A.DONE = 0
        GROUP BY A.ID_DELIV_MAIN, B.COD_ORIGINAL
      ) A
      INNER JOIN PRODUTOS B ON A.COD_ORIGINAL = B.ALTERNATI
      LEFT JOIN (
        SELECT productId, COUNT(id) quantityBeep
          FROM PRODLOJAS_SERIES_MOVIMENTOS
          WHERE outputModule = 'delivery'
          AND outputModuleId = ${id}
          GROUP BY productId
      ) C ON C.productId = B.CODIGO
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
    SELECT B.ID, B.DESCRIPTION, A.QTD, B.CHAVE_PIX, A.QTD * 70 VALOR
    FROM (
      SELECT ASSISTANT, SUM(QTD) QTD
      FROM (
        SELECT ASSISTANT, COUNT(*) - 1 AS QTD, D_DELIVERING
        FROM (
          SELECT D_DELIVERING, ID_ASSISTANT2 AS ASSISTANT
          FROM DELIVERYS
          WHERE D_DELIVERING BETWEEN '${dateStart}' AND '${dateEnd}' AND ID_ASSISTANT2 IS NOT NULL AND ID_ASSISTANT2 <> 0
          UNION ALL
          SELECT D_DELIVERING, ID_ASSISTANT AS ASSISTANT
          FROM DELIVERYS
          WHERE D_DELIVERING BETWEEN '${dateStart}' AND '${dateEnd}'
        ) A
        GROUP BY D_DELIVERING, ASSISTANT
        HAVING COUNT(*) > 1
      ) A
      GROUP BY ASSISTANT
    ) A
    INNER JOIN USERS B ON B.ID = A.ASSISTANT`
  },
  extraRoutesDrivers({dateStart, dateEnd}){
    return `
    SELECT A.DESCRIPTION, SUM(A.QTD) QTD, A.CHAVE_PIX, (SUM(A.QTD) * 70) VALOR FROM (
      SELECT B.DESCRIPTION, (COUNT(A.ID_DRIVER) - 1) QTD, A.D_DELIVERING, B.CHAVE_PIX
      FROM DELIVERYS A
      INNER JOIN USERS B ON A.ID_DRIVER = B.ID
      WHERE D_DELIVERING BETWEEN '${dateStart}' AND '${dateEnd}' AND B.DESCRIPTION NOT IN ('FRETEIRO')
      GROUP BY A.ID_DRIVER, A.D_DELIVERING, B.DESCRIPTION, B.CHAVE_PIX
      HAVING (COUNT(A.ID_DRIVER) - 1) > 0
    ) A
    GROUP BY A.DESCRIPTION, A.CHAVE_PIX
    ORDER BY A.DESCRIPTION`
  },
  deliveryMonetaryValues(id) {
    return `
      SELECT A.ID_DELIVERY, SUM(A.COST) COST, SUM(A.PRICE) PRICE FROM (
        SELECT C.ID_DELIVERY, SUM(C.QTD_DELIV * B.PCO_COMPRA) COST, SUM(C.QTD_DELIV * D.UNITARIO1) PRICE, 'SALES' typeMovment
        FROM ${process.env.CD_BASE}..PRODUTOS A
        INNER JOIN ${process.env.CD_BASE}..PRODLOJAS B ON A.CODIGO = B.CODIGO
        INNER JOIN DELIVERYS_PROD C ON C.COD_ORIGINAL = A.ALTERNATI
        INNER JOIN SALES_PROD D ON C.ID_SALE = D.ID_SALES AND C.CODLOJA = D.CODLOJA AND C.COD_ORIGINAL = D.COD_ORIGINAL
        WHERE B.CODLOJA = 1
        AND C.ID_DELIVERY = ${id}
        GROUP BY C.ID_DELIVERY
        UNION
        SELECT C.ID_DELIVERY, SUM(C.QUANTIDADE * B.PCO_COMPRA) COST, SUM(C.QUANTIDADE * D.UNITARIO1) PRICE, 'MAINTENANCE' typeMovment
        FROM ${process.env.CD_BASE}..PRODUTOS A
        INNER JOIN ${process.env.CD_BASE}..PRODLOJAS B ON A.CODIGO = B.CODIGO
        INNER JOIN (
          SELECT A.COD_ORIGINAL, A.QUANTIDADE, B.ID_DELIV_MAIN ID_DELIVERY, A.CODLOJA, A.ID_SALE
          FROM MAINTENANCE A
          INNER JOIN MAINTENANCE_DELIV B ON A.ID = B.ID_MAINT
          WHERE B.ID_DELIV_MAIN = ${id}
        ) C ON C.COD_ORIGINAL = A.ALTERNATI
        INNER JOIN SALES_PROD D ON C.ID_SALE = D.ID_SALES AND C.CODLOJA = D.CODLOJA AND C.COD_ORIGINAL = D.COD_ORIGINAL
        WHERE B.CODLOJA = 1
        AND C.ID_DELIVERY = ${id}
        GROUP BY C.ID_DELIVERY	
      ) A GROUP BY A.ID_DELIVERY`
  },
  maintenanceSale(idDelivery) {
    return `
      SELECT B.ID, B.ID_SALES, B.NOMECLI, B.CODLOJA, B.D_ENTREGA1, B.BAIRRO
      FROM MAINTENANCE A
      INNER JOIN SALES B ON A.ID_SALE = B.ID_SALES AND A.CODLOJA = B.CODLOJA
      INNER JOIN MAINTENANCE_DELIV C ON A.ID = C.ID_MAINT
      WHERE C.ID_DELIV_MAIN = ${idDelivery}
      GROUP BY B.ID, B.ID_SALES, B.NOMECLI, B.CODLOJA, B.D_ENTREGA1, B.BAIRRO`
  },
  maintenanceProducts(idDelivery) {
    return `
      SELECT C.ID_DELIV_MAIN ID_DELIVERY, B.ID_SALE_ID, B.ID_SALES, B.CODLOJA, B.COD_ORIGINAL, B.DESCRICAO, B.QUANTIDADE, B.[STATUS], B.UNITARIO1, B.DESCONTO, B.NVTOTAL, B.DOWN_EST,
      B.GIFT, A.QUANTIDADE QTD_DELIV, C.REASON_RETURN, D.NOME, A.ID ID_MAINTENANCE, C.DONE
      FROM MAINTENANCE A
      INNER JOIN SALES_PROD B ON A.CODLOJA = B.CODLOJA AND A.ID_SALE = B.ID_SALES AND A.COD_ORIGINAL = B.COD_ORIGINAL
      INNER JOIN MAINTENANCE_DELIV C ON A.ID = C.ID_MAINT
      INNER JOIN ${process.env.CD_BASE}..PRODUTOS D ON A.COD_ORIGINAL = D.ALTERNATI
      WHERE C.ID_DELIV_MAIN = ${idDelivery}`
  },
  finIdSalesIdReturn(idDelivery) {
    return `
      SELECT B.ID_SALE_ID
      FROM DELIVERYS_PROD A
      INNER JOIN SALES_PROD B ON A.CODLOJA = B.CODLOJA AND A.ID_SALE = B.ID_SALES AND A.COD_ORIGINAL = B.COD_ORIGINAL
      WHERE A.DELIVERED = 1
      AND A.ID_DELIVERY = ${idDelivery}`
  },
  returnsSalesProdForForecasting(idDelivery) {
    return `
    UPDATE SALES_PROD SET STATUS = 'Em Previsão'
    FROM DELIVERYS_PROD A
    INNER JOIN SALES_PROD B ON A.CODLOJA = B.CODLOJA AND A.ID_SALE = B.ID_SALES AND A.COD_ORIGINAL = B.COD_ORIGINAL
    WHERE B.STATUS = 'Em lançamento'
    AND A.ID_DELIVERY = ${idDelivery}`
  },
  setSalesProdDelivering(idDelivery) {
    return `
    UPDATE SALES_PROD SET STATUS = 'Entregando'
    FROM DELIVERYS_PROD A
    INNER JOIN SALES_PROD B ON A.CODLOJA = B.CODLOJA AND A.ID_SALE = B.ID_SALES AND A.COD_ORIGINAL = B.COD_ORIGINAL
    WHERE B.STATUS = 'Em lançamento'
    AND A.ID_DELIVERY = ${idDelivery}`
  },
  setSalesProdDelivered(idDelivery) {
    return `
    UPDATE SALES_PROD SET STATUS = CASE WHEN A.DELIVERED = 0 THEN 'Finalizada' ELSE 'Enviado' END
    FROM DELIVERYS_PROD A
    INNER JOIN SALES_PROD B ON A.CODLOJA = B.CODLOJA AND A.ID_SALE = B.ID_SALES AND A.COD_ORIGINAL = B.COD_ORIGINAL
    WHERE B.STATUS = 'Entregando'
    AND A.ID_DELIVERY = ${idDelivery}`
  },
  setMaintenanceDelivered(idDelivery) {
    return `
    UPDATE MAINTENANCE SET STATUS = CASE WHEN A.DONE = 1 THEN 'Finalizada' ELSE 'No CD' END
    FROM MAINTENANCE_DELIV A
    INNER JOIN MAINTENANCE B ON A.ID_MAINT = B.ID
    WHERE B.STATUS = 'Em deslocamento'
    AND A.ID_DELIV_MAIN = ${idDelivery}`
  },
  decreaseStockOfRouteProducts(idDelivery) {
    return `
    UPDATE ${process.env.CD_BASE}..PRODLOJAS SET
      EST_ATUAL = EST_ATUAL - C.QUANTIDADE,
      EST_LOJA = EST_LOJA - C.QUANTIDADE
    FROM ${process.env.CD_BASE}..PRODLOJAS A
    INNER JOIN ${process.env.CD_BASE}..PRODUTOS B ON A.CODIGO = B.CODIGO
    INNER JOIN (
      SELECT A.COD_ORIGINAL, SUM(A.QUANTIDADE) QUANTIDADE FROM (
        SELECT COD_ORIGINAL, SUM(QTD_DELIV) QUANTIDADE, 'NORMAL' TIPO
        FROM DELIVERYS_PROD
        WHERE ID_DELIVERY = ${idDelivery}
        GROUP BY COD_ORIGINAL
        UNION
        SELECT COD_ORIGINAL, SUM(A.QUANTIDADE) QUANTIDADE, 'ASSISTENCIA' TIPO
        FROM MAINTENANCE A
        INNER JOIN MAINTENANCE_DELIV B ON A.ID = B.ID_MAINT
        WHERE B.ID_DELIV_MAIN = ${idDelivery}
        GROUP BY COD_ORIGINAL
      ) A GROUP BY A.COD_ORIGINAL
    ) C ON C.COD_ORIGINAL = B.ALTERNATI
    WHERE A.CODLOJA = 1`
  },
  increaseStockOfRouteProducts(idDelivery) {
    return `
    UPDATE ${process.env.CD_BASE}..PRODLOJAS SET
      EST_ATUAL = EST_ATUAL + C.QUANTIDADE,
      EST_LOJA = EST_LOJA + C.QUANTIDADE
    FROM ${process.env.CD_BASE}..PRODLOJAS A
    INNER JOIN ${process.env.CD_BASE}..PRODUTOS B ON A.CODIGO = B.CODIGO
    INNER JOIN (
      SELECT A.COD_ORIGINAL, SUM(A.QUANTIDADE) QUANTIDADE FROM (
        SELECT COD_ORIGINAL, SUM(QTD_DELIV) QUANTIDADE, 'NORMAL' TIPO
        FROM DELIVERYS_PROD
        WHERE ID_DELIVERY = ${idDelivery} AND DELIVERED = 1
        GROUP BY COD_ORIGINAL
        UNION
        SELECT COD_ORIGINAL, SUM(A.QUANTIDADE) QUANTIDADE, 'ASSISTENCIA' TIPO
        FROM MAINTENANCE A
        INNER JOIN MAINTENANCE_DELIV B ON A.ID = B.ID_MAINT
        WHERE B.ID_DELIV_MAIN = ${idDelivery} AND B.DONE = 0
        GROUP BY COD_ORIGINAL
      ) A GROUP BY A.COD_ORIGINAL
    ) C ON C.COD_ORIGINAL = B.ALTERNATI
    WHERE A.CODLOJA = 1`
  }
}