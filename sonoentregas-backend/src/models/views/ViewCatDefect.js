const Model = require('../../databases/MSSQL/Model')

class ViewCatDefect extends Model {
  constructor(){
    super('CAT_DEFECT_MAIN', 'ID, DESCRIPTION')
  }
}

module.exports = new ViewCatDefect() 