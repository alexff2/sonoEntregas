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
      SELECT B.ID, B.ID_SALES, B.NOMECLI, B.CODLOJA, B.D_ENTREGA1, B.BAIRRO, A.STATUS
      FROM MAINTENANCE A
      INNER JOIN SALES B ON A.ID_SALE = B.ID_SALES AND A.CODLOJA = B.CODLOJA
      INNER JOIN MAINTENANCE_DELIV C ON A.ID = C.ID_MAINT
      WHERE C.ID_DELIV_MAIN = ${idDelivery}
      GROUP BY B.ID, B.ID_SALES, B.NOMECLI, B.CODLOJA, B.D_ENTREGA1, B.BAIRRO, A.STATUS`
  },
  maintenanceProducts(idDelivery) {
    return `
      SELECT C.ID_DELIV_MAIN ID_DELIVERY, B.ID_SALE_ID, B.ID_SALES, B.CODLOJA, B.COD_ORIGINAL, B.DESCRICAO, B.QUANTIDADE, B.[STATUS], B.UNITARIO1, B.DESCONTO, B.NVTOTAL, B.DOWN_EST,
      B.GIFT, A.QUANTIDADE QTD_DELIV, C.REASON_RETURN, D.NOME, A.ID ID_MAINTENANCE
      FROM MAINTENANCE A
      INNER JOIN SALES_PROD B ON A.CODLOJA = B.CODLOJA AND A.ID_SALE = B.ID_SALES AND A.COD_ORIGINAL = B.COD_ORIGINAL
      INNER JOIN MAINTENANCE_DELIV C ON A.ID = C.ID_MAINT
      INNER JOIN ${process.env.CD_BASE}..PRODUTOS D ON A.COD_ORIGINAL = D.ALTERNATI
      WHERE C.ID_DELIV_MAIN = ${idDelivery}`
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
    UPDATE SALES_PROD SET STATUS = 'Entregue'
    FROM DELIVERYS_PROD A
    INNER JOIN SALES_PROD B ON A.CODLOJA = B.CODLOJA AND A.ID_SALE = B.ID_SALES AND A.COD_ORIGINAL = B.COD_ORIGINAL
    WHERE B.STATUS = 'Entregando'
    AND A.ID_DELIVERY = ${idDelivery}`
  },
  updateStockProdLojasByDeliveryProd(idDelivery) {
    return `
    UPDATE ${process.env.CD_BASE}..PRODLOJAS SET
      EST_ATUAL = EST_ATUAL - C.QUANTIDADE,
      EST_LOJA = EST_LOJA - C.QUANTIDADE
    FROM ${process.env.CD_BASE}..PRODLOJAS A
    INNER JOIN ${process.env.CD_BASE}..PRODUTOS B ON A.CODIGO = B.CODIGO
    INNER JOIN (
      SELECT COD_ORIGINAL, SUM(QTD_DELIV) QUANTIDADE
      FROM DELIVERYS_PROD
      WHERE ID_DELIVERY = ${idDelivery}
      GROUP BY COD_ORIGINAL
    ) C ON C.COD_ORIGINAL = B.ALTERNATI
    WHERE A.CODLOJA = 1`
  }
}