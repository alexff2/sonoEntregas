<<<<<<< HEAD
// @ts-check
const ViewVendas = require('../models/ViewVendas')
const ProdVenda = require('../models/ProdVenda')
const Sales = require('../models/Sales')
const SalesProd = require('../models/SalesProd')
const OrcParc = require('../models/OrcParc')
const ViewOrcParcLoja = require('../models/ViewOrcParcLoja')

const { getDate, setDaysInDate } = require('../functions/getDate')

module.exports = {
  /**
   * @param {*} req 
   * @param {*} res 
   * @returns 
   */
  async vendasSce(req, res) {
    try {
      const { loja, emissao } = req.params

      const vendas = await ViewVendas.findSome(loja, `EMISSAO = '${emissao}'`)
  
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
  async vendasSceProd(req, res){
    try {
      const { loja, numvenda } = req.params
  
      const products = await ProdVenda.findSome(loja, `NUMVENDA = ${numvenda}`)
      const orcparc = await ViewOrcParcLoja.findSome(loja, `TITULO = ${numvenda}`)
  
      return res.json({ products, orcparc })
    } catch (error) {
      return res.status(400).json(error)
    }
  },
  /**
   * @param {*} req 
   * @param {*} res 
   * @returns 
   */
  async submitSale( req, res ){
    try {
      const { loja } = req.params
      
      const { CODIGOVENDA, CODCLIENTE, NOMECLI, VALORPROD, DESCONTO, TOTALVENDA, EMISSAO, ENDERECO, NUMERO, BAIRRO, CIDADE, ESTADO, PONTOREF, OBS, products, USER_ID, VENDEDOR, FONE, CGC_CPF, INS_RG, FAX, orcParc, O_V , OBS2, HAVE_OBS2} = req.body

      const D_ENVIO = getDate()
      const D_ENTREGA1 = setDaysInDate(EMISSAO, 10) //Objetivo do sistema
      const DOWN_EST = O_V == 0 ? 1 : 'NULL'

      const saleFind = await Sales.findSome(0, `ID_SALES = ${CODIGOVENDA} AND CODLOJA = ${loja}`)

      if (saleFind.length === 0) {
        
        const valuesSales = `${CODIGOVENDA}, ${loja}, ${CODCLIENTE}, '${NOMECLI}', ${VALORPROD}, ${DESCONTO}, ${TOTALVENDA}, '${EMISSAO}', 'Aberta', '${ENDERECO}', '${NUMERO}', '${BAIRRO}', '${CIDADE}', '${ESTADO}', '${PONTOREF}', '${OBS}', NULL, ${USER_ID}, '${D_ENTREGA1}', '${D_ENVIO}', '${VENDEDOR}', '${FONE}', '${CGC_CPF}', '${INS_RG}', '${FAX}', '${O_V}', '${OBS2}', '${HAVE_OBS2}', 0, NULL`
  
        await Sales.creator(0, valuesSales)
  
        for (let i = 0; i < orcParc.length; i++) {
          const { TITULO, PARCELA, VENCIMENTO, VALOR, FORMPAGTO } = orcParc[i]
  
          var valuesOrcParc = `${TITULO}, ${loja}, ${PARCELA}, '${VENCIMENTO}', ${VALOR}, '${FORMPAGTO}'`
  
          await OrcParc.creator(0, valuesOrcParc, true)
        }
  
        for (let i = 0; i < products.length; i++) {
          const { NUMVENDA, CODPRODUTO, ALTERNATI, DESCRICAO, QUANTIDADE, UNITARIO1,NPDESC, NVTOTAL, gift  } = products[i]

          const GIFT = gift ? 1 : 0

          var valueProd = `${NUMVENDA}, ${loja}, ${CODPRODUTO}, '${ALTERNATI}', '${DESCRICAO}', ${QUANTIDADE}, ${UNITARIO1}, ${NPDESC}, ${NVTOTAL}, 'Enviado', ${DOWN_EST}, ${GIFT}`

          await SalesProd.creator(0, valueProd, true)

          if (O_V === '2') {
            await Sales._query(loja, `UPDATE PRODLOJAS SET EST_ATUAL = EST_ATUAL + ${QUANTIDADE}, EST_LOJA = EST_LOJA + ${QUANTIDADE} WHERE CODIGO = ${CODPRODUTO} AND CODLOJA = 1`)
          }

          await Sales._query(loja, `UPDATE NVENDI2 SET STATUS = 'Enviado' WHERE NUMVENDA = ${CODIGOVENDA} AND CODPRODUTO = ${CODPRODUTO}`)
        }
      } else {
        for (let i = 0; i < products.length; i++) {
          const { NUMVENDA, CODPRODUTO, ALTERNATI, DESCRICAO, QUANTIDADE, UNITARIO1,NPDESC, NVTOTAL } = products[i]

          var valueProd = `${NUMVENDA}, ${loja}, ${CODPRODUTO}, '${ALTERNATI}', '${DESCRICAO}', ${QUANTIDADE}, ${UNITARIO1}, ${NPDESC}, ${NVTOTAL}, 'Enviado', ${DOWN_EST}`

          await SalesProd.creator(0, valueProd, true)

          if (O_V === '2') {
            await Sales._query(loja, `UPDATE PRODLOJAS SET EST_ATUAL = EST_ATUAL + ${QUANTIDADE}, EST_LOJA = EST_LOJA + ${QUANTIDADE} WHERE CODIGO = ${CODPRODUTO} AND CODLOJA = 1`)
          }

          await Sales._query(loja, `UPDATE NVENDI2 SET STATUS = 'Enviado' WHERE NUMVENDA = ${CODIGOVENDA} AND CODPRODUTO = ${CODPRODUTO}`)
        }
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
      const { ID_SALES, CODLOJA, CODPRODUTO, QUANTIDADE } = req.body

      await Sales._query(CODLOJA, `UPDATE PRODLOJAS SET EST_ATUAL = EST_ATUAL + ${QUANTIDADE}, EST_LOJA = EST_LOJA + ${QUANTIDADE} WHERE CODIGO = ${CODPRODUTO} AND CODLOJA = 1`)
      await Sales._query(0, `UPDATE SALES_PROD SET DOWN_EST = 0 WHERE ID_SALES = ${ID_SALES} AND CODPRODUTO = ${CODPRODUTO} AND CODLOJA = ${CODLOJA}`)

      return res.json({msg: 'Estoque estornado!'})
    } catch (error) {
      return res.status(400).json(error)
    }
  }
=======
// @ts-check
const ViewVendas = require('../models/ViewVendas')
const ProdVenda = require('../models/ProdVenda')
const Sales = require('../models/Sales')
const SalesProd = require('../models/SalesProd')
const OrcParc = require('../models/OrcParc')
const ViewOrcParcLoja = require('../models/ViewOrcParcLoja')

const { getDate, setDaysInDate } = require('../functions/getDate')

module.exports = {
  /**
   * @param {*} req 
   * @param {*} res 
   * @returns 
   */
  async vendasSce(req, res) {
    try {
      const { loja, emissao } = req.params

      const vendas = await ViewVendas.findSome(loja, `EMISSAO = '${emissao}'`)
  
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
  async vendasSceProd(req, res){
    try {
      const { loja, numvenda } = req.params
  
      const products = await ProdVenda.findSome(loja, `NUMVENDA = ${numvenda}`)
      const orcparc = await ViewOrcParcLoja.findSome(loja, `TITULO = ${numvenda}`)
  
      return res.json({ products, orcparc })
    } catch (error) {
      return res.status(400).json(error)
    }
  },
  /**
   * @param {*} req 
   * @param {*} res 
   * @returns 
   */
  async submitSale( req, res ){
    try {
      const { loja } = req.params
      
      const { CODIGOVENDA, CODCLIENTE, NOMECLI, VALORPROD, DESCONTO, TOTALVENDA, EMISSAO, ENDERECO, NUMERO, BAIRRO, CIDADE, ESTADO, PONTOREF, OBS, products, USER_ID, VENDEDOR, FONE, CGC_CPF, INS_RG, FAX, orcParc, O_V , OBS2, HAVE_OBS2} = req.body //

      const D_ENVIO = getDate()
      const D_ENTREGA1 = setDaysInDate(EMISSAO, 10) //Objetivo do sistema
      const DOWN_EST = O_V == 0 ? 1 : 'NULL'

      const saleFind = await Sales.findSome(0, `ID_SALES = ${CODIGOVENDA} AND CODLOJA = ${loja}`)

      if (saleFind.length === 0) {
        
        const valuesSales = `${CODIGOVENDA}, ${loja}, ${CODCLIENTE}, '${NOMECLI}', ${VALORPROD}, ${DESCONTO}, ${TOTALVENDA}, '${EMISSAO}', 'Aberta', '${ENDERECO}', '${NUMERO}', '${BAIRRO}', '${CIDADE}', '${ESTADO}', '${PONTOREF}', '${OBS}', NULL, ${USER_ID}, '${D_ENTREGA1}', '${D_ENVIO}', '${VENDEDOR}', '${FONE}', '${CGC_CPF}', '${INS_RG}', '${FAX}', '${O_V}', '${OBS2}', '${HAVE_OBS2}', 0, NULL` //
  
        await Sales.creator(0, valuesSales)
  
        for (let i = 0; i < orcParc.length; i++) {
          const { TITULO, PARCELA, VENCIMENTO, VALOR, FORMPAGTO } = orcParc[i]
  
          var valuesOrcParc = `${TITULO}, ${loja}, ${PARCELA}, '${VENCIMENTO}', ${VALOR}, '${FORMPAGTO}'`
  
          await OrcParc.creator(0, valuesOrcParc, true)
        }
  
        for (let i = 0; i < products.length; i++) {
          const { NUMVENDA, CODPRODUTO, ALTERNATI, DESCRICAO, QUANTIDADE, UNITARIO1,NPDESC, NVTOTAL } = products[i]
  
          var valueProd = `${NUMVENDA}, ${loja}, ${CODPRODUTO}, '${ALTERNATI}', '${DESCRICAO}', ${QUANTIDADE}, ${UNITARIO1}, ${NPDESC}, ${NVTOTAL}, 'Enviado', ${DOWN_EST}`
  
          await SalesProd.creator(0, valueProd, true)
  
          if (O_V === '2') {
            await Sales._query(loja, `UPDATE PRODLOJAS SET EST_ATUAL = EST_ATUAL + ${QUANTIDADE}, EST_LOJA = EST_LOJA + ${QUANTIDADE} WHERE CODIGO = ${CODPRODUTO} AND CODLOJA = 1`)
          }
  
          await Sales._query(loja, `UPDATE NVENDI2 SET STATUS = 'Enviado' WHERE NUMVENDA = ${CODIGOVENDA} AND CODPRODUTO = ${CODPRODUTO}`)
        }
      } else {
        for (let i = 0; i < products.length; i++) {
          const { NUMVENDA, CODPRODUTO, ALTERNATI, DESCRICAO, QUANTIDADE, UNITARIO1,NPDESC, NVTOTAL } = products[i]
  
          var valueProd = `${NUMVENDA}, ${loja}, ${CODPRODUTO}, '${ALTERNATI}', '${DESCRICAO}', ${QUANTIDADE}, ${UNITARIO1}, ${NPDESC}, ${NVTOTAL}, 'Enviado', ${DOWN_EST}`
  
          await SalesProd.creator(0, valueProd, true)
  
          if (O_V === '2') {
            await Sales._query(loja, `UPDATE PRODLOJAS SET EST_ATUAL = EST_ATUAL + ${QUANTIDADE}, EST_LOJA = EST_LOJA + ${QUANTIDADE} WHERE CODIGO = ${CODPRODUTO} AND CODLOJA = 1`)
          }
  
          await Sales._query(loja, `UPDATE NVENDI2 SET STATUS = 'Enviado' WHERE NUMVENDA = ${CODIGOVENDA} AND CODPRODUTO = ${CODPRODUTO}`)
        }
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
      const { ID_SALES, CODLOJA, CODPRODUTO, QUANTIDADE } = req.body

      await Sales._query(CODLOJA, `UPDATE PRODLOJAS SET EST_ATUAL = EST_ATUAL + ${QUANTIDADE}, EST_LOJA = EST_LOJA + ${QUANTIDADE} WHERE CODIGO = ${CODPRODUTO} AND CODLOJA = 1`)
      await Sales._query(0, `UPDATE SALES_PROD SET DOWN_EST = 0 WHERE ID_SALES = ${ID_SALES} AND CODPRODUTO = ${CODPRODUTO} AND CODLOJA = ${CODLOJA}`)

      return res.json({msg: 'Estoque estornado!'})
    } catch (error) {
      return res.status(400).json(error)
    }
  }
>>>>>>> 7437dd52a52ac52662a9905c74b99cacf50dcad7
}