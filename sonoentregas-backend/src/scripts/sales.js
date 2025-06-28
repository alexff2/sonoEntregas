
module.exports = {
  salesProductsByIdSaleId: (idSalesId, finish) => {
    return `SELECT A.*, B.NOME, ISNULL(C.QTD_DELIV, 0) QTD_MOUNTING
    FROM SALES_PROD A
    INNER JOIN SONO..PRODUTOS B ON A.COD_ORIGINAL = B.ALTERNATI
    LEFT JOIN (
      SELECT ID_SALE, CODLOJA, COD_ORIGINAL, SUM(QTD_DELIV) QTD_DELIV
      FROM DELIVERYS_PROD
      WHERE DELIVERED = 0
      GROUP BY ID_SALE, CODLOJA, COD_ORIGINAL
    ) C ON C.COD_ORIGINAL = A.COD_ORIGINAL AND C.ID_SALE = A.ID_SALES AND C.CODLOJA = A.CODLOJA
    WHERE A.ID_SALE_ID IN (${idSalesId})${finish ? " AND A.STATUS = 'Finalizada'" : ""}`
  },
  salesByName: ({shopId, client, status}) => {
    return `SELECT * FROM SALES
    WHERE CODLOJA = '${shopId}'
    AND NOMECLI LIKE '${client}%'
    AND STATUS = '${status}'`
  }
}
