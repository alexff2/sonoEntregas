// @ts-check

/**
 * @typedef {Object} ProductSceCd
 * @property {string} COD_ORIGINAL
 * @property {string} NOME
 * @property {number} EST_ATUAL
 * @property {number} EST_RESERVA
 * @property {number} EST_DISPONIVEL
 * 
 * @typedef {Object} ProductSceShop
 * @property {number} NUMVENDA
 * @property {number} CODPRODUTO
 * @property {string} ALTERNATI
 * @property {string} DESCRICAO
 * @property {number} QUANTIDADE
 * @property {number} UNITARIO1
 * @property {number} NPDESC
 * @property {boolean} GIFT
 * @property {number} NVTOTAL
 */

const ViewVendas = require('../models/ViewVendas')
const ProductsSceShop = require('../models/ProdVenda')
const ProductsSceCd = require('../models/ViewProdutos')
const Sales = require('../models/Sales')
const SalesProd = require('../models/SalesProd')
const OrcParc = require('../models/OrcParc')
const ViewOrcParcLoja = require('../models/ViewOrcParcLoja')

const SalesService = require('../services/salesService')

const ObjDate = require('../functions/getDate')
const { QueryTypes } = require('sequelize')

module.exports = {
  /**
   * @param {*} req 
   * @param {*} res 
   * @returns 
   */
  async salesSce(req, res) {
    try {
      const { loja, emissao } = req.params

      const vendas = await ViewVendas.findSome(loja, `EMISSAO = '${emissao}' ORDER BY CODIGOVENDA`)
  
      return res.send(vendas)
    } catch (error) {
      res.status(400).json(error)
    }
  },
  /**
   * @param {*} req 
   * @param {*} res 
   * @returns 
   */
  async salesSceProd(req, res) {
    try {
      const { idShop, codDAV } = req.params

      /** @type { [ProductSceShop] } */
      const productsSceShop = await ProductsSceShop.find({
        loja: idShop,
        where: {
          NUMVENDA: codDAV
        }
      })

      const codOrigProductsSceShop = []

      productsSceShop.forEach( product => {
        product['SEND'] = false

        product.ALTERNATI !== '' && codOrigProductsSceShop.push(product.ALTERNATI)
      })

      /** @type { [ProductSceCd] } */
      const productsSceCd = await ProductsSceCd.find({
        loja: 1,
        where: {
          in: {
            COD_ORIGINAL: codOrigProductsSceShop
          }
        }
      })

      productsSceShop.forEach( prodSceShop => {
        prodSceShop['CD'] = false
        productsSceCd.forEach(prodSceCd => {
          if (prodSceShop.ALTERNATI === prodSceCd.COD_ORIGINAL ) {
            prodSceShop['CD'] = prodSceCd
          }
        })
      })

      const orcparc = await ViewOrcParcLoja.find({
        loja: idShop,
        where: {
          TITULO: codDAV
        }
      })

      return res.json({ productsSceShop, orcparc })
    } catch (error) {
      console.log(error)
      return res.status(400).json(error)
    }
  },
  /**
   * @param {*} req 
   * @param {*} res 
   * @returns 
   */
  async sendSale( req, res ){
    try {
      const { loja } = req.params
      
      const { CODIGOVENDA, CODCLIENTE, NOMECLI, VALORPROD, DESCONTO, TOTALVENDA, EMISSAO, ENDERECO, NUMERO, BAIRRO, CIDADE, ESTADO, PONTOREF, OBS, products, USER_ID, VENDEDOR, FONE, CGC_CPF, INS_RG, FAX, FONE2, orcParc, O_V , OBS2, HAVE_OBS2, isWithdrawal } = req.body

      const fone_2 = FAX ? FAX : FONE2

      const D_ENVIO = ObjDate.getDate()

      const days = Number(process.env.DAYS || '10')

      const D_ENTREGA1 = ObjDate.setDaysInDate(EMISSAO.split('T')[0], days) //Objetivo do sistema
      const DOWN_EST = O_V == 0 ? 1 : 'NULL'

      const saleFind = await Sales.findSome(0, `ID_SALES = ${CODIGOVENDA} AND CODLOJA = ${loja}`)

      if (saleFind.length === 0) {

        const valuesSales = `${CODIGOVENDA}, ${loja}, ${CODCLIENTE}, '${NOMECLI}', ${VALORPROD}, ${DESCONTO}, ${TOTALVENDA}, '${EMISSAO}', 'Aberta', '${ENDERECO}', '${NUMERO}', '${BAIRRO}', '${CIDADE}', '${ESTADO}', '${PONTOREF}', '${OBS}', ${USER_ID}, '${D_ENTREGA1}', '${D_ENVIO}', '${VENDEDOR}', '${FONE}', '${CGC_CPF}', '${INS_RG}', '${fone_2}', '${O_V}', '${OBS2}', '${HAVE_OBS2 ? 1 : 0}', 0, NULL, ${isWithdrawal ? 1 : 0}, NULL`

        await Sales.creator(0, valuesSales)

        for (let i = 0; i < orcParc.length; i++) {
          const { TITULO, PARCELA, VENCIMENTO, VALOR, FORMPAGTO } = orcParc[i]
  
          let valuesOrcParc = `${TITULO}, ${loja}, ${PARCELA}, '${VENCIMENTO}', ${VALOR}, '${FORMPAGTO}'`
  
          await OrcParc.creator(0, valuesOrcParc, true)
        }
      } else if (saleFind[0].STATUS === 'Cancelada') {
        const valuesSales = `TOTAL_PROD = ${VALORPROD}, DESCONTO = ${DESCONTO}, TOTAL = ${TOTALVENDA}, ENDERECO = '${ENDERECO}', STATUS = 'Aberta', NUMERO = '${NUMERO}', BAIRRO = '${BAIRRO}', CIDADE = '${CIDADE}', ESTADO = '${ESTADO}', PONTOREF = '${PONTOREF}', OBS = '${OBS}', D_ENTREGA1 = '${D_ENTREGA1}', D_ENVIO = '${D_ENVIO}', VENDEDOR = '${VENDEDOR}', FONE = '${FONE}', CGC_CPF = '${CGC_CPF}', INS_RG = '${INS_RG}', FAX = '${fone_2}', O_V = '${O_V}', OBS2 = '${OBS2}', HAVE_OBS2 = '${HAVE_OBS2 ? 1 : 0}', isWithdrawal = ${isWithdrawal ? 1 : 0}`

        await Sales._query(0, `UPDATE SALES SET ${valuesSales} WHERE ID_SALES = ${CODIGOVENDA} AND CODLOJA = ${loja}`)

        await OrcParc._query(0, `DELETE ORCPARC WHERE ID_SALES = ${CODIGOVENDA} AND CODLOJA = ${loja}`)

        for (let i = 0; i < orcParc.length; i++) {
          const { TITULO, PARCELA, VENCIMENTO, VALOR, FORMPAGTO } = orcParc[i]
  
          let valuesOrcParc = `${TITULO}, ${loja}, ${PARCELA}, '${VENCIMENTO}', ${VALOR}, '${FORMPAGTO}'`
  
          await OrcParc.creator(0, valuesOrcParc, true)
        }
      }

      const currentSale = saleFind.length === 0 ? await Sales._query(0, 'SELECT MAX(ID) ID FROM SALES', QueryTypes.SELECT) : saleFind

      for (let i = 0; i < products.length; i++) {
        const { NUMVENDA, CODPRODUTO, ALTERNATI, DESCRICAO, QUANTIDADE, UNITARIO1,NPDESC, NVTOTAL, GIFT  } = products[i]

        const _GIFT = GIFT ? 1 : 0

        let valueProd = `${NUMVENDA}, ${loja}, ${CODPRODUTO}, '${ALTERNATI}', '${DESCRICAO}', ${QUANTIDADE}, ${UNITARIO1}, ${NPDESC}, ${NVTOTAL}, 'Enviado', ${DOWN_EST}, ${_GIFT}, ${currentSale[0].ID}`

        await SalesProd.creator(0, valueProd, true)

        if (O_V === '2') {
          await Sales._query(loja, `UPDATE PRODLOJAS SET EST_ATUAL = EST_ATUAL + ${QUANTIDADE}, EST_LOJA = EST_LOJA + ${QUANTIDADE} WHERE CODIGO = ${CODPRODUTO} AND CODLOJA = 1`)
        }

        await Sales._query(loja, `UPDATE NVENDI2 SET STATUS = 'Enviado', GIFT = ${_GIFT} WHERE NUMVENDA = ${CODIGOVENDA} AND CODPRODUTO = ${CODPRODUTO}`)
      }

      return res.json({create: true})
    } catch (error) {
      console.log(error)
      return res.status(400).json(error)
    }
  },
  /**
   * @param {*} req 
   * @param {*} res 
   * @returns 
   */
  async cancelSubmitSales( req, res ){
    try {
      const { ID_SALES, CODLOJA, CODPRODUTO, QUANTIDADE, DOWN_EST } = req.body

      await SalesProd._query(0, `DELETE SALES_PROD WHERE ID_SALES = ${ID_SALES} AND CODLOJA = ${CODLOJA} AND CODPRODUTO = '${CODPRODUTO}'`)

      if (DOWN_EST == null){
        await Sales._query(CODLOJA, `UPDATE PRODLOJAS SET EST_ATUAL = EST_ATUAL - ${QUANTIDADE}, EST_LOJA = EST_LOJA - ${QUANTIDADE} WHERE CODIGO = ${CODPRODUTO} AND CODLOJA = 1`)
      }
      await Sales._query(CODLOJA, `UPDATE NVENDI2 SET STATUS = NULL WHERE NUMVENDA = ${ID_SALES} AND CODPRODUTO = ${CODPRODUTO}`)

      const ProdSales = await SalesProd.findSome(0, `ID_SALES = ${ID_SALES} AND CODLOJA = ${CODLOJA}`)

      const forecastSale = await Sales._query(0, `SELECT * FROM SALES A INNER JOIN FORECAST_SALES B ON A.ID = B.idSale WHERE A.ID_SALES = ${ID_SALES} AND A.CODLOJA = ${CODLOJA}`, QueryTypes.SELECT)

      if (ProdSales.length === 0) {
        if (forecastSale.length === 0) {
          await SalesProd._query(0, `DELETE SALES WHERE ID_SALES = ${ID_SALES} AND CODLOJA = ${CODLOJA}`)        
          await SalesProd._query(0, `DELETE ORCPARC WHERE ID_SALES = ${ID_SALES} AND CODLOJA = ${CODLOJA}`)
          await Sales._query(CODLOJA, `UPDATE NVENDA2 SET STATUS = NULL WHERE CODIGOVENDA = ${ID_SALES}`)

          return res.json({msg: 'Venda também excluída!', venda: true})
        } else {
          await Sales.updateAny(0, { STATUS: 'Cancelada' }, { ID_SALES, CODLOJA })

          return res.json({msg: 'Venda cancelada!', venda: false})
        }
      }
      return res.json({msg: 'Produto excluído com sucesso!', venda: false})
    } catch (error) {
      console.log(error)
      return res.status(400).json(error)
    }
  },
  /**
   * @param {*} req 
   * @param {*} res 
   * @returns 
   */
  async reverseStock( req, res ){
    try {
      const { CODLOJA, CODPRODUTO, QUANTIDADE } = req.body
      const { idSale } = req.params

      await Sales._query(CODLOJA, `UPDATE PRODLOJAS SET EST_ATUAL = EST_ATUAL + ${QUANTIDADE}, EST_LOJA = EST_LOJA + ${QUANTIDADE} WHERE CODIGO = ${CODPRODUTO} AND CODLOJA = 1`)
      await Sales._query(0, `UPDATE SALES_PROD SET DOWN_EST = 0 WHERE ID_SALES = ${idSale} AND CODPRODUTO = ${CODPRODUTO} AND CODLOJA = ${CODLOJA}`)

      return res.json({msg: 'Estoque estornado!'})
    } catch (error) {
      console.log(error)
      return res.status(400).json(error)
    }
  },
  /**
   * @param {*} req
   * @param {*} res
   * @returns
   */
  async updateAddressClient(req, res) {
    try {
      const { idSale } = req.params
  
      await SalesService.updateAddress(idSale)
  
      const sale = await SalesService.findSales(`ID = ${idSale}`)
  
      return res.json(sale[0])
    } catch (error) {
      console.log(error)

      return res.status(400).json(error)
    }
  }
}