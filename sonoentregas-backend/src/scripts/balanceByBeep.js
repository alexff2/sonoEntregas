module.exports = {
  balanceExcess(id) {
    return `
      SELECT A.productIdNotFound, B.NOME product, A.serialNumber
      FROM BALANCE_BY_BEEP_SERIES A
      INNER JOIN PRODUTOS B
      ON A.productIdNotFound = B.CODIGO
      WHERE A.balanceId = ${id}
      ORDER BY B.NOME`
  },
  balanceLack(id) {
    return `
    SELECT A.productId, C.NOME product, A.serialNumber
    FROM PRODUCTS_MIRROR A
    LEFT JOIN (
      SELECT * FROM BALANCE_BY_BEEP_SERIES
      WHERE balanceId = ${id}
    ) B ON A.serialNumber = B.serialNumber
    INNER JOIN PRODUTOS C ON C.CODIGO = A.productId
    WHERE B.balanceId IS NULL AND A.balanceId = ${id}
    ORDER BY C.NOME`
  },
  uniqueProductsWithDivergence(id) {
    return `
    SELECT A.product, A.tipo FROM (
      SELECT A.productId, C.NOME product, A.serialNumber, 'FALTA' tipo FROM PRODUCTS_MIRROR A
      LEFT JOIN (
        SELECT * FROM BALANCE_BY_BEEP_SERIES
        WHERE balanceId = ${id}
      ) B ON A.serialNumber = B.serialNumber
      INNER JOIN PRODUTOS C ON C.CODIGO = A.productId
      WHERE B.balanceId IS NULL AND A.balanceId = ${id}
      UNION
      SELECT A.productIdNotFound, B.NOME product, A.serialNumber, 'SOBRA' tipo FROM BALANCE_BY_BEEP_SERIES A
      INNER JOIN PRODUTOS B
      ON A.productIdNotFound = B.CODIGO
      WHERE A.balanceId = ${id}
    ) A GROUP BY A.product, A.tipo`
  },
  quantityActiveProducts() {
    return `SELECT COUNT(*) as qtd FROM PRODUTOS WHERE ATIVO = 'S'`
  },
  createMirrorAvailableProducts(id) {
    return `
    INSERT PRODUCTS_MIRROR
    SELECT ${id}, id, productId, serialNumber
    FROM PRODLOJAS_SERIES_MOVIMENTOS
    WHERE outputModule IS NULL
`
  },
  find(where){
    console.log(where)
    return `SELECT * FROM BALANCE_BY_BEEP
    ${where.id ? 'WHERE id = ' + where.id : ''} ${where.dtBalance ? 'WHERE dtBalance >= ' + where.dtBalance : ''}`
  }
}
