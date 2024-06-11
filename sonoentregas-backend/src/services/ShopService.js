//@ts-check
/**
 * @typedef {Object} IShops
 * @property {number} CODLOJA
 * @property {string} DESCRICAO
 * @property {string} DESC_ABREV
 * @property {string} FULL_NAME
 */

const ShopsModel = require('../models/tables/Shops')

class Shops {
  async find() {
    /**@type {IShops[]} */
    const shops = await ShopsModel.findAll(0)

    return shops
  }

  /**
   * @param {any} id
   */
  async findById(id) {
    /**@type {IShops[]} */
    const shops = await ShopsModel.findAny(0, { CODLOJA: id })

    return shops
  }
}

module.exports = new Shops()
