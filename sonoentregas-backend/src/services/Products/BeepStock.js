const { QueryTypes } = require('sequelize');
const db = require('../../models/tables/ProdLojaSeriesMovimentos');

class AvailableProductsForStores {
  async execute() {
    const sql = `
    SELECT
      pl.productId,
      P.NOME productName,
      COUNT(*) quantity
    FROM PRODLOJAS_SERIES_MOVIMENTOS pl
    INNER JOIN PRODUTOS p ON P.CODIGO = pl.productId
    WHERE pl.outputBeepDate IS NULL
    GROUP BY pl.productId, p.NOME
    ORDER BY p.NOME`

    const results = await db._query(1, sql, QueryTypes.SELECT);
    return results;
  }
}

module.exports = new AvailableProductsForStores();
