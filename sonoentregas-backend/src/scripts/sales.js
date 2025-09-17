
module.exports = {
  salesProductsByIdSaleId: (idSalesId, finish) => {
    return `SELECT A.*, B.NOME, ISNULL(C.QTD_DELIV, 0) QTD_MOUNTING
    FROM SALES_PROD A
    INNER JOIN ${process.env.CD_BASE}..PRODUTOS B ON A.COD_ORIGINAL = B.ALTERNATI
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
  },
  salesBySellerAndPaymentType: ({ month, year }) => {
    return `SELECT N.CODVENDEDOR sellerId, P.NOME type, SUM(O.VALOR) amount
      FROM NVENDA2 N with(nolock), ORCPARC O with(nolock), PAGTO P with(nolock)
      WHERE  (N.CODIGOVENDA  = O.TITULO)
      AND  (O.FORMPAGTO = P.CODIGO)
      AND N.O_V='2'
      AND P.PARTICIPA_DRE = 'S'
      AND SUBSTRING(CONVERT(CHAR(8),N.EMISSAO,112),1,6) = '${year}${month}'
      GROUP BY P.NOME, N.CODVENDEDOR
      ORDER BY N.CODVENDEDOR, P.NOME`
  },
  findVendor: (sellersIds) => {
    return `SELECT CODIGO id, NOME seller FROM FUNCIONARIO
    WHERE CODIGO IN (${sellersIds})`
  },
  returnSales: ({ month, year }) => {
    return `SELECT C.CODVENDEDOR sellerId, SUM(C.NVTOTAL) value
      FROM ITENS_DEVOLUCAO A
      INNER JOIN DEVOLUCAO B ON A.CODDEVOLUCAO = B.CODIGO
      INNER JOIN NVENDI2 C ON C.NUMVENDA = A.CODVENDA AND C.CODPRODUTO = A.CODPRODUTO
      WHERE A.QUANTIDADE_DEVOLVIDA > 0
      AND SUBSTRING(CONVERT(CHAR(8),B.DATA,112),1,6) = '${year}${month}'
      GROUP BY C.CODVENDEDOR`
  }
}
