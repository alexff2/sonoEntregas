//@ts-check
/**
 * @typedef {Object} IShops
 * @property {number} CODIGO
 * @property {string} NOME
 */

const ShopsSceModel = require('../models/ShopsSce')

class ShopsSce {
  async find() {
    /**@type {IShops[]} */
    const shops = await ShopsSceModel.findAll(1)

    const shopsMap = shops.map(shop => {
      return {
        code: shop.CODIGO,
        name: shop.NOME
      }
    })

    return shopsMap
  }
}

module.exports = new ShopsSce()
