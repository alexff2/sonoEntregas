const Model = require('../databases/MSSQL/Model')

class ViewVendas extends Model {
  constructor(){
    super('VIEW_NVENDA2_FULL', 'CODIGOVENDA, CODCLIENTE, NOME AS NOMECLI, VALORPROD, DESCONTO, TOTALVENDA, EMISSAO, STATUS, ENDERECO, BAIRRO, CIDADE, ESTADO, PONTOREF, OBS, VENDEDOR')
  }
}

module.exports = new ViewVendas()