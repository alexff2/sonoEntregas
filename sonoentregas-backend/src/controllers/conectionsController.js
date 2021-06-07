const conections = require('../databases/MSSQL/conections')

module.exports = {
  async findConections(req, res) {
    return res.send(conections)
  }
}