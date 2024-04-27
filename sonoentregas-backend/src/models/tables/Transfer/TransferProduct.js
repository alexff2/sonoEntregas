const Model = require('../../../databases/MSSQL/Model')

class TransferProduct extends Model {
  constructor(){
    super(
      'TRANSPRODLOJAI',
      'REGISTRO, CODPRODUTO, QUANTIDADE, ITEM, UNITARIOBRUTO, PERCDESCONTO, UNITARIOLIQUIDO, VALORTOTALLIQUIDO, MU_UNIDADE, MU_ITEM, MU_QTE_MENORUN, ITEM_LOTE'
    )
  }
}

module.exports = new TransferProduct()
