const ViewVendas = require('../models/ViewVendas')
const ProdVenda = require('../models/ProdVenda')
const Sales = require('../models/Sales')
const SalesProd = require('../models/SalesProd')

const getDate = require('../functions/getDate')

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
  
      const prodVenda = await ProdVenda.findSome(loja, `NUMVENDA = ${numvenda}`)
  
      return res.json(prodVenda)
    } catch (error) {
      return res.status(400).json(error)
    }
  },
  async submitSale( req, res ){
    try {
      const { loja } = req.params
      
      let { CODIGOVENDA, CODCLIENTE, NOMECLI, VALORPROD, DESCONTO, TOTALVENDA, EMISSAO, STATUS, ENDERECO, BAIRRO, CIDADE, ESTADO, PONTOREF, OBS, products, USER_ID, D_ENTREGA1 } = req.body

      const D_ENVIO = getDate()

      if (!STATUS) {        
        STATUS = 'Enviado'
        
        const valuesSales = `${CODIGOVENDA}, ${loja}, ${CODCLIENTE}, '${NOMECLI}', ${VALORPROD}, ${DESCONTO}, ${TOTALVENDA}, '${EMISSAO}', '${STATUS}', '${ENDERECO}', '${BAIRRO}', '${CIDADE}', '${ESTADO}', '${PONTOREF}', '${OBS}', ${USER_ID}, '${D_ENTREGA1}', '${D_ENVIO}'`
        
        await Sales.creator(0, valuesSales)
        
        await products.forEach( async prod => {
          var { NUMVENDA, CODPRODUTO, COD_ORIGINAL, DESCRICAO, QUANTIDADE, UNITARIO1, DESCONTO, NVTOTAL } = prod
          
          var valueProd = `${NUMVENDA}, ${loja}, ${CODPRODUTO}, '${COD_ORIGINAL}', '${DESCRICAO}', ${QUANTIDADE}, ${UNITARIO1}, ${DESCONTO}, ${NVTOTAL}`
          
          await SalesProd.creator(0, valueProd, true)

          await Sales._query(loja, `UPDATE PRODLOJAS SET EST_ATUAL = EST_ATUAL + ${QUANTIDADE}, EST_LOJA = EST_LOJA + ${QUANTIDADE} WHERE CODIGO = ${CODPRODUTO} AND CODLOJA = 1`)
        })

        await Sales._query(loja, `UPDATE NVENDA2 SET STATUS = 'Enviado' WHERE CODIGOVENDA = ${CODIGOVENDA}`)
        
        return res.json(STATUS)
      } else {

        return res.status(404).json({ msg: 'Erro no STATUS de origem' })
      }
      
    } catch (error) {
      res.status(400).json(error)
    }
  }
}