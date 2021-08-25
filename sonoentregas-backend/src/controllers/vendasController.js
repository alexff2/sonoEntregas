const ViewVendas = require('../models/ViewVendas')
const ProdVenda = require('../models/ProdVenda')
const Sales = require('../models/Sales')
const SalesProd = require('../models/SalesProd')
const OrcParc = require('../models/OrcParc')
const OrcParcLoja = require('../models/ViewOrcParcLoja')

const getDate = require('../functions/getDate')
const ViewOrcParcLoja = require('../models/ViewOrcParcLoja')

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
      
      let { CODIGOVENDA, CODCLIENTE, NOMECLI, VALORPROD, DESCONTO, TOTALVENDA, EMISSAO, STATUS, ENDERECO, NUMERO, BAIRRO, CIDADE, ESTADO, PONTOREF, OBS, products, USER_ID, D_ENTREGA1, VENDEDOR, FONE, CGC_CPF, INS_RG, FAX, orcParc, O_V } = req.body

      const D_ENVIO = getDate()

      if (!STATUS) {        
        STATUS = 'Enviado'
        
        const valuesSales = `${CODIGOVENDA}, ${loja}, ${CODCLIENTE}, '${NOMECLI}', ${VALORPROD}, ${DESCONTO}, ${TOTALVENDA}, '${EMISSAO}', 'Aberta', '${ENDERECO}', '${NUMERO}', '${BAIRRO}', '${CIDADE}', '${ESTADO}', '${PONTOREF}', '${OBS}', NULL, ${USER_ID}, '${D_ENTREGA1}', '${D_ENVIO}', '${VENDEDOR}', '${FONE}', '${CGC_CPF}', '${INS_RG}', '${FAX}', '${O_V}'`

        await Sales.creator(0, valuesSales)

        await orcParc.forEach( async item => {
          let { TITULO, PARCELA, VENCIMENTO, VALOR, FORMPAGTO } = item

          var valuesOrcParc = `${TITULO}, ${loja}, ${PARCELA}, '${VENCIMENTO}', ${VALOR}, '${FORMPAGTO}'`

          await OrcParc.creator(0, valuesOrcParc, true)
        })

        await products.forEach( async prod => {
          var { NUMVENDA, CODPRODUTO, COD_ORIGINAL, DESCRICAO, QUANTIDADE, UNITARIO1, DESCONTO, NVTOTAL } = prod

          var valueProd = `${NUMVENDA}, ${loja}, ${CODPRODUTO}, '${COD_ORIGINAL}', '${DESCRICAO}', ${QUANTIDADE}, ${UNITARIO1}, ${DESCONTO}, ${NVTOTAL}, '${STATUS}'`

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
  }
}