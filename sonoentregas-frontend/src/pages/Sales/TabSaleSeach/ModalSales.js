import React, { useState, useEffect } from 'react'
import './style.css'

import api from '../../../services/api'
import { dateSqlToReact } from '../../../functions/getDate'

function ModalSales({ sale, product }) {
  const [ dateLoading, setDateLoading ] = useState(false)
  const [ dateStartDeliv, setDateStartDeliv ] = useState(false)
  const [ dateFinishDeliv, setDateFinishDeliv ] = useState(false)
  const [ datePrevDeliv, setDatePrevDeliv ] = useState('')
  const [ detalsDeliv, setDetalsDeliv ] = useState({})

  useEffect(()=>{
    api.get(`salesProdct/${sale.ID_SALES}/${sale.CODLOJA}/${product.CODPRODUTO}`)
      .then(resp => {
        setDatePrevDeliv(dateSqlToReact(sale.D_ENTREGA1))
        if (!resp.data) {
          setDateLoading(false)
          setDateStartDeliv(false)
          setDateFinishDeliv(false)
        } else {
          setDateLoading(resp.data.products[0].D_MOUNTING)
          setDateStartDeliv(resp.data.products[0].D_DELIVERING)
          setDateFinishDeliv(resp.data.products[0].D_DELIVERED)
          setDetalsDeliv(resp.data.delivery[0])
        }
      })
  },[sale, product])

  return (
    
      <div>
        <div className="headerModal">
          <h2>DAV <span>#{sale.ID_SALES}</span></h2>
          <h1>Detalhes da entrega</h1>
        </div>
        
        <div className="content">
          <div className="infoDav">
            <h3 className="titleContent">Informações da DAV</h3>
            <div className="info"><label>Data do envio ao CD: </label>{dateSqlToReact(sale.D_ENVIO)}</div>
            <div className="info"><label>Vendedor: </label>{sale.VENDEDOR}</div>
            <div className="info"><label>Status da entrega: </label>{product.STATUS}</div>
          </div>

          <div className="status">
            <div className="devTitleStatus">Status da Entrega</div>
            
            <div className="statusBar">
              <div style={{color: 'blue'}}>
                <div className="statusFig">
                  <div className="startCircle">
                    <div style={{backgroundColor: 'blue'}}></div>
                  </div>
                  <div className="bar" style={ dateLoading ? {backgroundColor: 'blue'} : {backgroundColor: '#91949c'}}></div>
                </div>

                <div className="detalsStatus">
                  <div className="statusCurrent">Enviado</div>
                  <div className="statusDate">{dateSqlToReact(sale.D_ENVIO)}</div>
                </div>
              </div>
              
              <div style={ dateLoading ? {color: 'blue'} : {}}>
                <div className="statusFig">
                  <div className="startCircle">
                    <div style={ dateLoading ? {backgroundColor: 'blue'} : {backgroundColor: '#91949c'}}></div>
                  </div>
                  <div className="bar" style={ dateStartDeliv ? {backgroundColor: 'blue'} : {backgroundColor: '#91949c'}}></div>
                </div>

                <div className="detalsStatus">
                  <div className="statusCurrent">Carregando</div>
                  <div className="statusDate">{dateLoading ? dateSqlToReact(dateLoading) : ''}</div>
                </div>
              </div>
              
              <div style={ dateStartDeliv ? {color: 'blue'} : {}}>
                <div className="statusFig">
                  <div className="startCircle">
                    <div style={ dateStartDeliv ? {backgroundColor: 'blue'} : {backgroundColor: '#91949c'}}></div>
                  </div>
                  <div className="bar" style={ dateFinishDeliv ? {backgroundColor: 'blue'} : {backgroundColor: '#91949c'}}></div>
                </div>

                <div className="detalsStatus">
                  <div className="statusCurrent">Entregando</div>
                  <div className="statusDate">{dateStartDeliv ? dateSqlToReact(dateStartDeliv) : ''}</div>
                </div>
              </div>
              
              <div style={ dateFinishDeliv ? {color: 'blue'} : {}}>
                <div className="statusFig">
                  <div className="startCircle">
                    <div style={ dateFinishDeliv ? {backgroundColor: 'blue'} : {backgroundColor: '#91949c'}}></div>
                  </div>
                </div>

                <div className="detalsStatus">
                  <div className="statusCurrent">{dateFinishDeliv ? 'Finalizada' : 'Previsto para:'}</div>
                  <div className="statusDate">{dateFinishDeliv ? dateSqlToReact(dateFinishDeliv) : datePrevDeliv}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="dataDelivery">
            <h3 className="titleContent">Dados da Entrega</h3>
            <div className="dataDeliveryContent">
              <div className="deliveryAdress ">
                <div>{sale.ENDERECO+' - '+sale.NUMERO}</div>
                <div>{sale.BAIRRO+', '+ sale.CIDADE+' - '+sale.ESTADO}</div>
              </div>
              <div className="deliveryTransport">
              <div><label>Rota: </label>{detalsDeliv.DESCRIPTION}</div>
              <div><label>Motorista: </label>{detalsDeliv.DRIVER}</div>
              <div><label>Auxiliar: </label>{detalsDeliv.ASSISTANT}</div>
              </div>
            </div>
          </div>

          <div className="products">
            <h3 className="titleContent">Produtos</h3>
            <table>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Descrição</th>
                  <th>Quantidade</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{product.COD_ORIGINAL}</td>
                  <td>{product.DESCRICAO}</td>
                  <td>{product.QTD_DELIV}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

  );
}

export default ModalSales;
