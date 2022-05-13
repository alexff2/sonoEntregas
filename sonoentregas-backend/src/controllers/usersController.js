//@ts-check
const bcrypt = require('bcrypt')
const Users = require('../models/Users')
const { findUser, findUserDev } = require('../services/UsersService')
const { saltHash } = require('../databases/MSSQL/conections/config')

/**
 * @typedef {Object} User
 * @property {number} ID
 * @property {number} CODLOJA
 * @property {string} DESCRIPTION
 * @property {boolean} ACTIVE
 * @property {string} OFFICE
 * @property {string} PASSWORD
 */

module.exports = {
  /**
   * @param {*} req
   * @param {*} res
   * @returns 
   */
  async index(req, res){
    try {
      const { loja } = req.params
      var users

      loja === 'Dev'
        ? users = await findUserDev()
        : users = await findUser(loja)
        
      return res.json(users)
    } catch (error) {
      const { original } = error
      return res.status(400).json(original)
    }
  },
  /**
   * @param {*} req 
   * @param {*} res 
   * @returns 
   */
  async create(req, res) {
    try {
      const { codloja, description, active, office, password } = req.body

      bcrypt.genSalt(saltHash, (err, salt) => {
        if (err) return res.status(500).json({error: err})
        bcrypt.hash(password, salt, async (errBt, hash)=>{
          if (errBt) return res.status(500).json({error: errBt})
          const values = `${codloja}, '${description}', ${active}, '${office}', '${hash}'`

          return res.json(await Users.creator(0, values))
        })
      })
    } catch (error) {
      const { original } = error
      
      return res.status(400).json(original)
    }
  },
  /**
   * @param {*} req 
   * @param {*} res 
   * @returns 
   */
  async update( req, res ) {
    try {
      const { userId } = req.params
      var { CODLOJA, DESCRIPTION, ACTIVE, PASSWORD } = req.body

      /**@type {User[]} */
      const userDesc = await Users.findAny(0, { DESCRIPTION, CODLOJA })

      if(userDesc[0].ID.toString() === userId || userDesc.length === 0){
        ACTIVE = ACTIVE ? 1 : 0

        const salt = bcrypt.genSaltSync(saltHash)
        PASSWORD = bcrypt.hashSync(PASSWORD, salt)
  
        await Users.updateAny(0,{
            DESCRIPTION,
            ACTIVE,
            PASSWORD
        }, { ID: userId })
  
        const users = await Users.findAny(0, { id: userId })
  
        return res.status(201).json(users[0])
      } else {
        return res.status(401).json(`Já existe um Usuário cadastrado com esse NOME: ${userDesc[0].DESCRIPTION}!`)
      }

    } catch (e) {
      console.log(e)
      return res.status(400).json(e)
    }
  },
  /**
   * @param {*} req 
   * @param {*} res 
   * @returns 
   */
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