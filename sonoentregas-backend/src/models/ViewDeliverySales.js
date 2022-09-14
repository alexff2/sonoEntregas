const Model = require('../databases/MSSQL/Model')

class ViewDeliverySales extends Model {
  constructor(){
    super('View_Deliv_Sales', '*')
  }
}

module.exports = new ViewDeliverySales()