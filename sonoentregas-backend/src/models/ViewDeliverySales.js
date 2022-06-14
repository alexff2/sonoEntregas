const Model = require('../databases/MSSQL/Model')

class ViewDeliverySales extends Model {
  constructor(){
    super('View_Deliv_Sales', 'ID_DELIVERY, ID_SALES, CODLOJA, ID_CLIENT, NOMECLI, TOTAL_PROD, DESCONTO, TOTAL, EMISSAO, STATUS, ENDERECO, BAIRRO, CIDADE, ESTADO, PONTOREF, OBS, VENDEDOR')
  }
}

module.exports = new ViewDeliverySales()