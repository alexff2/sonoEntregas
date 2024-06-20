//@ts-check
/**
 * @typedef {Object} IShops
 * @property {number} CODIGO
 * @property {string} NOME
 * @property {string} ENDERECO
 * @property {string} CIDADE
 * @property {string} ESTADO
 * @property {string} FONE
 */

const ShopsSceModel = require('../models/ShopsSce')

class ShopsSce {
  async find(connection) {
    /**@type {IShops[]} */
    const shops = await ShopsSceModel.findAll(1, '*', connection)

    const shopsMap = shops.map(shop => {
      return {
        code: shop.CODIGO,
        name: shop.NOME,
        address: `${shop.ENDERECO}, ${shop.CIDADE} - ${shop.ESTADO}`,
        fone: shop.FONE
      }
    })

    return shopsMap
  }

  async findByShop(shopId) {
    /**@type {IShops[]} */
    const shops = await ShopsSceModel.findAny(shopId, {CODIGO: 1})

    const shopsMap = shops.map(shop => {
      return {
        code: shop.CODIGO,
        name: shop.NOME,
        address: `${shop.ENDERECO}, ${shop.CIDADE} - ${shop.ESTADO}`,
        fone: shop.FONE
      }
    })

    return shopsMap[0]
  }
}

module.exports = new ShopsSce()
