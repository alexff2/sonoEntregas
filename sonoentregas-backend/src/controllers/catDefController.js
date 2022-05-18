const CatDef = require('../models/views/ViewCatDefect')

module.exports = {
  async index(req, res) {
    try {
      return res.json(await CatDef.findAll(0))
    } catch (error) {
     console.log(error) 
    }
  }
}