const { QueryTypes } = require('sequelize')
const DevMod = require('../models/Cars')

module.exports = {
  async getTable(req, res) {
    const script = `SELECT * FROM EMPRESA`

    const data = [], dataError = []

    for (let i = 0; i <= 4; i++) {
      try {
        const response = await DevMod._query(i, script, QueryTypes.RAW)

        data.push(response)
      } catch (e) {
        console.log(e.original.code)
        dataError.push( e )
      }
    }

    return res.status(200).json({ data, dataError })
  }
}
