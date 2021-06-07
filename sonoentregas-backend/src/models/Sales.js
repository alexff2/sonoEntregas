const Model = require('../databases/MSSQL/Model')

class Sales extends Model {
  constructor(){
    super('SALES', 'ID, ID_SALES, CODLOJA, ID_CLIENT, NOMECLI, TOTAL_PROD, DESCONTO, TOTAL, EMISSAO, STATUS, ENDERECO, BAIRRO, CIDADE, ESTADO, PONTOREF, OBS, USER_ID, D_ENTREGA1, D_ENVIO, VENDEDOR')
  }
}

module.exports = new Sales()