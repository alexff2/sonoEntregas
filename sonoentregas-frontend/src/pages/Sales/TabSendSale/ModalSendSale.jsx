import React, { useState, useEffect } from 'react'

import LoadingCircle from '../../../components/LoadingCircle'

import api from '../../../services/api'
import { validateObs } from '../../../functions/validateFields'

import { useModalAlert } from '../../../context/modalAlertContext'
import { useAuthenticate } from '../../../context/authContext'

function SetEstoque({ product }) {
  const [ disabled, setDisabled ] = useState(true)

  const changeSendProduct = () => {
    setDisabled(!disabled)
    product.SEND = !product.SEND
  }

  return (
  <>
    {product.CD
      ? <>  
          <td>
            { process.env.REACT_APP_STOCK_BEEP === '1'
                ? product.CD.EST_BEEP
                : product.CD.EST_KARDEX
            }
          </td>
          <td>{product.CD.EST_DISPONIVEL}</td>
          <td>
            { !product.STATUS
                ?<input 
                  type="number" 
                  style={{width: 40}}
                  defaultValue={product.QUANTIDADE}
                  max={product.QUANTIDADE}
                  min={1}
                  onChange={e => product.QUANTIDADE = e.target.value}
                  disabled={!disabled}
                />
                : product.QUANTIDADE
            }
          </td>
          <td>
            {!product.STATUS &&
              <input
                type="checkbox"
                style={{marginRight: '3.8rem'}}
                onChange={ changeSendProduct }
              />
            }{!product.STATUS
                ? <input
                    type="checkbox" 
                    onChange={() => product.GIFT = !product.GIFT}
                    disabled={disabled}
                  />
                : <div style={{color: 'orange'}}>
                  {product.GIFT ? 'Brinde' : ''}
                </div>
            }
          </td>
        </> 
      : <>
          <td>{product.QUANTIDADE}</td>
          <td colSpan="3">Produto não encontrado</td>
        </>}
  </>
  )
}

export default function ModalSendSale({ 
  sale,
  setModal,
  date,
  setEmissao
 }){
  const [ loading, setLoading ] = useState(false)
  const [ orcParc, setOrcParc ] = useState([])
  const [ productSales, setProductSales ] = useState([])
  const [ openObs, setOpenObs ] = useState(false)
  const [ isWithdrawal, setIsWithdrawal ] = useState(false)
  const [ disableButton, setDisableButton] = useState(false)
  const [ obs, setObs ] = useState('')
  const { setAlert } = useModalAlert()
  const { shopAuth, userAuth } = useAuthenticate()

  const { cod } = shopAuth
  const { ID: USER_ID } = userAuth

  useEffect(()=>{
    setLoading(true)

    api.get(`sales/${sale.CODIGOVENDA}/shop/${cod}/products`)
    .then( resp => {
        setProductSales(resp.data.productsSceShop)
        setOrcParc(resp.data.orcparc)
        setLoading(false)
      })

      .catch( err => {
        setAlert("Falha ao buscar produtos da venda!")
        console.log(err)
        setLoading(false)
      })
  },[ cod, sale, setAlert ])

  const submitSales = async sale => {
    const sendProduct = []

    productSales.forEach(product => {
      product.SEND && sendProduct.push(product)
    })

    try {
      setDisableButton(true)

      if(sendProduct.length > 0 && validateObs(obs, openObs)) {
        sale["products"] = sendProduct
        sale["USER_ID"] = USER_ID
        sale["orcParc"] = orcParc
        sale["OBS2"] = obs
        sale["HAVE_OBS2"] = openObs
        sale["isWithdrawal"] = isWithdrawal

        const { data } = await api.post(`salesshop/${cod}`, sale)
        
        data.create && setEmissao(date)
        
        setModal([])
      } else {
        setDisableButton(false)

        if (sendProduct.length === 0) {
          setAlert('Selecione um produto')
        } else if (!validateObs(obs, openObs)){
          setAlert('Coloque uma observação ou desabilite o checkbox de observação')
        }
      }
      
    } catch (error) {
      console.log(error)

      setAlert('Erro ao enviar venda, entre em contato com Administrador')
    }
  }

  const closeModal = e => {
    if (e.target.className === 'modal-overlaw' || e.target.className === 'cancel-modal') {
      setModal([])
      setOrcParc([])
      setProductSales([])
    }
  }

  return (
    <div 
      className="modal-overlaw" 
      key={sale.CODIGOVENDA}
      onClick={closeModal}
    >
      <div className="modal">
        <h2>Venda selecionada</h2>
        <div className="sales-modal">

          <div className="sales-head">
            <div className="sales-field">
              <div><span>N Venda: </span>{sale.CODIGOVENDA}</div>
              <div><span>Cliente: </span>{sale.NOMECLI}</div>
              <div><span>Valor: </span>{
                Intl
                  .NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'})
                  .format(sale.TOTALVENDA)
              }</div>
              
              <div>
                <span>Retirada?</span>
                <input type="checkbox" onChange={() => setIsWithdrawal(!isWithdrawal)}/>
                <div className="divObsCkeck">
                  <span>Observação?</span>
                  <input type="checkbox" onChange={() => setOpenObs(!openObs)}/>
                </div>
                { openObs && <textarea
                                cols={60}
                                onChange={e => setObs(e.target.value)}
                                ></textarea>
                }
              </div>
            </div>

            <div className="sales-buttons">
              <button className="cancel-modal">Cancelar</button>

              <button
                disabled={disableButton}
                onClick={() => submitSales(sale)}
              >Enviar</button>
            </div> 
          </div>

          {loading 
          ?
            <div className='loadingTable' >
              <LoadingCircle/>
            </div>
          : 
            <table className="table-modal-product">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Descrição</th>
                  <th>Valor</th>
                  <th>Estoque</th>
                  <th>Disponível</th>
                  <th>Qtd</th>
                  <th>Enviar? / Premiação?</th>
                  <th>Status</th>
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
                  <SetEstoque product={product} />
                  <td>{
                    !product.STATUS
                      ? <div style={{color: 'var(--red)'}}>Pendente</div>
                      : <div style={{color: 'var(--green)'}}>{product.STATUS}</div>
                  }</td>
                </tr>
              ))}
              </tbody>
            </table>
          }
        </div>
      </div>
    </div>
  )
}