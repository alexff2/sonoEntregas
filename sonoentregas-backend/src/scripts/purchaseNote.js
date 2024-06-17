module.exports = {
  findProducts(id){
    return `
    SELECT NI.ITEM item, P.ALTERNATI originalCode, P.NOME [name], NI.QUANTIDADE quantity, NI.UNITARIO unitaryValue, NI.VTOTAL amount
    FROM NFITENS NI
    INNER JOIN PRODUTOS P ON NI.PRODUTO = P.CODIGO
    WHERE NI.NNF = '${id}'
    ORDER BY NI.ITEM`
  }
}