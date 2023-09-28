const Promotion = require('../models/tables/Promotion')
const PromotionProducts = require('../models/tables/ProductsPromotion')
const ViewProducts = require('../models/ViewProdutos')

const ClassDate = require('../class/Date')

class PromotionService {
  async findPromotions(idPromotions) {
    const promotions = await Promotion.findAny(0, { in: { id: idPromotions }})

    const promotionProducts = await PromotionProducts.findAny(0, { idPromotions })

    promotions.forEach(promotion => {
      promotion['products'] = promotionProducts
    })

    return promotions
  }

  async promotionsOpen() {
    const DateNow = new ClassDate().getISODateTimeBr()

    const promotions = await Promotion.findSome(0, `dateFinish >= '${DateNow.date}'`)

    if (promotions.length === 0) return []

    const promotionProducts = await PromotionProducts.findSome(0, `idPromotion IN (${promotions.map(promotion => promotion.id)})`)

    const products = await ViewProducts.findAny(1, { in: { COD_ORIGINAL: promotionProducts.map(promotionProduct => promotionProduct.idProduct) } } )

    promotionProducts.forEach(promotionProduct => {
      const product = products.find(product => product.COD_ORIGINAL === promotionProduct.idProduct)

      promotionProduct['NOME'] = product.NOME
    })

    promotions.forEach(promotion => {
      promotion['dateStart'] = new ClassDate(promotion.dateStart, true).getBRDateTime().date
      promotion['dateFinish'] = new ClassDate(promotion.dateFinish, true).getBRDateTime().date

      promotion['products'] = promotionProducts.filter(promotionProduct => promotionProduct.idPromotion === promotion.id)
    })

    return promotions
  }

  async create({ description, dateStart, dateFinish, products, idUser }) {
    const promotion = await Promotion.create(0, [{ description, dateStart, dateFinish, idUserCreate: idUser, idUserUpdate: idUser }])

    const promotionProducts = products.map(product => {
      return {
        idPromotion: promotion.id,
        idProduct: product.COD_ORIGINAL,
        pricePromotion: product.pricePromotion
      }
    })

    await PromotionProducts.create(0, promotionProducts, false)

    const productsView = await ViewProducts.findAny(1, { 
      in: { COD_ORIGINAL: promotionProducts.map(promotionProduct => promotionProduct.idProduct) } 
    })

    promotionProducts.forEach(promotionProduct => {
      const product = productsView.find(product => product.COD_ORIGINAL === promotionProduct.idProduct)

      promotionProduct['NOME'] = product.NOME
    })

    promotion['products'] = promotionProducts
  
    promotion['dateStart'] = new ClassDate(promotion.dateStart, true).getBRDateTime().date
    promotion['dateFinish'] = new ClassDate(promotion.dateFinish, true).getBRDateTime().date

    promotion['products'] = promotionProducts.filter(promotionProduct => promotionProduct.idPromotion === promotion.id)

    return promotion
  }
}

module.exports = new PromotionService()