const Model = require('../databases/MSSQL/Model')

class ViewVendas extends Model {
  constructor(){
    super('VIEW_NVENDA2_FULL', 'CODIGOVENDA, CODCLIENTE, NOME AS NOMECLI, VALORPROD, DESCONTO, TOTALVENDA, EMISSAO, STATUS, ENDERECO, NUMERO, BAIRRO, CIDADE, ESTADO, PONTOREF, OBS, VENDEDOR, FONE, CGC_CPF, INS_RG, FAX, O_V')
  }
}

module.exports = new ViewVendas()