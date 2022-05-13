//@ts-check
const Users = require('../models/Users')
const bcrypt = require('bcrypt')
const { transformPasswordUser } = require('../services/UsersService')

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
   * 
   * @param {*} req 
   * @param {*} res 
   * @returns 
   */
  async login(req, res){
    try {
      const { user, password, codloja } = req.body

      const users = await Users.findSome(0, `DESCRIPTION = '${user}' AND ACTIVE = 1`)

      if (users.length > 0) {
        users.forEach((/**@type {User} */ user) => {
          const sendUser = { ID: user.ID, DESCRIPTION: user.DESCRIPTION, OFFICE: user.OFFICE, ACTIVE: user.ACTIVE}

          if (user.CODLOJA === codloja)
            bcrypt.compareSync(password, user.PASSWORD)
              ? res.status(201).json(sendUser)
              : res.status(401).json('Senha inválida!')
          else if(user.CODLOJA === 0){
            bcrypt.compareSync(password, user.PASSWORD)
              ? res.status(201).json(sendUser)
              : res.status(401).json('Senha inválida!')
          }
        })
      } else res.status(204).json('')
    } catch (error) {
      return res.status(400).json(error)
    }
  },
  /** Rodar apenas uma vez
   * 
   * @param {*} req 
   * @param {*} res 
   * @returns 
   */
  async transformPasswordUser(req, res){
    const acitive = false
    if (acitive){
      const { error, users } = await transformPasswordUser()
      error
        ? res.status(401).json(error)
        : res.status(201).json(users)
    } else {
      return res.json('Modulo desativado')
    }
  }
}