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
  findProducts({id}) {
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
    UPDATE NVENDI2
    SET STATUS = '${status}'
    FROM NVENDI2 A
    INNER JOIN PRODUTOS B ON A.CODPRODUTO = B.CODIGO
    WHERE A.NUMVENDA = ${originalSaleId}
    AND B.ALTERNATI IN (${alternativesCodes})`

    return script
  },
  adjustStockSce({alternativesCodes}) {
    const script = `
    UPDATE PRODLOJAS SET EST_ATUAL = B.ESTOQUE_KARDEX, EST_LOJA = B.ESTOQUE_KARDEX FROM PRODLOJAS A INNER JOIN VIEW_KARDEX_DIF_EST B ON A.CODIGO = B.CODIGO WHERE A.CODLOJA = 1 AND B.DIF <> 0 AND B.ALTERNATI IN (${alternativesCodes})`

    return script
  }
}
