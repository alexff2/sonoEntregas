//@ts-check
const bcrypt = require('bcrypt')
const { QueryTypes } = require('sequelize')

const Users = require('../models/Users')
const { saltHash } = require('../databases/MSSQL/connections/config')

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
  /** @param {number} codloja*/
  async findUser(codloja){
    /** @type {User[]} */
    const users = await Users._query(0, `SELECT ID, DESCRIPTION, OFFICE, ACTIVE, CODLOJA FROM USERS WHERE CODLOJA = ${codloja} OR (OFFICE = 'Dev' OR OFFICE = 'Master')`, QueryTypes.SELECT)

    return users
  },
  async findUserDev(){
    /** @type {User[]} */
    const users = await Users.findAny(0, {}, 'ID, DESCRIPTION, OFFICE, ACTIVE, CODLOJA')
    return users
  },
  async transformPasswordUser(){
    try {
      /** @type {User[]} */
      const users = await Users.findSome(0,'CODLOJA = 0 AND ID = 1', 'ID, PASSWORD')

      users.forEach(async user => {
        let salt = bcrypt.genSaltSync(saltHash)
        user.PASSWORD = bcrypt.hashSync(user.PASSWORD, salt)
        await Users.updateAny(0, { PASSWORD: user.PASSWORD}, { ID: user.ID})
      })

      return {users}
    } catch (error) {
      console.log(error)
      return {error}
    }
  }
}