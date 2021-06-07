const Users = require('../models/Users')

module.exports = {
  async login(req, res) {
    try {
      const { user, password, codloja } = req.body

      const where = `DESCRIPTION = '${user}' AND PASSWORD = '${password}' AND CODLOJA = ${codloja}`
  
      const data = await Users.findSome(0, where)
  
      return res.json(data[0])
    } catch (error) {
      return res.status(400).json(error)
    }
  }
}