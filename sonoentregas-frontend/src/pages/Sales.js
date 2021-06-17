import React, { useEffect, useState } from 'react'

import api from '../services/api'
import { getLoja, getUser } from '../services/auth'

import '../styles/pages/sales.css'

import ModalAlert, { openMOdalAlert } from '../components/ModalAlert'

import getDate from '../functions/getDate'

function SetEstoque({codProduct}) {
  const [ product, setProduct ] = useState()

  useEffect(() => {
    api.get(`products/COD_ORIGINAL/${codProduct}`).then( resp => setProduct(resp.data[0]))
  },[codProduct])
  
  return (
  <>
    {product ? 
      <>  
        <td>{product.EST_ATUAL}</td>
        <td>{product.EST_DISPONIVEL}</td>
      </> 
      : <td>Produto não encontrado</td>
    }
  </>
  )
}


export default function Vendas(){
  const [ modal, setModal ] = useState([])
  const [ childrenAlertModal, setChildrenAlertModal ] = useState('Vazio')
  const [ sales, setSales ] = useState([])
  const [ orcParc, setOrcParc ] = useState([])
  const [ productSales, setProductSales ] = useState([])
  const [ sendProduct, setSendProduct ] = useState([])
  const [ emissao, setEmissao ] = useState()
  const [ dateEDelivery, setDateDelivery ] = useState('')
  const [ date, setDate ] = useState()

  const { cod } = JSON.parse(getLoja())
  const { ID: USER_ID } = JSON.parse(getUser())

  useEffect(() => {
    document.querySelector('#load-sales').innerHTML = 'Carregando...'

    api
      .get(`${cod}/${emissao ? emissao: getDate()}/vendas`)
      .then( resp => {
        setSales(resp.data)
        
        document.querySelector('#load-sales').innerHTML = ''
      })
      .catch( erro => {
        console.log(erro)

        setChildrenAlertModal(`Não foi possível conectar com servidor, entre em contato com admnistrador`)

        document.querySelector("#modal-over-alert").style.display = 'flex'
        
        document.querySelector('#load-sales').innerHTML = ''
    })
  }, [cod, emissao])

  const openModal = async item => {
    try {
      const { data } = await api.get(`${cod}/vendas/${item.CODIGOVENDA}`)
      
      setProductSales(data.products)

      setOrcParc(data.orcparc)
      
      setModal([item])
    } catch (error) {
      alert(error)
    }
  }

  const busca = () => {
    setEmissao(date)
  }

  const closeModal = e => {
    if (e.target.className === 'modal-overlaw' || e.target.className === 'cancel-modal') {
      setModal([])
      setSendProduct([])
      setOrcParc([])
    }
  }

  const putProduct = (e, valor) => {
    if(e.target.checked){
      setSendProduct([...sendProduct,valor])
    } else {
      setSendProduct(sendProduct.filter(item => item.codproduto !== valor.codproduto))
    }
  }

  const submitSales = async sale => {
    try {
      if(sendProduct.length > 0 && dateEDelivery !== '') {
        sale["products"] = sendProduct
        sale.USER_ID = USER_ID
        sale.D_ENTREGA1 = dateEDelivery
        sale.orcParc = orcParc

        const { data } = await api.post(`${cod}/vendas/submit`, sale)
        
        sale.STATUS = data
        
        setSales(sales.map( item => item.CODIGOVENDA === sale.CODIGOVENDA ? sale : item))
        
        setModal([])
        setSendProduct([])
      } else {
        alert('Selecione um produto')
      }
    } catch (error) {
      console.log(error)

      setChildrenAlertModal('Erro ao enviar venda, entre em contato com ADM')

      openMOdalAlert()
    }
  }

  return(
    <div className="container">

      <div className="header-container">
        <h2>VENDAS DO DIA</h2>
        <div>
          <input type="date" onChange={e => setDate(e.target.value)}/>
          <button onClick={busca}>Buscar</button>
        </div>
      </div>
      <span id="load-sales"></span>

      <div className="body-container">    
        {/*Table Sales*/}
        <table className="tab-sales">
          <thead>
            <tr>
              <th>Código</th>
              <th>Cliente</th>
              <th>Valor</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {sales.map(item =>(
              <tr 
                key={item.CODIGOVENDA} 
                onClick={!item.STATUS ? ()=> openModal(item) : null}
              >
                <td>{item.CODIGOVENDA}</td>
                <td>{item.NOMECLI}</td>
                <td>{Intl
                    .NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'})
                    .format(item.TOTALVENDA)}</td>
                <td className={ item.STATUS ? 'green' : 'red'}>
                  {item.STATUS ? item.STATUS : 'Pendente'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/*Modal send sales*/
        modal.map(item =>(
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
                      <span>Data da entrega: </span>
                      <input type="date" onChange={e => setDateDelivery(e.target.value)}/>
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
                      <th>Qtd</th>
                      <th>Valor</th>
                      <th>Estoque</th>
                      <th>Disponível</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                  {productSales.map(valor => (
                    <tr key={valor.COD_ORIGINAL}>
                      <td>{valor.COD_ORIGINAL}</td>
                      <td>{valor.DESCRICAO}</td>
                      <td>{valor.QUANTIDADE}</td>
                      <td>
                        {Intl
                          .NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'})
                          .format(valor.NVTOTAL)
                        }
                      </td>
                      <SetEstoque codProduct={valor.COD_ORIGINAL} />
                      <td><input type="checkbox" onChange={(e) => putProduct(e, valor)}/></td>
                    </tr>
                  ))}
                  </tbody>
                </table>
              
              </div>
            </div>
          </div>
        ))
        }
      </div>

      <ModalAlert>{childrenAlertModal}</ModalAlert>

    </div>
  )
}

