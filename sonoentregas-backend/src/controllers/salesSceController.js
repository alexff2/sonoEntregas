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
  async salesSceProd(req, res){
    try {
      const { loja, numSale } = req.params

      /** @type { [ProductSceShop] } */
      const productsSceShop = await ProductsSceShop.find({
        loja,
        where: {
          NUMVENDA: numSale
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
        loja,
        where: {
          TITULO: numSale
        }
      })

      return res.json({ productsSceShop, orcparc })
    } catch (error) {
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
      
      const { CODIGOVENDA, CODCLIENTE, NOMECLI, VALORPROD, DESCONTO, TOTALVENDA, EMISSAO, ENDERECO, NUMERO, BAIRRO, CIDADE, ESTADO, PONTOREF, OBS, products, USER_ID, VENDEDOR, FONE, CGC_CPF, INS_RG, FAX, orcParc, O_V , OBS2, HAVE_OBS2 } = req.body

      const D_ENVIO = ObjDate.getDate()

      const D_ENTREGA1 = ObjDate.setDaysInDate(EMISSAO.split('T')[0], 10) //Objetivo do sistema
      const DOWN_EST = O_V == 0 ? 1 : 'NULL'

      const saleFind = await Sales.findSome(0, `ID_SALES = ${CODIGOVENDA} AND CODLOJA = ${loja}`)

      if (saleFind.length === 0) {

        const valuesSales = `${CODIGOVENDA}, ${loja}, ${CODCLIENTE}, '${NOMECLI}', ${VALORPROD}, ${DESCONTO}, ${TOTALVENDA}, '${EMISSAO}', 'Aberta', '${ENDERECO}', '${NUMERO}', '${BAIRRO}', '${CIDADE}', '${ESTADO}', '${PONTOREF}', '${OBS}', NULL, ${USER_ID}, '${D_ENTREGA1}', '${D_ENVIO}', '${VENDEDOR}', '${FONE}', '${CGC_CPF}', '${INS_RG}', '${FAX}', '${O_V}', '${OBS2}', '${HAVE_OBS2}', 0, NULL`

        await Sales.creator(0, valuesSales)

        for (let i = 0; i < orcParc.length; i++) {
          const { TITULO, PARCELA, VENCIMENTO, VALOR, FORMPAGTO } = orcParc[i]
  
          let valuesOrcParc = `${TITULO}, ${loja}, ${PARCELA}, '${VENCIMENTO}', ${VALOR}, '${FORMPAGTO}'`
  
          await OrcParc.creator(0, valuesOrcParc, true)
        }
      }

      const saleCreate = await Sales._query(0, 'SELECT MAX(ID) ID FROM SALES', QueryTypes.SELECT)

      for (let i = 0; i < products.length; i++) {
        const { NUMVENDA, CODPRODUTO, ALTERNATI, DESCRICAO, QUANTIDADE, UNITARIO1,NPDESC, NVTOTAL, GIFT  } = products[i]

        const _GIFT = GIFT ? 1 : 0

        let valueProd = `${NUMVENDA}, ${loja}, ${CODPRODUTO}, '${ALTERNATI}', '${DESCRICAO}', ${QUANTIDADE}, ${UNITARIO1}, ${NPDESC}, ${NVTOTAL}, 'Enviado', ${DOWN_EST}, ${_GIFT}, ${saleCreate[0].ID}`

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

      if (ProdSales.length === 0) {
        await SalesProd._query(0, `DELETE SALES WHERE ID_SALES = ${ID_SALES} AND CODLOJA = ${CODLOJA}`)        
        await SalesProd._query(0, `DELETE ORCPARC WHERE ID_SALES = ${ID_SALES} AND CODLOJA = ${CODLOJA}`)
        await Sales._query(CODLOJA, `UPDATE NVENDA2 SET STATUS = NULL WHERE CODIGOVENDA = ${ID_SALES}`)

        return res.json({msg: 'Venda também excluída!', venda: true})
      }
      return res.json({msg: 'Produto excluído com sucesso!', venda: false})
    } catch (error) {
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
      return res.status(400).json(error)
    }
  }
}