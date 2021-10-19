import React, { useState, useEffect } from 'react'

import { getUser, getLoja } from '../../../services/auth'
import api from '../../../services/api'
import { validateObs } from '../../../functions/validateFields'

function SetEstoque({ product, putProduct }) {
  const [ productCd, setProductCd ] = useState()
  const [ inputQtd, setInputQtd ] = useState(false)

  useEffect(() => {
    api.get(`products/COD_ORIGINAL/${product.COD_ORIGINAL}`).then( resp => setProductCd(resp.data[0]))
  },[product])
  
  return (
  <>
    {productCd ? 
      <>  
        <td>{productCd.EST_ATUAL}</td>
        <td>{productCd.EST_DISPONIVEL}</td>
        <td>
          <input 
            type="number" 
            style={{width: 40}}
            defaultValue={product.QUANTIDADE}
            max={product.QUANTIDADE}
            min={1}
            onChange={e => product.QUANTIDADE = e.target.value}
            disabled={inputQtd}
          />
        </td>
        <td><input type="checkbox" onChange={(e) =>{
          putProduct(e, product)
          setInputQtd(!inputQtd)
        }}/></td>
      </> 
      : <>
          <td>{product.QUANTIDADE}</td>
          <td colSpan="3">Produto não encontrado</td>
        </>
    }
  </>
  )
}

export default function ModalSendSale({ 
  item,
  setModal,
  setChildrenAlertModal,
  openMOdalAlert,
  sales,
  setSales
 }){
  const [ orcParc, setOrcParc ] = useState([])
  const [ productSales, setProductSales ] = useState([])
  const [ sendProduct, setSendProduct ] = useState([])
  const [ openObs, setOpenObs ] = useState(false)
  const [ obs, setObs ] = useState('')

  const { cod } = JSON.parse(getLoja())
  const { ID: USER_ID } = JSON.parse(getUser())
  

  useEffect(()=>{
    api.get(`${cod}/vendas/${item.CODIGOVENDA}`)
      .then( resp => {
        setProductSales(resp.data.products)
    
        setOrcParc(resp.data.orcparc)
      })
      .catch( err => {
        setChildrenAlertModal("Falha ao buscar produtos da venda!")
        openMOdalAlert()
        console.log(err)
      })
  },[ cod, item, setChildrenAlertModal, openMOdalAlert ])

  const putProduct = (e, product) => {
    if(e.target.checked){
      setSendProduct([...sendProduct, product])
    } else {
      setSendProduct(sendProduct.filter(item => item.codproduto !== product.codproduto))
    }
    console.log(product)
  }

  const submitSales = async sale => {
    try {
      if(sendProduct.length > 0 && validateObs(obs, openObs)) {
        sale["products"] = sendProduct
        sale.USER_ID = USER_ID
        sale.orcParc = orcParc
        sale.OBS2 = obs
        sale.HAVE_OBS2 = openObs ? 1 : 0

        const { data } = await api.post(`${cod}/vendas/submit`, sale)
        
        sale.STATUS = data
        
        setSales(sales.map( item => item.CODIGOVENDA === sale.CODIGOVENDA ? sale : item))
        
        setModal([])
        setSendProduct([])
      } else {
        if (sendProduct.length === 0) {
          setChildrenAlertModal('Selecione um produto')
        } else if (!validateObs(obs, openObs)){
          setChildrenAlertModal('Coloque uma observação ou desabilite o checkbox de observação')
        }
        openMOdalAlert()
      }
    } catch (error) {
      console.log(error)

      setChildrenAlertModal('Erro ao enviar venda, entre em contato com Administrador')

      openMOdalAlert()
    }
  }

  const closeModal = e => {
    if (e.target.className === 'modal-overlaw' || e.target.className === 'cancel-modal') {
      setModal([])
      setSendProduct([])
      setOrcParc([])
    }
  }
  return (
    <div 
      className="modal-overlaw" 
      key={item.CODIGOVENDA}
      onClick={closeModal}
    >
      <div className="modal">
        <h2>Venda selecionada</h2>
        <div className="sales-modal">
          
          <div className="sales-head">
            <div className="sales-field">
              <div><span>N Venda: </span>{item.CODIGOVENDA}</div>
              <div><span>Cliente: </span>{item.NOMECLI}</div>
              <div><span>Valor: </span>{
                Intl
                  .NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'})
                  .format(item.TOTALVENDA)
              }</div>
              <div>
                <div className="divObsCkeck">
                  <span>Observação?</span><input type="checkbox" onChange={() => setOpenObs(!openObs)}/>
                </div>
                { openObs && <textarea cols={60} onChange={e => setObs(e.target.value)}></textarea> }
              </div>
            </div>
            <div className="sales-buttons">
              <button className="cancel-modal">Cancelar</button>
              <button onClick={() => submitSales(item)}>Enviar</button>
            </div> 
          </div>

          <table className="tab-modal-product">
            <thead>
              <tr>
                <th>Código</th>
                <th>Descrição</th>
                <th>Valor</th>
                <th>Estoque</th>
                <th>Disponível</th>
                <th>Qtd</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
            {productSales.map(product => (
              <tr key={product.COD_ORIGINAL}>
                <td>{product.COD_ORIGINAL}</td>
                <td>{product.DESCRICAO}</td>
                <td>
                  {Intl
                    .NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'})
                    .format(product.NVTOTAL)
                  }
                </td>
                <SetEstoque
                  product={product}
                  putProduct={putProduct}
                />
              </tr>
            ))}
            </tbody>
          </table>
        
        </div>
      </div>
    </div>
  )
}