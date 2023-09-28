const { QueryTypes } = require('sequelize')
const ProductsSold = require('../models/tables/ProductSold')

class SynchroService {
  async getTableProductsSoldInShops(shopIndex) {
    try {
      let month = new Date().getMonth() - 1
      month = month.toString().length === 1 ? `0${month}` : month

      const script = `
      SELECT ${shopIndex} idShop, NUMVENDA idSale, C.COD_GERAL idSeller, A.item, FORMAT(B.EMISSAO, 'yyyy-MM-dd') issuance, D.ALTERNATI idProduct, QUANTIDADE quantify, UNITARIO1 unitPrice1, UNITARIO2 unitPrice2, NVTOTAL amount,
      NPDESC discount, NPACRE increase, PCO_COMPRA purchasePrice, C_AQUIS purchaseCost, PCO_LIQ netPrice, PCO_REMAR salePrice, A.[STATUS] deliveryStatus
      FROM NVENDI2 A
      INNER JOIN NVENDA2 B ON A.NUMVENDA = B.CODIGOVENDA
      INNER JOIN FUNCIONARIO C ON A.CODVENDEDOR = C.CODIGO
      INNER JOIN PRODUTOS D ON A.CODPRODUTO = D.CODIGO
      WHERE A.O_V = 2
      AND B.EMISSAO >= '2023-${month}-01'
      AND C.COD_GERAL IS NOT NULL`

      const productsSoldQuery = await ProductsSold._query(shopIndex, script, QueryTypes.SELECT)

      return { msg: 'Conectado com sucesso!', data: productsSoldQuery}
    } catch (e) {
      console.log(e.original.code)

      if (e.original.code === 'EREQUEST'){
        return { msg: 'Falha na requisição, banco de dados pode não conter a instrução!'}
      } else if (e.original.code === 'ETIMEOUT') {
        return { msg: 'Loja está demorando a responder, tente novamente mais tarde!'}
      } else if (e.original.code === 'ESOCKET') {
        return { msg: 'Desconectado!'}
      } else {
        return { msg: 'Erro ao conectar, verifique o ERRO interno!'}
      }
    }
  }

  async checkTableProductSold(productsSoldQuery) {
    try {
      const productsSold = await ProductsSold.findAll(0)

      if (productsSold.length === 0) {
        await this.bulkCreate(productsSoldQuery)
      } else {
        const productsSoldUpdate = []
        const productsSoldCreate = productsSoldQuery.filter(productSoldQuery => {
          const productSold = productsSold.find(productSold => productSold.idShop === productSoldQuery.idShop && productSold.idSale === productSoldQuery.idSale && productSold.idSeller === productSoldQuery.idSeller && productSold.idProduct === productSoldQuery.idProduct)

          if (!productSold) {
            return productSoldQuery
          } else {
            if (productSold.issuance !== productSoldQuery.issuance || productSold.quantify !== productSoldQuery.quantify || productSold.unitPrice1 !== productSoldQuery.unitPrice1 || productSold.unitPrice2 !== productSoldQuery.unitPrice2 || productSold.amount !== productSoldQuery.amount || productSold.discount !== productSoldQuery.discount || productSold.increase !== productSoldQuery.increase || productSold.purchasePrice !== productSoldQuery.purchasePrice || productSold.purchaseCost !== productSoldQuery.purchaseCost || productSold.netPrice !== productSoldQuery.netPrice || productSold.salePrice !== productSoldQuery.salePrice || `${productSoldQuery.deliveryStatus}` !== productSold.deliveryStatus) {
              productsSoldUpdate.push(productSoldQuery)
            }
          }
        })

        if (productsSoldCreate.length > 0) {
          await this.bulkCreate(productsSoldCreate)
        }

        if (productsSoldUpdate.length > 0) {
          await this.bulkUpdate(productsSoldUpdate)
        }
      }
    } catch (e) {
      throw {
        msg: 'Erro ao verificar a tabela de produtos vendidos!',
        error: e
      }
    }
  }

  async bulkCreate(productsSoldCreate) {
    try {
      const productsSoldToCreate = []

      const numberPages = Math.ceil(productsSoldCreate.length / 1000)

      for (let i = 0; i < numberPages; i++) {
        productsSoldToCreate.push(productsSoldCreate.filter((item, index) => index >= (i * 1000) && index < ((i+1) * 1000)))
      }

      productsSoldToCreate.forEach(async productsSoldToCreatePage => {
        console.log('Rows Add: '+productsSoldToCreatePage.length)
        await ProductsSold.create(0, productsSoldToCreatePage, false)
      })

    } catch (e) {
      throw {
        msg: 'Erro ao criar os produtos vendidos!',
        error: e
      }
    }
  }

  async bulkUpdate(productsSoldUpdate) {
    try {
      console.log('Rows Update: '+productsSoldUpdate.length)
      productsSoldUpdate.forEach(async productSoldUpdate => {
        const { idShop, idSale, idSeller, item } = productSoldUpdate
        const { issuance, quantify, unitPrice1, unitPrice2, amount, discount, increase, purchasePrice, purchaseCost, netPrice, salePrice, deliveryStatus } = productSoldUpdate

        await ProductsSold.updateAny(0, { 
          issuance, quantify, unitPrice1, unitPrice2, amount, discount, increase, purchasePrice, purchaseCost, netPrice, salePrice, deliveryStatus
        }, {
          idShop, idSale, idSeller, item
        })

        console.log('Row Updated: '+idShop+' '+idSale+' '+idSeller+' '+item)
      })
    } catch (e) {
      throw {
        msg: 'Erro ao atualizar os produtos vendidos!',
        error: e
      }
    }
  }
}

module.exports = new SynchroService()
