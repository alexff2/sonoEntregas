const Model = require('../../../databases/MSSQL/Model')

class Transfer extends Model {
  constructor(){
    super(
      'TRANSPRODLOJA',
      'CODIGO, CODLOJA, LOJAORIGEM, LOJADESTINO, EMISSAO, HORA, MOTIVO, USUARIO, OBSERVA, TIPODC, SEQUENCIA, EMITIUNF, NOME_LOJADESTINO, NNF_TRANSFERENCIA, D_LAN'
    )
  }
}

module.exports = new Transfer()
