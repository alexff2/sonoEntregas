module.exports = {
  deleteByModule(module, document, productId){
    return `
    DELETE KARDEX_PRODUTOS_HISTORICO
    WHERE MODULO = '${module}' AND DOCUMENTO = '${document}'${productId ? ` AND CODPRODUTO = ${productId}` : ''}`
  }
}
