import React, { useEffect, useState } from "react"
import { AiOutlineSearch } from 'react-icons/ai'
import '../style.css'

import { useMaintenance } from '../../../context/maintContext'
import { useModalAlert } from '../../../context/modalAlertContext'
import { useAuthenticate } from '../../../context/authContext'
import api from '../../../services/api'
import { dateSqlToReact } from '../../../functions/getDate'
import Status from "../../../components/Status"
import ModalMain from "./ModalMain"
import Modal from "../../../components/Modal"

export default function TabSeachMain() {
  const [ openModalMain, setOpenModalMain ] = useState(false)
  const [ mainModal, setMainModal ] = useState('')
  const [ search, setSearch ] = useState('')
  const [ typeSeach, setTypeSeach ] = useState('STATUS')
  const [ typesStatus, setTypesStatus ] = useState('open')
  const [ maintThis, setMaintThis ] = useState([])
  const { maintenance, setMaintenance } = useMaintenance()
  const { shopAuth } = useAuthenticate()
  const { setAlert } = useModalAlert()

  const { cod: CodLoja } = shopAuth

  useEffect(()=>{
    setMaintThis(maintenance.filter(main => main.CODLOJA === CodLoja))
  },[maintenance, CodLoja])

  const styleStatus = status => {
    const params = { status, type: 1, color: 1}
    
    status === 'Enviado' && (params.color = 3)
    status === 'Em lançamento' && (params.color = 0)
    status === 'Em deslocamento' && (params.color = 2)
    status === 'No CD' && (params.color = 0)
    status === 'Finalizada' && (params.color = 1)

    return params
  }

  const searchMain = async () => {
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
    } catch (e) {
      console.log(e)
      setAlert("Erro ao comunicar com o Servidor")
      setMaintenance([])
    }
  }

  const modalMain = main => {
    setMainModal(main)
    setOpenModalMain(true)
  }

  const cancelSubmitMain = async id => {
    try {
      const { data } = await api.delete(`maintenance/${id}`)
      if (data.sucess) {
        setMaintenance(maintenance.filter(main => main.ID !== id))
        setAlert(data.sucess, 'sucess')
      } else {
        console.log(data)
      }
    } catch (e) {
      console.log(e)
      setAlert('Servidor')
    }
  }

  const onClickTdMain = (e, main) => {
    e.target.id === 'btnCancel'
      ? cancelSubmitMain(main.ID)
      : modalMain(main)
  }

  return(
    <>
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
                setSearch(e.target.value) 
                setTypesStatus(e.target.value)
              }}
            >
              <option value={'open'}>Abertas</option>
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
                onKeyPress={e => e.key === 'Enter' ? searchMain() : null}
                value={search}
              />
            </div>
          }

        <button onClick={searchMain}>PESQUISAR</button>
      </div>

      {/*Tabela de assistência*/}
      <div>
        {maintThis.length !== 0
          ?<table className="tableWithoutBordRad tableMain">
            <thead>
              <tr>
                <th className="cod">Cód. Assis.</th>
                <th className="cod">Cód. Venda</th>
                <th>Cliente</th>
                <th>Produto</th>
                <th className="date">Envio</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
            {maintThis.map( main => (
              <tr key={main.ID} onClick={e => onClickTdMain(e, main)}>
                <td>{main.ID}</td>
                <td>{main.ID_SALE}</td>
                <td>{main.NOMECLI}</td>
                <td>{main.PRODUTO}</td>
                <td>{dateSqlToReact(main.D_ENVIO)}</td>
                {
                  main.STATUS === 'Aguardando'
                    ? <td id="btnCancel">Cancelar</td>
                    : <td id="status"><Status params={styleStatus(main.STATUS)}/></td>
                }
              </tr>
            ))}
            </tbody>
          </table>
          : <div style={{ color: 'var(--red)', marginTop: '1rem' }}>Assistências não encontradas!.</div>
        }
      </div>

      <Modal
        openModal={openModalMain}
        setOpenModal={setOpenModalMain}
      >
        <ModalMain maint={mainModal}/>
      </Modal>
    </>
  )
}

