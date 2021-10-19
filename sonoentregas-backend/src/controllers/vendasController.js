const ViewVendas = require('../models/ViewVendas')
const ProdVenda = require('../models/ProdVenda')
const Sales = require('../models/Sales')
const SalesProd = require('../models/SalesProd')
const OrcParc = require('../models/OrcParc')
const ViewOrcParcLoja = require('../models/ViewOrcParcLoja')

const { getDate, getTransformDate } = require('../functions/getDate')

module.exports = {
  async vendasSce(req, res) {
    try {
      const { loja, emissao } = req.params

      const vendas = await ViewVendas.findSome(loja, `EMISSAO = '${emissao}'`)
  
      return res.send(vendas)
    } catch (error) {
      res.status(400).json(error)
    }
  },
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
  async submitSale( req, res ){
    try {
      const { loja } = req.params
      
      let { CODIGOVENDA, CODCLIENTE, NOMECLI, VALORPROD, DESCONTO, TOTALVENDA, EMISSAO, STATUS, ENDERECO, NUMERO, BAIRRO, CIDADE, ESTADO, PONTOREF, OBS, products, USER_ID, VENDEDOR, FONE, CGC_CPF, INS_RG, FAX, orcParc, O_V , OBS2, HAVE_OBS2} = req.body //

      const D_ENVIO = getDate()
      const D_ENTREGA1 = getTransformDate(EMISSAO, 11) //Objetivo do sistema
      console.log(O_V)
      const DOWN_EST = O_V == 0 ? 1 : 'NULL'

      if (!STATUS) {
        STATUS = 'Enviado'
        
        const valuesSales = `${CODIGOVENDA}, ${loja}, ${CODCLIENTE}, '${NOMECLI}', ${VALORPROD}, ${DESCONTO}, ${TOTALVENDA}, '${EMISSAO}', 'Aberta', '${ENDERECO}', '${NUMERO}', '${BAIRRO}', '${CIDADE}', '${ESTADO}', '${PONTOREF}', '${OBS}', NULL, ${USER_ID}, '${D_ENTREGA1}', '${D_ENVIO}', '${VENDEDOR}', '${FONE}', '${CGC_CPF}', '${INS_RG}', '${FAX}', '${O_V}', '${OBS2}', '${HAVE_OBS2}'` //

        await Sales.creator(0, valuesSales)

        await orcParc.forEach( async item => {
          let { TITULO, PARCELA, VENCIMENTO, VALOR, FORMPAGTO } = item

          var valuesOrcParc = `${TITULO}, ${loja}, ${PARCELA}, '${VENCIMENTO}', ${VALOR}, '${FORMPAGTO}'`

          await OrcParc.creator(0, valuesOrcParc, true)
        })

        await products.forEach( async prod => {
          var { NUMVENDA, CODPRODUTO, COD_ORIGINAL, DESCRICAO, QUANTIDADE, UNITARIO1, DESCONTO, NVTOTAL } = prod

          var valueProd = `${NUMVENDA}, ${loja}, ${CODPRODUTO}, '${COD_ORIGINAL}', '${DESCRICAO}', ${QUANTIDADE}, ${UNITARIO1}, ${DESCONTO}, ${NVTOTAL}, '${STATUS}', ${DOWN_EST}`

          await SalesProd.creator(0, valueProd, true)

          if (O_V === '2') {
            await Sales._query(loja, `UPDATE PRODLOJAS SET EST_ATUAL = EST_ATUAL + ${QUANTIDADE}, EST_LOJA = EST_LOJA + ${QUANTIDADE} WHERE CODIGO = ${CODPRODUTO} AND CODLOJA = 1`)
          }

          await Sales._query(loja, `UPDATE NVENDI2 SET STATUS = '${STATUS}' WHERE NUMVENDA = ${CODIGOVENDA} AND CODPRODUTO = ${CODPRODUTO}`)
        })

        await Sales._query(loja, `UPDATE NVENDA2 SET STATUS = '${STATUS}' WHERE CODIGOVENDA = ${CODIGOVENDA}`)
        
        return res.json(STATUS)
      } else {

        return res.status(404).json({ msg: 'Erro no STATUS de origem' })
      }
      
    } catch (error) {
      res.status(400).json(error)
    }
  },
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
}