import React, { useState, useEffect } from 'react'
import './style.css'

import api from '../../services/api'
import { getDateBr } from '../../functions/getDates'

const CheckFinishStatus = ({ prod, datePrevDeliv }) => {
  const [ status, setStatus ] = useState({})

  useEffect(()=>{
    if (prod.D_DELIVERED) {
      if(!prod.DELIVERED) {
        setStatus({
          msg: 'Finalizada',
          color: 'blue'
        })
      } else {
        setStatus({
          msg: 'Retorno',
          color: 'red'
        })
      }
    } else {
      setStatus({
        msg: 'Previsto para:',
        color: '#91949c'
      })
    }
  },[prod])

  return (
    <div style={{color: status.color}}>
      <div className="statusFig">
        <div className="startCircle">
          <div style={ {backgroundColor: status.color}}></div>
        </div>
      </div>

      <div className="detalsStatus">
        <div className="statusCurrent">{status.msg}</div>
        <div className="statusDate">{prod.D_DELIVERED ? getDateBr(prod.D_DELIVERED) : datePrevDeliv}</div>
      </div>
    </div>
  )
}

function ModalSales({ sale, product }) {
  const [ datePrevDeliv, setDatePrevDeliv ] = useState('')
  const [ prodsDetails, setProdsDetails] = useState([])
  const [ detailsDeliv, setDetailsDeliv ] = useState({})

  useEffect(()=>{
    api.get(`salesProdct/${sale.ID_SALES}/${sale.CODLOJA}/${product.CODPRODUTO}`)
      .then(resp => {
        setDatePrevDeliv(getDateBr(sale.D_ENTREGA1))
        if (!resp.data) {
          setProdsDetails([])
        } else {
          setProdsDetails(resp.data.products)
          setDetailsDeliv(resp.data.delivery[0])
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
            <div className="info"><label>Data do envio ao CD: </label>{getDateBr(sale.D_ENVIO)}</div>
            <div className="info"><label>Vendedor: </label>{sale.VENDEDOR}</div>
            <div className="info"><label>Status da entrega: </label>{product.STATUS}</div>
          </div>

          <div className="status">
            <div className="devTitleStatus">Status da Entrega</div>
            
            {prodsDetails.length === 0 &&
            <div className="statusBar">
              <div style={{color: 'blue'}}>
                <div className="statusFig">
                  <div className="startCircle">
                    <div style={{backgroundColor: 'blue'}}></div>
                  </div>
                  <div className="bar" style={{backgroundColor: '#91949c'}}></div>
                </div>

                <div className="detalsStatus">
                  <div className="statusCurrent">Enviado</div>
                  <div className="statusDate">{getDateBr(sale.D_ENVIO)}</div>
                </div>
              </div>
              
              <div>
                <div className="statusFig">
                  <div className="startCircle">
                    <div style={{backgroundColor: '#91949c'}}></div>
                  </div>
                  <div className="bar" style={{backgroundColor: '#91949c'}}></div>
                </div>

                <div className="detalsStatus">
                  <div className="statusCurrent">Carregando</div>
                  <div className="statusDate"></div>
                </div>
              </div>
              
              <div>
                <div className="statusFig">
                  <div className="startCircle">
                    <div style={{backgroundColor: '#91949c'}}></div>
                  </div>
                  <div className="bar" style={{backgroundColor: '#91949c'}}></div>
                </div>

                <div className="detalsStatus">
                  <div className="statusCurrent">Entregando</div>
                  <div className="statusDate"></div>
                </div>
              </div>
              
              <CheckFinishStatus prod={{}} datePrevDeliv={datePrevDeliv}/>
            </div>
            }
            {prodsDetails.map((prod,i) =>(
            <div className="statusBar" key={i}>
              <div style={{color: 'blue'}}>
                <div className="statusFig">
                  <div className="startCircle">
                    <div style={{backgroundColor: 'blue'}}></div>
                  </div>
                  <div className="bar" style={ prod.D_MOUNTING ? {backgroundColor: 'blue'} : {backgroundColor: '#91949c'}}></div>
                </div>

                <div className="detalsStatus">
                  <div className="statusCurrent">Enviado</div>
                  <div className="statusDate">{getDateBr(sale.D_ENVIO)}</div>
                </div>
              </div>
              
              <div style={ prod.D_MOUNTING ? {color: 'blue'} : {}}>
                <div className="statusFig">
                  <div className="startCircle">
                    <div style={ prod.D_MOUNTING ? {backgroundColor: 'blue'} : {backgroundColor: '#91949c'}}></div>
                  </div>
                  <div className="bar" style={ prod.D_DELIVERING ? {backgroundColor: 'blue'} : {backgroundColor: '#91949c'}}></div>
                </div>

                <div className="detalsStatus">
                  <div className="statusCurrent">Carregando</div>
                  <div className="statusDate">{prod.D_MOUNTING ? getDateBr(prod.D_MOUNTING) : ''}</div>
                </div>
              </div>
              
              <div style={ prod.D_DELIVERING ? {color: 'blue'} : {}}>
                <div className="statusFig">
                  <div className="startCircle">
                    <div style={ prod.D_DELIVERING ? {backgroundColor: 'blue'} : {backgroundColor: '#91949c'}}></div>
                  </div>
                  <div className="bar" style={ prod.D_DELIVERED ? {backgroundColor: 'blue'} : {backgroundColor: '#91949c'}}></div>
                </div>

                <div className="detalsStatus">
                  <div className="statusCurrent">Entregando</div>
                  <div className="statusDate">{prod.D_DELIVERING ? getDateBr(prod.D_DELIVERING) : ''}</div>
                </div>
              </div>
              
              <CheckFinishStatus prod={prod} datePrevDeliv={datePrevDeliv}/>
            </div>
            ))}
          </div>

          <div className="dataDelivery">
            <h3 className="titleContent">Dados da Entrega</h3>
            <div className="dataDeliveryContent">
              <div className="deliveryAdress ">
                <div>{sale.ENDERECO+' - '+sale.NUMERO}</div>
                <div>{sale.BAIRRO+', '+ sale.CIDADE+' - '+sale.ESTADO}</div>
              </div>
              <div className="deliveryTransport">
              <div><label>Rota: </label>{detailsDeliv.ID} - {detailsDeliv.DESCRIPTION}</div>
              <div><label>Motorista: </label>{detailsDeliv.DRIVER}</div>
              <div><label>Auxiliar: </label>{detailsDeliv.ASSISTANT}</div>
              </div>
            </div>
          </div>

          <div className="products">
            <h3 className="titleContent">Retornos</h3>
            <table>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Rota</th>
                  <th>Motivos</th>
                </tr>
              </thead>
              <tbody>
                {
                prodsDetails
                  .filter( prod => prod.DELIVERED)
                  .map((prod, i) => (
                    <tr key={i}>
                      <td>{getDateBr(prod.D_DELIVERED)}</td>
                      <td>{prod.REASON_RETURN}</td>
                      <td>{prod.REASON_RETURN}</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>

  );
}

export default ModalSales;
