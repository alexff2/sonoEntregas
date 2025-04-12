const Model = require("../../../databases/MSSQL/Model");

class BalanceByBeepSerie extends Model {
  constructor() {
    super("BALANCE_BY_BEEP_SERIES", "idBalance,	serialNumber, productIdNotFound")
  } 
}

module.exports = new BalanceByBeepSerie()
