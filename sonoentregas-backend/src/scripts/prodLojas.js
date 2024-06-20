module.exports = {
  rmvStock(id, quantity){
    return `
    UPDATE PRODLOJAS SET EST_SAIDA=EST_SAIDA+(${quantity}), EST_LOJA=EST_LOJA-(${quantity}), EST_ATUAL=((EST_LOJA-(${quantity})) + EST_DEPOSITO) WHERE CODIGO=${id} AND CODLOJA=1`
  },
  addStock(id, quantity){
    return `
    UPDATE PRODLOJAS SET EST_ENTRADA=EST_ENTRADA+(${quantity}), EST_LOJA=EST_LOJA+(${quantity}), EST_ATUAL=((EST_LOJA+(${quantity})) + EST_DEPOSITO) WHERE CODIGO=${id} AND CODLOJA=1`
  },
}