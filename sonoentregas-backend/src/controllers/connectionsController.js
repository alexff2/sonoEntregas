const connections = require('../databases/MSSQL/connections')

module.exports = {
  async findConnections(req, res) {
    return res.send(connections)
  }
}