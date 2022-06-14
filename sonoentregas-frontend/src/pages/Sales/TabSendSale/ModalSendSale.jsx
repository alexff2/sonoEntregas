import React, { useState, useEffect } from 'react'

import { getUser, getLoja } from '../../../services/auth'
import api from '../../../services/api'
import { validateObs } from '../../../functions/validateFields'

import { useModalAlert } from '../../../context/modalAlertContext'

function SetEstoque({ product, putProduct, sendProduct }) {
  const [ productCd, setProductCd ] = useState()
  const [ inputQtd, setInputQtd ] = useState(false)
  const [ disable, setDisable ] = useState(true)

  useEffect(() => {
    api
      .get(`products/COD_ORIGINAL/${product.ALTERNATI}`)
      .then( resp => setProductCd(resp.data[0]))
  },[product])

  const setGift = () => {
    sendProduct.forEach( prod => {
      prod.codproduto === product.codproduto && (sendProduct.gift = true)
    })
  }

  const changeSendProd = e => {
    putProduct(e, product)
    setInputQtd(!inputQtd)
    setDisable(!disable)
  }

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
        <td>
          {!product.STATUS &&
            <input
              type="checkbox"
              style={{marginRight: '3.8rem'}}
              onChange={ e => changeSendProd(e)}
            />
          }{!product.STATUS &&
            <input
              type="checkbox" 
              onChange={() => setGift()}
              disabled={disable}
            />
          }
        </td>
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
  date,
  setEmissao
 }){
  const [ orcParc, setOrcParc ] = useState([])
  const [ productSales, setProductSales ] = useState([])
  const [ sendProduct, setSendProduct ] = useState([])
  const [ openObs, setOpenObs ] = useState(false)
  const [ obs, setObs ] = useState('')
  const { setOpen: setOpenAlert, setChildrenError, setType } = useModalAlert()

  const { cod } = JSON.parse(getLoja())
  const { ID: USER_ID } = JSON.parse(getUser())
  

  useEffect(()=>{
    api.get(`${cod}/vendas/${item.CODIGOVENDA}`)
      .then( resp => {
        setProductSales(resp.data.products)
        console.log(item)
        setOrcParc(resp.data.orcparc)
      })
      .catch( err => {
        setChildrenError("Falha ao buscar produtos da venda!")
        setOpenAlert()
        setType()
        console.log(err)
      })
  },[ cod, item, setChildrenError, setOpenAlert, setType ])

  const putProduct = (e, product) => {
    product['gift'] =  false
    if(e.target.checked){
      setSendProduct([...sendProduct, product])
    } else {
      setSendProduct(sendProduct.filter(item => item.codproduto !== product.codproduto))
    }
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
        
        data.create && setEmissao(date)
        
        setModal([])
        setSendProduct([])
      } else {
        if (sendProduct.length === 0) {
          setChildrenError('Selecione um produto')
        } else if (!validateObs(obs, openObs)){
          setChildrenError('Coloque uma observação ou desabilite o checkbox de observação')
        }
        setOpenAlert()
        setType()
      }
    } catch (error) {
      console.log(error)

      setChildrenError('Erro ao enviar venda, entre em contato com Administrador')
      setOpenAlert()
      setType()
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
                <th>Enviar? / Brinde?</th>
                <th>Satus</th>
              </tr>
            </thead>
            <tbody>
            {productSales.map(product => (
              <tr key={product.CODPRODUTO}>
                <td>{product.ALTERNATI}</td>
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
                  sendProduct={sendProduct}
                />
                <td>{
                  !product.STATUS
                    ? <div style={{color: 'var(--red)'}}>Pendente</div>
                    : <div style={{color: 'var(--green)'}}>{product.STATUS}</div>
                }</td>
              </tr>
            ))}
            </tbody>
          </table>
        
        </div>
      </div>
    </div>
  )
}