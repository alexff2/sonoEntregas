const Model = require('../databases/MSSQL/Model')

class Sales extends Model {
  constructor(){
    super('SALES', 'ID, ID_SALES, CODLOJA, ID_CLIENT, NOMECLI, TOTAL_PROD, DESCONTO, TOTAL, EMISSAO, STATUS, ENDERECO, NUMERO, BAIRRO, CIDADE, ESTADO, PONTOREF, OBS, USER_ID, D_ENTREGA1, D_ENVIO, VENDEDOR, FONE, CGC_CPF, INS_RG, FAX, O_V, OBS2, HAVE_OBS2, SCHEDULED, OBS_SCHEDULED, isWithdrawal, whoWithdrew')
  }
}

module.exports = new Sales()