const Promotions = require('../models/tables/Promotion')
const PromotionsProducts = require('../models/tables/ProductsPromotion')

class PromotionRules {
  async validateDates(dateStart, dateFinish, products) {
    const promotionsOpen = await Promotions.findSome(0, `dateFinish >= '${dateStart}' and dateStart <= '${dateFinish}'`)

    if (promotionsOpen.length === 0) return

    const promotionsProducts = await PromotionsProducts.findAny(0, { in: { idPromotion: promotionsOpen.map(promotionOpen => promotionOpen.id) } })

    promotionsOpen.forEach(promotionOpen => {
      promotionOpen['products'] = promotionsProducts.filter(promotionProduct => promotionProduct.idPromotion === promotionOpen.id)
    })

    promotionsOpen.forEach(promotionOpen => {
      products.forEach(product => {
        const productPromotion = promotionOpen.products.find(productPromotion => productPromotion.idProduct === product.COD_ORIGINAL)

        if (productPromotion) {
          throw { status: 409, error: `O produto ${product.NOME} já está em promoção no período de ${promotionOpen.dateStart} a ${promotionOpen.dateFinish}!`}
        }
      })
    })
  }
}

module.exports = new PromotionRules()