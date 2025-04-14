module.exports = {
  balanceReport(id) {
    return `
    SELECT * FROM (
      SELECT A.productId, C.NOME product, A.serialNumber, 'FALTA' tipo FROM PRODLOJAS_SERIES_MOVIMENTOS A
      LEFT JOIN (
        SELECT * FROM BALANCE_BY_BEEP_SERIES
        WHERE balanceId = ${id}
      ) B ON A.serialNumber = B.serialNumber
      INNER JOIN PRODUTOS C ON C.CODIGO = A.productId
      WHERE A.outputModule IS NULL AND B.balanceId IS NULL
      UNION
      SELECT A.productIdNotFound, B.NOME product, A.serialNumber, 'SOBRA' tipo FROM BALANCE_BY_BEEP_SERIES A
      INNER JOIN PRODUTOS B
      ON A.productIdNotFound = B.CODIGO
      WHERE A.balanceId = ${id}
    ) A ORDER BY A.TIPO, A.product`
  },
  uniqueProductsWithDivergence(id) {
    return `
    SELECT A.product FROM (
      SELECT A.productId, C.NOME product, A.serialNumber, 'FALTA' tipo FROM PRODLOJAS_SERIES_MOVIMENTOS A
      LEFT JOIN (
        SELECT * FROM BALANCE_BY_BEEP_SERIES
        WHERE balanceId = ${id}
      ) B ON A.serialNumber = B.serialNumber
      INNER JOIN PRODUTOS C ON C.CODIGO = A.productId
      WHERE A.outputModule IS NULL AND B.balanceId IS NULL
      UNION
      SELECT A.productIdNotFound, B.NOME product, A.serialNumber, 'SOBRA' tipo FROM BALANCE_BY_BEEP_SERIES A
      INNER JOIN PRODUTOS B
      ON A.productIdNotFound = B.CODIGO
      WHERE A.balanceId = ${id}
    ) A GROUP BY A.product`
  },
  uniqueProductsQtd() {
    return `SELECT COUNT(*) as qtd FROM PRODUTOS WHERE ATIVO = 'S'`
  }
}