import React, { useState, useEffect } from 'react'
import api from '../../../services/api'
import './style.css'

import { useAlert } from '../../../context/alertContext'

import { getDateBr } from '../../../functions/getDates'

const CheckFinishStatus = ({ main, datePrevMain }) => {
  const [ status, setStatus ] = useState({})

  useEffect(()=>{
    if (main.D_MAINTENANCE) {
      if(main.DONE) {
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
  },[main])

  return (
    <div style={{color: status.color}}>
      <div className="statusFig">
        <div className="startCircle">
          <div style={{ backgroundColor: status.color }}></div>
        </div>
      </div>

      <div className="detalsStatus">
        <div className="statusCurrent">{status.msg}</div>
        <div className="statusDate">{main.D_MAINTENANCE ? getDateBr(main.D_MAINTENANCE) : getDateBr(datePrevMain)}</div>
      </div>
    </div>
  )
}

export default function ModalMain({ main }) {
  const [mainAttempt, setMainAttempt] = useState([])
  const { setOpen, setChildrenModal } = useAlert()

  useEffect(()=>{
    api.get(`maintenanceattempt/${main.ID}`)
      .then(resp => setMainAttempt(resp.data))
      .catch(error => {
        console.log(error)
        setOpen(true)
        setChildrenModal('Erro ao comunicar com servidor, entre em contato com ADM!')
      })
  },[main, setChildrenModal, setOpen])

  return (
    <div>
      <div className="headerModal">
        <h2>DAV <span>#{main.ID_SALE}</span></h2>
        <h1>Detalhes da Assistência <span> - {main.ID}</span></h1>
      </div>
      
      <div className="content">
        <div className="infoDav">
          <div className="infoMain">
            <div>
              <div className="info"><label>Cliente: </label>{main.NOMECLI}</div>
              <div className="info"><label>Produto: </label>{main.PRODUTO}</div>
              {mainAttempt.length > 0 &&
                <div className="info">
                  <label>Trocar Produto? </label>
                  {mainAttempt[0].CHANGE_PRODUCT 
                    ? <span className='replTrue'>Sim</span> 
                    : <span className='replFalse'>Não</span>
                  }
                </div>
              }
            </div>

            <div>
              <div className="info"><label>Status: </label>{main.STATUS}</div>
              {mainAttempt.length > 0 && 
                <>
                <div className="info">
                  <label>Motorista: </label>
                  {mainAttempt[0].DRIVER}
                </div>
                <div className="info">
                  <label>Auxiliar: </label>
                  {mainAttempt[0].ASSISTANT}
                </div>
                </>
              }
            </div>
          </div>

          <hr style={{margin: '0.5rem 0'}} />

          <div className="info"><label>Endereço: </label>{main.ENDE}</div>
          <div className="info"><label>Obs: </label>{main.OBS}</div>
        </div>

        <div className="status">
          <div className="devTitleStatus">Status da Assistência</div>

          { mainAttempt.length === 0 &&
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
                <div className="statusDate">{getDateBr(main.D_ENVIO)}</div>
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

            <CheckFinishStatus main={{}} datePrevMain={main.D_PREV}/>
          </div>}

          {mainAttempt.map( mainAtt => (
          <div className="statusBar" key={mainAtt.ID}>
            <div style={{color: 'blue'}}>
              <div className="statusFig">
                <div className="startCircle">
                  <div style={{backgroundColor: 'blue'}}></div>
                </div>
                <div className="bar" style={ mainAtt.D_MOUNTING ? {backgroundColor: 'blue'} : {backgroundColor: '#91949c'}}></div>
              </div>

              <div className="detalsStatus">
                <div className="statusCurrent">Enviado</div>
                <div className="statusDate">{getDateBr(main.D_ENVIO)}</div>
              </div>
            </div>
            
            <div style={ mainAtt.D_MOUNTING ? {color: 'blue'} : {}}>
              <div className="statusFig">
                <div className="startCircle">
                  <div style={ mainAtt.D_MOUNTING ? {backgroundColor: 'blue'} : {backgroundColor: '#91949c'}}></div>
                </div>
                <div className="bar" style={ mainAtt.D_PROCESS ? {backgroundColor: 'blue'} : {backgroundColor: '#91949c'}}></div>
              </div>

              <div className="detalsStatus">
                <div className="statusCurrent">Carregando</div>
                <div className="statusDate">{mainAtt.D_MOUNTING ? getDateBr(mainAtt.D_MOUNTING) : ''}</div>
              </div>
            </div>
            
            <div style={ mainAtt.D_PROCESS ? {color: 'blue'} : {}}>
              <div className="statusFig">
                <div className="startCircle">
                  <div style={ mainAtt.D_PROCESS ? {backgroundColor: 'blue'} : {backgroundColor: '#91949c'}}></div>
                </div>
                <div className="bar" style={ mainAtt.D_MAINTENANCE ? {backgroundColor: 'blue'} : {backgroundColor: '#91949c'}}></div>
              </div>

              <div className="detalsStatus">
                <div className="statusCurrent">Entregando</div>
                <div className="statusDate">{mainAtt.D_PROCESS ? getDateBr(mainAtt.D_PROCESS) : ''}</div>
              </div>
            </div>
            
            <CheckFinishStatus main={mainAtt} datePrevMain={main.D_PREV}/>
          </div>))}
        </div>
      </div>
    </div>
  );
}
