const Sizes = require('../models/tables/Sizes')

module.exports = {
  async index(req, res) {
    try {    
      const sizes = await Sizes.findAll(0)

      return res.json(sizes)
    } catch (error) {
      console.log(error)
      return res.status(401).json('Bad request!')
    }
  },
  async find(req, res) {
    try {
      const { find } = req.params
      const sizes = await Sizes.findAll(0, `ACTIVE = 1 AND DESCRIPTION LIKE '%${find}%'`)

      return res.json(sizes)
    } catch (error) {
      console.log(error)
      return res.status(401).json('Bad request!')
    }
  },
  async create(req, res) {
    try {
      const { width, length } = req.body

      await Sizes.creatorAny(0, [{
        width, length
      }])

      const sizes = await Sizes.findAll(0)

      return res.json(sizes)
    } catch (error) {
      console.log(error)
      return res.status(401).json('Bad request!')
    }
  }
}