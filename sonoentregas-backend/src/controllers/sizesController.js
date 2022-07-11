const Sizes = require('../models/tables/Sizes')

module.exports = {
  async index(req, res) {
    try {    
      const sizes = await Sizes.findAny(0, { ACTIVE: 1 })

      return res.json(sizes)
    } catch (error) {
      console.log(error)
      return res.status(401).json('Bad request!')
    }
  },
  async find(req, res) {
    try {
      const { find } = req.params
      const sizes = await Sizes.findSome(0, `ACTIVE = 1 AND DESCRIPTION LIKE '%${find}%'`)

      return res.json(sizes)
    } catch (error) {
      console.log(error)
      return res.status(401).json('Bad request!')
    }
  },
  async create(req, res) {
    try {
      const { DESCRIPTION, width, length, height } = req.body

      await Sizes.creatorAny(0, [{
        DESCRIPTION, width, length, height
      }])

      const sizes = await Sizes.findAny(0, { ACTIVE: 1 })

      return res.json(sizes)
    } catch (error) {
      console.log(error)
      return res.status(401).json('Bad request!')
    }
  },
  async inactivate(req, res) {
    try {
      const { ID } = req.body
      
      await Sizes.updateAny(0, { ACTIVE: 0 }, { ID })

      const sizes = await Sizes.findAny(0, { ACTIVE: 1 })

      return res.json(sizes)
    } catch (error) {
      console.log(error)
      return res.status(401).json('Bad request!')
    }
  }
}