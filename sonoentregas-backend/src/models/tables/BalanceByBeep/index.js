const Model = require("../../../databases/MSSQL/Model");

class BalanceByBeep extends Model {
  constructor() {
    super("BALANCE_BY_BEEP", "id,	userId,	dtBalance,	description,	userFinishId,	dtFinish")
  }
}

module.exports = new BalanceByBeep();
