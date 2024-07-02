module.exports = {
  findProducts(ids){
    return `
    SELECT A.ITEM item, A.QUANTIDADE quantity, B.NOME name, B.CODIGO id, B.ALTERNATI generalCode, A.REGISTRO transferId, A.UNITARIOBRUTO purchasePrice
    FROM TRANSPRODLOJAI A
    INNER JOIN PRODUTOS B ON A.CODPRODUTO = B.CODIGO
    WHERE A.REGISTRO IN (${ids}) ORDER BY A.ITEM`
  },
  findSerialNumbers(ids){
    return `
    SELECT * FROM PRODLOJAS_SERIES_MOVIMENTOS WHERE inputModule = 'transfer' AND inputModuleId IN (${ids})`
  },
  maxCodes(){
    return 'SELECT MAX(CODIGO) maxId, MAX(SEQUENCIA) maxSequence FROM TRANSPRODLOJA'
  },
  insertMaxSeq(sequence){
    return `INSERT SEQ_TRANSPRODLOJA VALUES (${sequence}, 1)`
  },
  moveStock(type, id, productsId) {
    const script = type === 'E' 
    ?`
    UPDATE PRODLOJAS
    SET EST_ENTRA=EST_ENTRA+(TI.QUANTIDADE), EST_LOJA=EST_LOJA+(TI.QUANTIDADE), EST_ATUAL=((EST_LOJA+(TI.QUANTIDADE)) + EST_DEPOSITO) 
    FROM PRODLOJAS PL
    INNER JOIN TRANSPRODLOJAI TI ON PL.CODIGO = TI.CODPRODUTO
    WHERE PL.CODLOJA=1 AND TI.REGISTRO = ${id} AND PL.CODIGO IN (${productsId})`
    :`
    UPDATE PRODLOJAS
    SET EST_SAIDA=EST_SAIDA+(TI.QUANTIDADE), EST_LOJA=EST_LOJA-(TI.QUANTIDADE), EST_ATUAL=((EST_LOJA-(TI.QUANTIDADE)) + EST_DEPOSITO) 
    FROM PRODLOJAS PL
    INNER JOIN TRANSPRODLOJAI TI ON PL.CODIGO = TI.CODPRODUTO
    WHERE PL.CODLOJA=1 AND TI.REGISTRO = ${id} AND PL.CODIGO IN (${productsId})`

    return script
  }
}