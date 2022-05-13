import React, { useState } from 'react'

import { useModalAlert } from '../../../context/modalAlertContext'
import { useMaintenance } from '../../../context/mainContext'

import api from '../../../services/api'

export default function FinishVisit({ visit, setVisit }){
  const [block, setBlock] = useState(false)
  const [situation, setSituation] = useState(1)
  const [changeProd, setChangeProd] = useState(1)
  const [obs, setObs] = useState(1)
  const { setAlert } = useModalAlert()
  const { setMaintenance } = useMaintenance()

  const submitVisit = async e => {
    e.preventDefault()
    setBlock(true)
    try {
      const id = visit.vistiData.ID
      const { data } = await api.put(`maintvisit/finish/${id}`, {
        situation,
        changeProd,
        obs
      })

      setMaintenance(data.main)
      setVisit({vistiData: {}, finishVisit: false})
      setAlert(data.msg, 'sucess')
    } catch (error) {
      console.log(error)
      !error.response
        ? setAlert('Rede')
        : setAlert('Servidor')
    }
  }

return(<React.Fragment>
    <div className='headerVisit'>
      <div>
        <label className='labelField'>Nome do cliente: </label>
        <span>{visit.vistiData.NOMECLI}</span>
      </div>
      <div>
        <label className='labelField'>Endereço: </label>
        <span>{visit.vistiData.ENDE}</span>
      </div>
      <div>
        <label className='labelField'>Telefone: </label>
        <span>{visit.vistiData.FONE}</span>
      </div>
    </div>
    <br /><hr /><br />
    <div>
      <div>
        <label className="labelField">Situação</label>
        <select onChange={e => setSituation(parseInt(e.target.value))}>
          <option value="1">Finalizar</option>
          <option value="2">Passar para CD</option>
        </select>
      </div>
      <br /><hr /><br />
      <form onSubmit={submitVisit}>
        <div className="flexRowCenter">
          <div className="flexRowCenter marginRight">
            <label
              htmlFor="obsVisit"
              className="labelField" >
              Observação: &nbsp;
            </label>
            <textarea
              id="obsVisit"
              onChange={ e => setObs(e.target.value) } >
            </textarea>
          </div>
          {
            situation === 2 &&
            <div className="flexRowCenter">
              <label htmlFor="obsVisit" className="labelField">Trocar Produto: </label>
              <select onChange={e => setChangeProd(parseInt(e.target.value))}>
                <option value="1">Sim</option>
                <option value="2">Não</option>
              </select>
            </div>
          }
        </div>
        <div className="boxBtnBorderCiclo">
          <button
            type='submit'
            className='btnBorderCiclo bGgreen'
            disabled={block}
          >GRAVAR</button>
          <button
            type='reset'
            className='btnBorderCiclo bGred'
            disabled={block}
            onClick={() => {
              setVisit({vistiData: {}, finishVisit: false})
              setBlock(true)
            }}
          >CANCELAR</button>
        </div>
      </form>
    </div>
  </React.Fragment>)
}