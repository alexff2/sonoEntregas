//@ts-check
const { compare } = require('bcrypt')
const { sign } = require('jsonwebtoken')
const { jwt } = require('../databases/MSSQL/connections/config')
const Users = require('../models/Users')

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
  async create(req, res){
    try {
      const { userName, password, codLoja } = req.body

      const users = await Users.findAny(0, {
        DESCRIPTION: userName,
        ACTIVE: 1,
        PRE_REG: 1
      })

      if (users.length === 0) {
        return res.status(401).json('Usuário e/ou senha inválido!')
      }

      let sendUser = {}

      users.forEach((/**@type {User} */ user) => {
        if (user.CODLOJA === codLoja || user.OFFICE === 'Dev' || user.OFFICE === 'Master') {
          sendUser = user
        }
      })

      if (Object.keys(sendUser).length === 0) {
        return res.status(401).json('Usuário e/ou senha inválido!')
      }

      const { secret, expiresIn } = jwt
      const token = sign({}, secret, {
        subject: String(sendUser.ID),
        expiresIn
      })

      const passwordMatch =  await compare(password, sendUser.PASSWORD)

      if (!passwordMatch) {
        return res.status(401).json('Usuário e/ou senha inválido!')
      }

      return res.status(201).json({
        user: {
          ID: sendUser.ID, 
          DESCRIPTION: sendUser.DESCRIPTION, 
          OFFICE: sendUser.OFFICE, 
          ACTIVE: sendUser.ACTIVE
        },
        token
      })
    } catch (error) {
      console.log(error)
      return res.status(400).json(error)
    }
  }
}