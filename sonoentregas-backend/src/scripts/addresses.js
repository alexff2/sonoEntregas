module.exports = {
  findAddressSce(clienteId){
    const script = `
    SELECT CODIGO clientId, NOME client, ENDERECO street, NUMERO_END houseNumber, BAIRRO district, CIDADE city, ESTADO state, FONE phone
    FROM CLIENTES
    WHERE CODIGO = '${clienteId}'` 

    return script
  },
  findAddressDelivery(originalSaleId, shopId){
    const script = `
    SELECT NOMECLI client, ENDERECO street, NUMERO houseNumber, BAIRRO district, CIDADE city, ESTADO state, FONE phone
    FROM SALES
    WHERE ID_SALES = '${originalSaleId}' AND CODLOJA = '${shopId}'`

    return script
  }
}