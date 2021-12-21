const Users = require('../models/Users')
const bcrypt = require('bcrypt')

module.exports = {
  async login(req, res) {
    try {
      const { user, password, codloja } = req.body

      const where = `DESCRIPTION = '${user}' AND CODLOJA = ${codloja}`
  
      const data = await Users.findSome(0, where)

      const match = await bcrypt.compare(password, data[0].password)

      if (match) return res.status(409).json({ auth: true })
      else return  res.status(201).json({ auth: false })
    } catch (error) {
      return res.status(400).json(error)
    }
  },
  async ajusteSenha(req, res){}
}