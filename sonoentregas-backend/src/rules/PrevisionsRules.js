//@ts-check

/**
 * @typedef {Object} ISaleProd
 * @property {number} ID_SALE_ID
 * @property {string} COD_ORIGINAL
 * @property {string} STATUS
 * 
 * @typedef {Object} Product
 * @property {number} ID_SALE_ID
 * @property {string} COD_ORIGINAL
 * 
 * @typedef {Object} Sale
 * @property {number} ID
 * @property {Product[]} product
 */

 const SaleProd = require('../models/SalesProd')

 /*
  TabPrevisionProduct
  - Product must have shipped status
  - Caso produto seja o ultimo da venda, venda deve ser fechada
*/

module.exports = {
  /**
   * @param {Sale[]} sales 
   * @param {string} idSales 
   */
  async checkStatusProduct(sales, idSales){
    /**@type {ISaleProd[]} */
    const saleProds = await SaleProd.findSome(0, `ID_SALE_ID IN (${idSales})`)

    sales.forEach(sale => {
      const currentProductSale = []

      saleProds.forEach(saleProd => {
        if (sale.ID === saleProd.ID_SALE_ID) {
          sale.product.forEach(prod => {
            if (prod.COD_ORIGINAL === saleProd.COD_ORIGINAL) {
              if (saleProd.STATUS !== 'Enviado') {
                throw {
                  status: 400,
                  error: {
                    message: 'Produto com status incorreto!'
                  },
                }
              } else {
                saleProd.STATUS = 'Em previsão'

                currentProductSale.push(prod)
              }
            }
          })
        }
      })

      sale.product = currentProductSale
    })

    return sales
  },
  /**
   * @param {string} idSales
   */
  async checkStatusToClosedSales(idSales){}
}