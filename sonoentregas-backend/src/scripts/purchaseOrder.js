// cfop 1 = aberto
// cfop 0 = fechado

module.exports = {
  insert({
    id,
    sequence,
    issue,
  }) {
    const script = `
    insert into PEDFOR
      (CODIGOPEDIDO, EMISSAO, CODFOR, CODTRA, COMPRADOR, VALORPED, DESCONTO, TIPOFRETE, VALORFRETE, VALORICMS, VALORIPI, SAIDA, 
      PREVCHEGA, NFCHEGADA, CHEGADA, MARGEMBRUTA, CODALTERNATIVO, OBSERVACAO, CODLOJA, SEQUENCIA, CODPLANO, VALORBRUTO, PERDESCONTO, TIPO_PEDIDO, CFOP, CREATE_AT, FACTORY_DATA)
    values
      (${id}, '${issue}', 1, 1, 0, 0, 0, 'CIF', 0, 0, 0, '${issue}',
      NULL, NULL, NULL, 0, NULL, NULL, 1.0, ${sequence}, 0, 0, 0,'1', 1, '${issue}', NULL)`

    return script
  },
  maxId(){
    const script = 'SELECT MAX( CODIGOPEDIDO ) MAX_ID FROM PEDFOR WITH (NOLOCK)'

    return script
  },
  maxSequence(){
    const script = 'SELECT MAX( SEQUENCIA ) MAX_SEQUENCIA FROM PEDFOR WITH (NOLOCK)'

    return script
  },
  purchaseOrder({code, issue}){
    return `
    SELECT CODIGOPEDIDO id, FORMAT(VALORPED, 'C', 'pt-br') value, COMPRADOR employeeId, CFOP [open],
    CASE WHEN B.NOME IS NULL THEN '' ELSE B.NOME END AS employeeName,
    CASE WHEN FACTORY_DATA IS NULL THEN '' ELSE FACTORY_DATA END AS factoryData,
    CASE WHEN OBSERVACAO IS NULL THEN '' ELSE OBSERVACAO END AS obs,
    CONVERT(VARCHAR, EMISSAO, 103) issue,
    CONVERT(VARCHAR, EMISSAO, 23) issueToInput,
    CONVERT(VARCHAR, CREATE_AT, 103) release,
    CASE WHEN TIPO_PEDIDO = '1' THEN 'normal' ELSE 'bonus' END AS [type1],
    CASE WHEN TIPOFRETE = 'CIF' THEN 'normal' ELSE 'maintenance' END AS [type],
    C.NOME companyName, C.CGC companyCnpj, C.INSC companyIe, OBSERVACAO observation,
    PED_FAB, LOTE, CARGA
    FROM PEDFOR A
    LEFT JOIN FUNCIONARIO B ON A.COMPRADOR = B.CODIGO
    INNER JOIN EMPRESA C ON A.CODLOJA = C.CODIGO
    WHERE CODIGOPEDIDO = '${code}'
    OR EMISSAO = '${issue}'
    OR CFOP = 1
    `
  },
  purchaseOrderProduct(idsPurchase, order){
    return `
    SELECT A.*, B.NOME, B.ALTERNATI
    FROM VIEW_SALDO_PEDIDO_PRODUTO_VALOR A
    INNER JOIN PRODUTOS B ON A.CODPRODUTO = B.CODIGO
    WHERE A.NUMPEDIDO IN (${idsPurchase})
    ORDER BY ${order}`
  },
  updateByField(field, value, id) {
    return `UPDATE PEDFOR SET ${field} = '${value}' WHERE CODIGOPEDIDO = ${id}`
  },
  maxItem(id) {
    return `SELECT MAX( ITEM ) MAX_ITEM FROM PEDFORI WITH (NOLOCK) WHERE NUMPEDIDO=${id}`
  },
  insertProduct({
    id,
    productId,
    productName,
    quantity,
    value,
    item
  }){
    return `
    insert into PEDFORI
      (NUMPEDIDO, CODPRODUTO, DESPRODUTO, MARGEMBRUTA, QUANTIDADE, VLUNITARIO, VLTOTAL,
      PERICMS, PERIPI, NFCHEGADA, DTCHEGADA, ITEM, QTCHEGADA, PERDESCONTO, MU_UNIDADE, MU_ITEM, MU_QTE_MENORUN,
      PERDESCONTO1, PERDESCONTO2, PERDESCONTO3, PERDESCONTO4, PERDESCONTO5, VALOR_UNIT_LIQ, VALOR_TOTAL_LIQ,
      VALOR_TOTAL_DESC, PERDESCONTO6, PERDESCONTO7, PERDESCONTO8, PERDESCONTO9, PERDESCONTO10)
    values
      (${id}, ${productId}, '${productName}', 0.0, ${quantity}, ${value}, ${quantity * value},
      NULL, NULL, NULL, NULL, ${item}, NULL, 0.0, 'UN', -1.0, 1.0,
      0.0, 0.0, 0.0, 0.0, 0.0, ${value}, ${quantity * value},
      0.0, 0.0, 0.0, 0.0, 0.0, 0.0)`
  },
  rmvProduct(id, item){
    return `DELETE PEDFORI WHERE NUMPEDIDO = ${id} AND ITEM = ${item}`
  },
  changeQuantity(id, item, quantity) {
    return `
    UPDATE PEDFORI 
    SET QUANTIDADE = ${quantity}, VLTOTAL = ${quantity} * VLUNITARIO, VALOR_TOTAL_LIQ = ${quantity} * VLUNITARIO
    WHERE NUMPEDIDO = ${id} AND ITEM = ${item}`
  },
  close(id) {
    return `UPDATE PEDFOR SET CFOP = 0 WHERE CODIGOPEDIDO = ${id}`
  },
  open(id) {
    return `UPDATE PEDFOR SET CFOP = 1 WHERE CODIGOPEDIDO = ${id}`
  },
  findPurchaseOrderToReport() {
    return `
    SELECT A.CODIGOPEDIDO, C.NOME NOME_FOR, A.EMISSAO, DATEDIFF(DAY, A.EMISSAO, GETDATE()) DIAS_EMIS, A.VALORBRUTO, D.VALOR_CHEGADA, ROUND(A.VALORBRUTO - D.VALOR_CHEGADA, 2) difValue, A.FACTORY_DATA, A.OBSERVACAO OBS, A.PED_FAB, A.LOTE, A.CARGA
    FROM PEDFOR A
    INNER JOIN CADFOR C ON A.CODFOR = C.CODIGO
    INNER JOIN (
      SELECT NUMPEDIDO, SUM(QTE_CHEGADA * VLUNITARIO) VALOR_CHEGADA 
      FROM VIEW_SALDO_PEDIDO_PRODUTO_VALOR
      GROUP BY NUMPEDIDO) D ON A.CODIGOPEDIDO = D.NUMPEDIDO
    WHERE A.CFOP = 0 AND ROUND(A.VALORBRUTO - D.VALOR_CHEGADA, 2) <> 0
    GROUP BY A.CODIGOPEDIDO, A.EMISSAO, A.VALORBRUTO, A.FACTORY_DATA, A.OBSERVACAO, C.NOME, D.VALOR_CHEGADA, A.PED_FAB, A.LOTE, A.CARGA`
  },
  updateTotalValues(id) {
    return `
    UPDATE PEDFOR SET VALORPED = B.TOTAL, VALORBRUTO = B.TOTAL
    FROM PEDFOR A
    INNER JOIN 
      (SELECT NUMPEDIDO, SUM(VLTOTAL) TOTAL
      FROM PEDFORI
      GROUP BY NUMPEDIDO) B
      ON A.CODIGOPEDIDO = B.NUMPEDIDO
    WHERE A.CODIGOPEDIDO = ${id}`
  },
  setProductValues(id) {
    return `
    UPDATE PEDFORI SET VLUNITARIO = B.PCO_COMPRA, VLTOTAL = A.QUANTIDADE * B.PCO_COMPRA,
    VALOR_UNIT_LIQ = B.PCO_COMPRA, VALOR_TOTAL_LIQ = A.QUANTIDADE * B.PCO_COMPRA
    FROM PEDFORI A
    INNER JOIN PRODLOJAS B ON A.CODPRODUTO = B.CODIGO
    WHERE B.CODLOJA = 1
    AND A.NUMPEDIDO =  ${id}`
  },
  setProductMaintenanceValues(id) {
    return `
    UPDATE PEDFORI SET VLUNITARIO = B.PCO_AREMAR, VLTOTAL = A.QUANTIDADE * B.PCO_AREMAR,
    VALOR_UNIT_LIQ = B.PCO_AREMAR, VALOR_TOTAL_LIQ = A.QUANTIDADE * B.PCO_AREMAR
    FROM PEDFORI A
    INNER JOIN PRODLOJAS B ON A.CODPRODUTO = B.CODIGO
    WHERE B.CODLOJA = 1
    AND A.NUMPEDIDO =  ${id}`
  },
  setValueSingleProduct(id, item, value) {
    return `
    UPDATE PEDFORI SET VLUNITARIO = ${value}, VLTOTAL = QUANTIDADE * ${value},
    VALOR_UNIT_LIQ = ${value}, VALOR_TOTAL_LIQ = QUANTIDADE * ${value}
    WHERE NUMPEDIDO = ${id} AND ITEM = ${item}`
  }
}
