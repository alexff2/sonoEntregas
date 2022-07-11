const Model = require('../../databases/MSSQL/Model')

class ConfigBeds extends Model {
  constructor(){
    super('CONFIG_BED', 'ID, NAME, DESCRIPTION, ACTIVE')
  }
}

module.exports = new ConfigBeds()