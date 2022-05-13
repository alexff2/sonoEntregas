import React, { useState, useEffect } from 'react'
import api from '../../../services/api'
import './style.css'

import { useAlert } from '../../../context/alertContext'

import { getDateBr } from '../../../functions/getDates'

const CheckFinishStatus = ({ maintDeliv, datePrevMaint }) => {
  const [ status, setStatus ] = useState({})

  useEffect(()=>{
    if (maintDeliv.D_DELIVERED) {
      if(maintDeliv.DONE) {
        setStatus({
          msg: 'Finalizada',
          color: 'blue'
        })
      } else {
        setStatus({
          msg: 'Não realizada',
          color: 'red'
        })
      }
    } else {
      setStatus({
        msg: 'Previsto para:',
        color: '#91949c'
      })
    }
  },[maintDeliv])

  return (
    <div style={{color: status.color}}>
      <div className="statusFig">
        <div className="startCircle">
          <div style={{ backgroundColor: status.color }}></div>
        </div>
      </div>

      <div className="detalsStatus">
        <div className="statusCurrent">{status.msg}</div>
        <div className="statusDate">{maintDeliv.D_DELIVERED ? getDateBr(maintDeliv.D_DELIVERED) : getDateBr(datePrevMaint)}</div>
      </div>
    </div>
  )
}

export default function ModalMain({ maint }) {
  const [maintDelivs, setMaintDelivs] = useState([])
  const { setOpen, setChildrenModal } = useAlert()

  useEffect(()=>{
    api.get(`maintenancedeliv/${maint.ID}`)
      .then(resp => setMaintDelivs(resp.data))
      .catch(error => {
        console.log(error)
        setOpen(true)
        setChildrenModal('Erro ao comunicar com servidor, entre em contato com ADM!')
      })
  },[maint, setChildrenModal, setOpen])

  return (
    <div>
      <div className="headerModal">
        <h2>DAV <span>#{maint.ID_SALE}</span></h2>
        <h1>Detalhes da Assistência <span> - {maint.ID}</span></h1>
      </div>
      
      <div className="content maint">
        <div className="infoDav">
          <div className="infoMain">
            <div>
              <div className="info"><label>Cliente: </label>{maint.NOMECLI}</div>
              <div className="info">
                <label>Produto: </label>{maint.COD_ORIGINAL+' - '+maint.PRODUTO}
              </div>
              {maintDelivs.length > 0 &&
                <div className="info">
                  <label>Trocar Produto? </label>
                  {maint.CHANGE_PRODUCT 
                    ? <span className='replTrue'>Sim</span> 
                    : <span className='replFalse'>Não</span>
                  }
                </div>
              }
            </div>

            <div>
              <div className="info"><label>Status: </label>{maint.STATUS}</div>
              {maintDelivs.length > 0 && 
                <>
                <div className="info">
                  <label>Motorista: </label>
                  {maintDelivs[maintDelivs.length - 1].DRIVER}
                </div>
                <div className="info">
                  <label>Auxiliar: </label>
                  {maintDelivs[maintDelivs.length - 1].ASSISTANT}
                </div>
                </>
              }
            </div>
          </div>

          <hr style={{margin: '0.5rem 0'}} />

          <div className="info"><label>Endereço: </label>{maint.ENDE}</div>
          <div className="info"><label>Obs: </label>{maint.OBS}</div>
          <div className="info">
            <label>Defeito reclamado: </label>{maint.CAT_DEFECT}
          </div>
          <div className="info">
            <label>Em Garantia? </label>
            {maint.WARRANTY 
              ? <span className='replTrue'>Sim</span> 
              : <span className='replFalse'>Não</span>
            }
          </div>
          <div className="info"><label>Aberta por: </label>{maint.USERS}</div>
        </div>

        <div className="status">
          <div className="devTitleStatus">Status da Assistência</div>

          { maintDelivs.length === 0 &&
          <div className="statusBar">
            <div style={{color: 'blue'}}>
              <div className="statusFig">
                <div className="startCircle">
                  <div style={{backgroundColor: 'blue'}}></div>
                </div>
                <div className="bar" style={{backgroundColor: '#91949c'}}></div>
              </div>

              <div className="detalsStatus">
                <div className="statusCurrent">No Cd</div>
                <div className="statusDate">{getDateBr(maint.D_ENVIO)}</div>
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
                <div className="statusCurrent">Preparando</div>
                <div className="statusDate">{''}</div>
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
                <div className="statusCurrent">Em Processo</div>
                <div className="statusDate">{''}</div>
              </div>
            </div>

            <CheckFinishStatus maintDeliv={{}} datePrevMaint={maint.D_PREV}/>
          </div>}

          {maintDelivs.map( maintDeliv => (
          <div className="statusBar" key={maintDeliv.ID}>
            <div style={{color: 'blue'}}>
              <div className="statusFig">
                <div className="startCircle">
                  <div style={{backgroundColor: 'blue'}}></div>
                </div>
                <div className="bar" style={ maintDeliv.D_MOUNTING ? {backgroundColor: 'blue'} : {backgroundColor: '#91949c'}}></div>
              </div>

              <div className="detalsStatus">
                <div className="statusCurrent">No Cd</div>
                <div className="statusDate">{getDateBr(maint.D_ENVIO)}</div>
              </div>
            </div>
            
            <div style={ maintDeliv.D_MOUNTING ? {color: 'blue'} : {}}>
              <div className="statusFig">
                <div className="startCircle">
                  <div style={ maintDeliv.D_MOUNTING ? {backgroundColor: 'blue'} : {backgroundColor: '#91949c'}}></div>
                </div>
                <div className="bar" style={ maintDeliv.D_DELIVING ? {backgroundColor: 'blue'} : {backgroundColor: '#91949c'}}></div>
              </div>

              <div className="detalsStatus">
                <div className="statusCurrent">Carregando</div>
                <div className="statusDate">{maintDeliv.D_MOUNTING ? getDateBr(maintDeliv.D_MOUNTING) : ''}</div>
              </div>
            </div>
            
            <div style={ maintDeliv.D_DELIVING ? {color: 'blue'} : {}}>
              <div className="statusFig">
                <div className="startCircle">
                  <div style={ maintDeliv.D_DELIVING ? {backgroundColor: 'blue'} : {backgroundColor: '#91949c'}}></div>
                </div>
                <div className="bar" style={ maintDeliv.D_DELIVERED ? {backgroundColor: 'blue'} : {backgroundColor: '#91949c'}}></div>
              </div>

              <div className="detalsStatus">
                <div className="statusCurrent">Entregando</div>
                <div className="statusDate">{maintDeliv.D_DELIVING ? getDateBr(maintDeliv.D_DELIVING) : ''}</div>
              </div>
            </div>
            
            <CheckFinishStatus maintDeliv={maintDeliv} datePrevMaint={maint.D_PREV}/>
          </div>))}
        </div>
      </div>
    </div>
  );
}
