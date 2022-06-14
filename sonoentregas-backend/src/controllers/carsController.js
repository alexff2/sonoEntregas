const Cars = require('../models/Cars')

module.exports = {
  async index(req, res) {
    try {
      const cars = await Cars.findAll(0)
      return res.json(cars)
    } catch (e) {
      return res.status(400).json(e)
    }
  },

  async create(req, res){
    try {
      const { description, plate, model } = req.body
      
      const values = `'${description}', '${plate}', '${model}'`
      
      const car = await Cars.creator(0, values)
      
      return res.json(car)
    } catch (e) {
      return res.status(400).json(e)
    }
  },

  async update(req, res){
    try {
      const { id } = req.params
      const { description, plate, model } = req.body

      const values = `DESCRIPTION = '${description}', PLATE = '${plate}', MODEL = '${model}'`

      const car = await Cars.update(0, values, id)

      return res.json(car)
    } catch (e) {
      return res.status(400).json(e)
    }
  },
  
  async delete(req, res){
    try {
      const { id } = req.params
      
      return res.json(Cars.delete(0, id))
    } catch (e) {
      return res.status(400).json(e)
    }
  },
}