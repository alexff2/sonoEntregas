module.exports = {
  findByIdDateName({originalSaleId, name, dateStart, dateFinish}){
    const returnsSce = `
    SELECT A.CODIGO originalReturnId, A.CODVENDA originalSaleId, A.CODCLIENTE clientId, B.NOME client, A.DATA dtReturn, A.HORA timeIssue
    FROM DEVOLUCAO A
    INNER JOIN CLIENTES B ON A.CODCLIENTE = B.CODIGO
    WHERE A.CODVENDA = '${originalSaleId}'
    OR A.DATA BETWEEN '${dateStart}' AND '${dateFinish}'
    ${name ? `AND B.NOME LIKE '${name}%'` : ''}`

    return returnsSce
  },
  findByClientOrDate({originalSaleId, client, dateStart, dateFinish}) {
    const saleReturn = `
    SELECT A.*, B.D_DELIVERED
    FROM RETURNS_SALES A
    LEFT JOIN DELIVERYS B ON A.deliveryId =B.ID
    WHERE A.originalSaleId = '${originalSaleId}'
    OR B.D_DELIVERED BETWEEN '${dateStart}' AND '${dateFinish}'
    ${client ? `OR A.client LIKE '${client}%'` : ''}`

    return saleReturn
  },
  findProductsSce({id}) {
    const products = `
    SELECT A.CODDEVOLUCAO returnId, A.QUANTIDADE_DEVOLVIDA quantity, B.NOME name, B.ALTERNATI alternativeCode, A.CODVENDA originalSaleId
    FROM ITENS_DEVOLUCAO A
    INNER JOIN PRODUTOS B ON A.CODPRODUTO = B.CODIGO
    WHERE QUANTIDADE_DEVOLVIDA > 0
    AND A.CODDEVOLUCAO IN (${id})`

    return products
  },
  updateStatusSce({originalSaleId, alternativesCodes, status}) {
    const script = `
    UPDATE NVENDI2_STATUS
    SET STATUS = '${status}'
    FROM NVENDI2_STATUS A
    INNER JOIN PRODUTOS B ON A.CODPRODUTO = B.CODIGO
    WHERE A.CODIGOVENDA = ${originalSaleId}
    AND B.ALTERNATI IN (${alternativesCodes})`

    return script
  },
  adjustStockSce({alternativesCodes}) {
    const script = `
    UPDATE PRODLOJAS SET EST_ATUAL = B.ESTOQUE_KARDEX, EST_LOJA = B.ESTOQUE_KARDEX FROM PRODLOJAS A INNER JOIN VIEW_KARDEX_DIF_EST B ON A.CODIGO = B.CODIGO WHERE A.CODLOJA = 1 AND B.DIF <> 0 AND B.ALTERNATI IN (${alternativesCodes})`

    return script
  },
  products(returnsSalesIds) {
    return `
    SELECT A.id, A.returnsSalesId, A.alternativeCode, E.NOME name, a.quantity, COUNT(D.id) quantityBeep FROM RETURNS_SALES_PRODUCTS A
    LEFT JOIN (
      SELECT B.*, C.ALTERNATI FROM SONO..PRODLOJAS_SERIES_MOVIMENTOS B
      INNER JOIN SONO..PRODUTOS C
      ON B.productId = C.CODIGO) D
    ON D.ALTERNATI = A.alternativeCode AND A.returnsSalesId = D.inputModuleId
    INNER JOIN SONO..PRODUTOS E ON E.ALTERNATI = A.alternativeCode
    WHERE A.returnsSalesId IN (${returnsSalesIds})
    GROUP BY A.id, A.returnsSalesId, A.alternativeCode, E.NOME, a.quantity`
  }
}
