const ModelProdLojaSeriesMovimentos = require('../models/tables/ProdLojaSeriesMovimentos')
const ModelProdLojas = require('../models/Produtos')
const ModelProdutos = require('../models/ProdutosSce')
const ModelSales = require('../models/Sales')
const ModelSalesProd = require('../models/SalesProd')
const ModelAssistance = require('../models/tables/Maintenance')
const ModelDeliveryProd = require('../models/DeliveryProd')

const scriptProductDetails = require('../scripts/productDetails')
const { QueryTypes } = require('sequelize')

class ProductDetailsService {
  async getProductDetails(productId) {
    const product = await ModelProdutos.findAny(1, {CODIGO: productId})

    const stock = await this.getStock(productId)
    const pendingSales = await this.getPendingSales(product[0].ALTERNATI)
    const pendingAssistance = await this.getPendingAssistance(product[0].ALTERNATI)
    const pendingPurchases = await this.getPendingPurchases(productId)
    const pendingTransfers = await this.getPendingTransfers(productId)
    const openForecasts = await this.getOpenForecasts(product[0].ALTERNATI)
    const openRoutes = await this.getOpenRoutes(product[0].ALTERNATI)

    const qtdForecasts = openForecasts.reduce((acc, curr) => acc + curr.quantity, 0)
    const qtdTransfers = pendingTransfers.reduce((acc, curr) => acc + curr.quantity, 0)
    const qtdSales = pendingSales.reduce((acc, curr) => acc + curr.quantity, 0)
    const qtdAssistance = pendingAssistance.reduce((acc, curr) => acc + curr.quantity, 0)
    const qtdPurchases = pendingPurchases.reduce((acc, curr) => acc + curr.quantity, 0)
    const qtdRoutes = openRoutes.reduce((acc, curr) => acc + curr.quantity, 0)

    return {
      serialNumber: stock.serialNumber,
      pendingSales,
      pendingAssistance,
      pendingPurchases,
      pendingTransfers,
      openForecasts,
      openRoutes,
      quantity: {
        total: stock.total,
        qtdSales,
        qtdAssistance,
        qtdPurchases,
        qtdTransfers,
        qtdForecasts,
        qtdRoutes,
        qtdAvailableToCD: stock.total - (qtdTransfers + qtdForecasts),
        futureQtdAvailableToCD: stock.total - (qtdTransfers + qtdForecasts) + qtdPurchases,
        qtdAvailableToStore: stock.total - (qtdTransfers + qtdSales + qtdAssistance),
        futureQtdAvailableToStore: stock.total - (qtdTransfers + qtdSales + qtdAssistance) + qtdPurchases,
      }
    }
  }

  async getStock(productId) {
    const product = await ModelProdLojaSeriesMovimentos.findAny(1, {productId, isNull: 'outputBeepDate'}, 'serialNumber')
    const total = await ModelProdLojas.findAny(1, {CODIGO: productId}, 'EST_ATUAL')

    return {
      serialNumber: process.env.STOCK_BEEP === '1' ? product.map(product => product.serialNumber) : [],
      total: process.env.STOCK_BEEP !== '1' ? total[0].EST_ATUAL : product.map(product => product.serialNumber).length,
    }
  }

  async getPendingSales(alternativeId) {
    const salesProd = await ModelSalesProd.findAny(0, {
      COD_ORIGINAL: alternativeId,
      in: {STATUS: ['Enviado', 'Em Previsão', 'Em lançamento']}
    })

    if (salesProd.length === 0) return []

    const sales = await ModelSales.findAny(0, {
      in: {ID: salesProd.map(item => item.ID_SALE_ID)}
    })

    return sales.map(sale => {
      const saleProduct = salesProd.find(sp => sp.ID_SALE_ID === sale.ID)
      return {
        id: sale.ID_SALES,
        date: sale.EMISSAO.toLocaleDateString('pt-BR'),
        customer: sale.NOMECLI,
        quantity: saleProduct.QUANTIDADE
      }
    })
  }

  async getPendingAssistance(alternativeId) {
    const assistance = await ModelAssistance.findAny(0, {
      COD_ORIGINAL: alternativeId,
      in: {STATUS: ['No CD', 'Em Previsão', 'Em lançamento']}
    })

    if (assistance.length === 0) return []

    let sales = await ModelSales.findAny(0, {
      in: {ID_SALES: assistance.map(item => item.ID_SALE)}
    })

    sales = sales.filter(sale => {
      const findAssistance = assistance.find(item => item.ID_SALE === sale.ID_SALES && item.CODLOJA === sale.CODLOJA)
      return findAssistance ? true : false
    })

    return sales.map(item => {
      const findAssistance = assistance.find(a => a.ID_SALE === item.ID_SALES && a.CODLOJA === item.CODLOJA)
      return {
        id: item.ID_SALES,
        date: item.EMISSAO.toLocaleDateString('pt-BR'),
        customer: item.NOMECLI,
        quantity: findAssistance.QUANTIDADE,
      }
    })
  }

  async getPendingPurchases(productId) {
    const purchases = await ModelProdutos._query(1, scriptProductDetails.pendingPurchaseOrder(productId), QueryTypes.SELECT)
    return purchases
  }

  async getPendingTransfers(productId) {
    const product = scriptProductDetails.openTransfers(productId)
    const transfers = await ModelProdutos._query(1, product, QueryTypes.SELECT)

    return transfers
  }

  async getOpenForecasts(alternativeId) {
    const forecasts = await ModelProdutos._query(0, scriptProductDetails.openForecasts(alternativeId), QueryTypes.SELECT)

    if (forecasts.length === 0) return []

    return forecasts
  }

  async getOpenRoutes(alternativeId) {
    const deliveryProd = await ModelDeliveryProd._query(0, scriptProductDetails.openRoutes(alternativeId), QueryTypes.SELECT)

    if (deliveryProd.length === 0) return []

    return deliveryProd
  }
}

module.exports = new ProductDetailsService()
