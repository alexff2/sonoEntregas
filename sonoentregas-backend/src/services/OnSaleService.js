const OnSale = require('../models/tables/OnSale')
const OnSaleProducts = require('../models/tables/OnSaleProducts')
const ViewProducts = require('../models/ViewProdutos')

const ClassDate = require('../class/Date')

class OnSaleService {
  async onSalesOpen() {
    const DateNow = new ClassDate().getISODateTimeBr()

    const onSales = await OnSale.findSome(0, `dateFinish >= '${DateNow.date}'`)

    if (onSales.length === 0) return []

    const onSaleProducts = await OnSaleProducts.findSome(0, `idOnSale IN (${onSales.map(onSale => onSale.id)})`)

    const products = await ViewProducts.findAny(1, { in: { COD_ORIGINAL: onSaleProducts.map(onSaleProduct => onSaleProduct.COD_ORIGINAL) } } )

    onSaleProducts.forEach(onSaleProduct => {
      const product = products.find(product => product.COD_ORIGINAL === onSaleProduct.COD_ORIGINAL)

      onSaleProduct['NOME'] = product.NOME
    })

    onSales.forEach(onSale => {
      onSale['dateStart'] = new ClassDate(onSale.dateStart, true).getBRDateTime().date
      onSale['dateFinish'] = new ClassDate(onSale.dateFinish, true).getBRDateTime().date

      onSale['products'] = onSaleProducts.filter(onSaleProduct => onSaleProduct.idOnSale === onSale.id)
    })

    return onSales
  }

  async create({ description, dateStart, dateFinish, products, idUser }) {
    const onSale = await OnSale.create(0, [{ description, dateStart, dateFinish, idUserCreate: idUser, idUserUpdate: idUser }])

    const onSaleProducts = products.map(product => {
      return {
        idOnSale: onSale.id,
        COD_ORIGINAL: product.COD_ORIGINAL,
        valueOnSales: product.valueOnSales
      }
    })

    await OnSaleProducts.create(0, onSaleProducts, false)

    const productsView = await ViewProducts.findAny(1, { 
      in: { COD_ORIGINAL: onSaleProducts.map(onSaleProduct => onSaleProduct.COD_ORIGINAL) } 
    })

    onSaleProducts.forEach(onSaleProduct => {
      const product = productsView.find(product => product.COD_ORIGINAL === onSaleProduct.COD_ORIGINAL)

      onSaleProduct['NOME'] = product.NOME
    })

    onSale['products'] = onSaleProducts
  
    onSale['dateStart'] = new ClassDate(onSale.dateStart, true).getBRDateTime().date
    onSale['dateFinish'] = new ClassDate(onSale.dateFinish, true).getBRDateTime().date

    onSale['products'] = onSaleProducts.filter(onSaleProduct => onSaleProduct.idOnSale === onSale.id)

    return onSale
  }

  async getProductsOnSale() {
    const script = `
    SELECT A.CODIGO, A.NOME VENDEDOR, D.NOME PRODUTO, SUM(B.QUANTIDADE) QTD, SUM(B.NVTOTAL) VL_VENDA, 
    ISNULL(SUM(E.QTD_DEV), 0) QTD_DEV, ISNULL(SUM(E.VL_DEV), 0) VL_DEV
    FROM FUNCIONARIO A
    INNER JOIN NVENDI2 B ON A.CODIGO = B.CODVENDEDOR
    INNER JOIN NVENDA2 C ON C.CODIGOVENDA = B.NUMVENDA
    INNER JOIN PRODUTOS D ON B.CODPRODUTO = D.CODIGO
    LEFT JOIN (
      SELECT CODVENDA, CODPRODUTO, SUM(QUANTIDADE_DEVOLVIDA) QTD_DEV, SUM(VALOR_TOTAL_DEVOLVIDA) VL_DEV
      FROM ITENS_DEVOLUCAO
      GROUP BY CODVENDA, CODPRODUTO
    ) E ON B.CODPRODUTO = E.CODPRODUTO AND E.CODVENDA = B.NUMVENDA
    WHERE B.O_V = 2
    AND MONTH(C.EMISSAO) = '08'
    AND YEAR(C.EMISSAO) = '2023'
    AND D.ALTERNATI IN ('11029')
    GROUP BY A.CODIGO, A.NOME, D.NOME
    ORDER BY A.NOME ASC, QTD DESC
    `
  }
}

module.exports = new OnSaleService()