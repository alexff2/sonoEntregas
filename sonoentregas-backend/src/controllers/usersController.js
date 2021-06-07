const Users = require('../models/Users')

module.exports = {
  async index(req, res){
    try {
      const { loja } = req.params
      
      const users = await Users.findSome(0, `CODLOJA = ${loja}`)
  
      return res.json(users)
    } catch (error) {
      return res.status(400).json(original)
    }
  },
  async create(req, res) {
    try {
      const { codloja, description, active, office, password } = req.body
      
      const values = `${codloja}, '${description}', ${active}, '${office}', '${password}'`
      
      return res.json(await Users.creator(0, values))
    } catch (error) {
      const { original } = error
      
      return res.status(400).json(original)
    }
  },
  async update( req, res ) {
    try {
      const { userId } = req.params
      const { codloja, description, active, office, password } = req.body
      
      const values = `CODLOJA = ${codloja}, DESCRIPTION = '${description}', ACTIVE = ${active}, OFFICE = '${office}', PASSWORD = '${password}'`
      
      return res.json(await Users.update(0, values, userId))
    } catch (e) {
      const { original } = e
      return res.status(400).json(original)
    }
  },
  async delete( req, res ) {
    try {
      const { userId } = req.params
      return res.json(await Users.delete(0,userId))
    } catch (e) {
      const { original } = e
      return res.status(400).json(original)
    }
  }
}