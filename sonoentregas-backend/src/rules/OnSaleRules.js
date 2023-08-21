const OnSale = require('../models/tables/OnSale')
const OnSaleProducts = require('../models/tables/OnSaleProducts')

class OnSaleRules {
  async validateDates(dateStart, dateFinish, products) {
    const onSalesOpen = await OnSale.findSome(0, `dateFinish >= '${dateStart}' and dateStart <= '${dateFinish}'`)

    if (onSalesOpen.length === 0) return

    const onSaleProducts = await OnSaleProducts.findAny(0, { in: { idOnSale: onSalesOpen.map(onSale => onSale.id) } })

    onSalesOpen.forEach(onSale => {
      onSale['products'] = onSaleProducts.filter(onSaleProduct => onSaleProduct.idOnSale === onSale.id)
    })

    onSalesOpen.forEach(onSale => {
      products.forEach(product => {
        const productOnSale = onSale.products.find(productOnSale => productOnSale.COD_ORIGINAL === product.COD_ORIGINAL)

        if (productOnSale) {
          throw { status: 409, error: `O produto ${product.NOME} já está em promoção no período de ${onSale.dateStart} a ${onSale.dateFinish}!`}
        }
      })
    })
  }
}

module.exports = new OnSaleRules()