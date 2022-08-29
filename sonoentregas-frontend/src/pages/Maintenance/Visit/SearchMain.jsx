import React, { useState } from "react"
import { AiOutlineSearch } from 'react-icons/ai'
import '../style.css'

import Modal from '../../../components/Modal'
import ModalSchedule from "./ModalSchedule"
import ReportMaint from "./ReportMaint"

import { useMaintenance } from '../../../context/maintContext'
import { useModalAlert } from '../../../context/modalAlertContext'

import api from '../../../services/api'
import { dateSqlToReact, getDateToSql } from '../../../functions/getDate'

export default function SearchMain({ setVisit }){
  const [ openModalSch, setOpenModalSch ] = useState(false)
  const [ openModalReport, setOpenModalReport ] = useState(false)
  const [ maintSelect, setMaintSelect ] = useState({})

  const [ search, setSearch ] = useState('')
  const [ typeSeach, setTypeSeach ] = useState('STATUS')
  const [ typesStatus, setTypesStatus ] = useState('open')
  const {  setAlert } = useModalAlert()

  const { maintenance, setMaintenance } = useMaintenance()

  const searchSales = async () => {
    try {
      var resp

      if (typeSeach === 'STATUS' && typesStatus === 'open') {
        resp = await api.get(`maintenance/null`)
      } else  if (typeSeach === 'STATUS' && typesStatus === 'close'){
        resp = await api.get(`maintenance/${typesStatus}/${search}/null`)
      } else {
        if (search !== '') {
          resp = await api.get(`maintenance/${typeSeach}/${search}/null`)
        } else {
          setAlert('Preencha o campo de pesquisa!') 
          return
        }
      }

      if (resp.data.length === 0){
        setAlert('Assistência(s) não encontrada(s)!') 
      } else {
        setMaintenance(resp.data)
      }
    } catch (error) {
      console.log(error)
      !error.response
          ? setAlert('Rede')
          : setAlert('Servidor')
    }
  }

  const startVisit = async ID => {
    try {
      const date = getDateToSql()
      const { data } = await api.put(`maintvisit/start/${ID}`, { date })
      setMaintenance(data)
      setAlert('Visita Iniciada!', 'sucess')
    } catch (error) {
      !error.response
        ? setAlert('Red')
        : setAlert('Servidor')
    }
  }

  const clickRowMaint = (e, maint) => {
    if(e.target.className !== 'btnActionVisit'){
      setOpenModalReport(true)
      setMaintSelect(maint)
    }
  }

  return(<React.Fragment>
    {/*Campo de busca de assistências*/}
    <div className="fieldsSearchSales">
      <select 
        name="typeSales"
        id="typeSales" 
        className="selectSearchSales"
        onChange={e => {
          setTypeSeach(e.target.value)
          setSearch('')
          e.target.value === 'STATUS'
            ? setTypesStatus('open')
            : setTypesStatus('')
        }}
      >
        <option value={'STATUS'}>Status</option>
        <option value={'ID_SALE'}>Código Venda</option>
        <option value={'NOMECLI'}>Nome Cliente</option>
      </select>

        { typeSeach === 'STATUS' &&
          <select 
            name="statusSales"
            id="statusSales" 
            className="selectSearchSales"
            onChange={e => {
              (e.target.value === 'open' || e.target.value === 'close')
                ? setSearch('')
                : setSearch(e.target.value) 
              setTypesStatus(e.target.value)
            }}
          >
            <option value={'open'}>Abertas</option>
            <option value={'Agendada'}>Agendadas</option>
            <option value={'Visitando'}>Em visita</option>
            <option value={'No CD'}>Enviado ao CD</option>
            <option value={'close'}>Finalizadas</option>
          </select>
        }
        { typesStatus === 'close' && 
          <div className="inputsSeachSales">
            <AiOutlineSearch />
              <input
                type="date" 
                onChange={e => setSearch(e.target.value)}
              />
          </div>
        }
        { typeSeach !== 'STATUS' && 
          <div className="inputsSeachSales">
            <AiOutlineSearch />
            <input
              type="text"
              placeholder="Pesquisar…"
              onChange={e => setSearch(e.target.value)}
              onKeyPress={e => e.key === 'Enter' ? searchSales() : null}
              value={search}
            />
          </div>
        }

      <button onClick={searchSales}>PESQUISAR</button>
    </div>

    {/*Tabela de assistência*/}
    <div>
      {maintenance.length !== 0
        ?<table className="tableWithoutBordRad tableMain">
          <thead>
            <tr>
              <th className="id">Código</th>
              <th className="cod">Cód. Venda</th>
              <th className="cod">Loja</th>
              <th>Cliente</th>
              <th>Produto</th>
              <th>Agendamento</th>
              <th>Visitante</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
          {maintenance.map( maint => (
            <tr
              key={maint.ID}
              onClick={e => clickRowMaint(e, maint)}
              style={{}}
            >
              <td>{maint.ID}</td>
              <td>{maint.ID_SALE}</td>
              <td>{maint.DESC_ABREV}</td>
              <td>{maint.NOMECLI}</td>
              <td>{maint.PRODUTO}</td>
              {!maint.DATE_VISIT
                ?<td className="dateSched">
                  {maint.DATE_PREV && dateSqlToReact(maint.DATE_PREV)} - {maint.HOURS_PREV}
                </td>
                : <td>{dateSqlToReact(maint.DATE_VISIT)}</td>
              }
              <td>{maint.VISITANT}</td>
              <td>
                {maint.STATUS === 'Aguardando' &&
                  <div
                    className="btnActionVisit"
                    onClick={() => {
                      setOpenModalSch(true)
                      setMaintSelect(maint)
                    }}
                  >Agendar Visita</div>
                }

                {maint.STATUS === 'Agendada' &&
                  <div
                    className="btnActionVisit sched"
                    onClick={() => startVisit(maint.ID)}
                  >Iniciar Visita</div>
                }

                {maint.STATUS === 'Visitando' &&
                  <div
                    className="btnActionVisit visit"
                    onClick={() => setVisit({vistiData: maint, finishVisit: true})}
                  >Finalizar Visita</div>
                }

                {(maint.STATUS !== 'Aguardando' && maint.STATUS !== 'Agendada' && maint.STATUS !== 'Visitando') &&
                  <div>{maint.STATUS}</div>
                }
              </td>
            </tr>
          ))}
          </tbody>
        </table>
        : <div style={{ color: 'var(--red)', marginTop: '1rem' }}>Sem assistências!.</div>
      }
    </div>

    <Modal openModal={openModalSch} setOpenModal={setOpenModalSch}>
      <ModalSchedule maintSelect={maintSelect} setOpenModalSch={setOpenModalSch}/>
    </Modal>

    <ReportMaint
      maint={maintSelect}
      openModal={openModalReport}
      setOpenModal={setOpenModalReport}
      />
  </React.Fragment>)
}