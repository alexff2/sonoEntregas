const { QueryTypes } = require('sequelize');
const db = require('../../models/tables/ProdLojaSeriesMovimentos');

class AvailableProductsForStores {
  async execute() {
    const sql = `
    SELECT
      p.CODIGO AS productId,
        p.NOME AS productName,
      (ISNULL(pl.EST_BEEP, 0) - ISNULL(sp.QTD_PEND, 0) - ISNULL(m.QTD_MAINTENANCE, 0) - ISNULL(t.QTD_TRANSFER, 0)) quantity
    FROM PRODUTOS p
    LEFT JOIN (
      SELECT
        productId,
        COUNT(*) EST_BEEP
      FROM PRODLOJAS_SERIES_MOVIMENTOS
      WHERE outputBeepDate IS NULL
      GROUP BY productId
    ) pl
    ON pl.productId = p.CODIGO
    LEFT JOIN (
      SELECT
        COD_ORIGINAL,
        SUM(QUANTIDADE) QTD_PEND
      FROM ${process.env.ENTREGAS_BASE}..SALES_PROD
      WHERE STATUS IN ('Enviado', 'Em laçamento', 'Em Previsão')
      GROUP BY COD_ORIGINAL
    ) sp
    ON sp.COD_ORIGINAL = p.ALTERNATI
    LEFT JOIN (
      SELECT
        COD_ORIGINAL,
        SUM(QUANTIDADE) QTD_MAINTENANCE
      FROM ${process.env.ENTREGAS_BASE}..MAINTENANCE
      WHERE STATUS IN ('No CD', 'Em lançamento', 'Em Previsão')
      GROUP BY COD_ORIGINAL
    ) m ON m.COD_ORIGINAL = p.ALTERNATI
    LEFT JOIN (
      SELECT
        CODPRODUTO,
        SUM(QUANTIDADE) - ISNULL(pl.qtd_beep_transfer, 0) QTD_TRANSFER
      FROM TRANSPRODLOJAI tp
      INNER JOIN TRANSPRODLOJA t
      ON tp.REGISTRO = t.CODIGO
      LEFT JOIN (
        SELECT
          productId,
          COUNT(*) qtd_beep_transfer
        FROM PRODLOJAS_SERIES_MOVIMENTOS
        WHERE outputModule = 'transfer'
        GROUP BY productId
      ) pl
      ON pl.productId = tp.CODPRODUTO
      WHERE t.EMISSAO >= '${process.env.DATE_START}' AND T.LOJAORIGEM = 1
      GROUP BY CODPRODUTO, pl.qtd_beep_transfer
      HAVING (SUM(QUANTIDADE) - ISNULL(pl.qtd_beep_transfer, 0)) > 0
    ) t
    ON t.CODPRODUTO = p.CODIGO
    WHERE (ISNULL(pl.EST_BEEP, 0) - ISNULL(sp.QTD_PEND, 0) - ISNULL(m.QTD_MAINTENANCE, 0) - ISNULL(t.QTD_TRANSFER, 0)) > 0
    ORDER BY p.NOME`
    const results = await db._query(1, sql, QueryTypes.SELECT);
    return results;
  }
}

module.exports = new AvailableProductsForStores();
