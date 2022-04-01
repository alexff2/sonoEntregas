import React, { useEffect, useState } from "react"
import { AiOutlineSearch } from 'react-icons/ai'
import './style.css'

import { useMaintenance } from '../../../context/mainContext'
import { useModalAlert } from '../../../context/modalAlertContext'
import api from '../../../services/api'
import { dateSqlToReact } from '../../../functions/getDate'
import { getLoja } from '../../../services/auth'
import Status from "../../../components/Status"
import ModalMain from "./ModalMain"
import Modal from "../../../components/Modal"

export default function TabSaleSeach() {
  const [ openModalMain, setOpenModalMain ] = useState('')
  const [ mainModal, setMainModal ] = useState('')
  const [ search, setSearch ] = useState('')
  const [ typeSeach, setTypeSeach ] = useState('STATUS')
  const [ typesStatus, setTypesStatus ] = useState('open')
  const { maintenance, setMaintenance } = useMaintenance()
  const { setChildrenError, setOpen: setOpenModalAlert, setType } = useModalAlert()

  const { cod: Codloja } = JSON.parse(getLoja())

  useEffect(()=>{
    api
      .get(`maintenance/${Codloja}`)
      .then(resp => {
        if(resp.data){
          setMaintenance(resp.data)
        }
      })
      .catch(e => {
        setChildrenError('Erro ao comunicar com servidor')
        setOpenModalAlert(true)
        setType('error')
        console.log(e)
      })
  },[Codloja, setMaintenance,setChildrenError, setOpenModalAlert, setType])

  const styleStatus = status => {
    const params = { status, type: 1, color: 1}
    
    status === 'Enviado' && (params.color = 3)
    status === 'Em lançamento' && (params.color = 0)
    status === 'Em deslocamento' && (params.color = 2)
    status === 'Finalizada' && (params.color = 1)

    return params
  }

  const searchSales = async () => {
    try {
      var resp

      if (typeSeach === 'STATUS' && typesStatus === 'open') {
        resp = await api.get(`maintenance/${Codloja}`)
      } else {
        if (search !== '') {
          resp = await api.get(`maintenance/${typeSeach}/${search}/${Codloja}`)
        } else {
          setType('error')
          setOpenModalAlert(true)
          setChildrenError('Preencha o campo de pesquisa!') 
          return
        }
      }

      if (resp.data.length === 0){
        setType('error')
        setOpenModalAlert(true)
        setChildrenError('Assistência(s) não encontrada(s)!') 
      } else {
        setMaintenance(resp.data)
      }
    } catch (e) {
      console.log(e)
      setType('error')
      setOpenModalAlert(true)
      setChildrenError("Erro ao comunicar com o Servidor")
      setMaintenance([])
    }
  }

  const modalMain = main => {
    setMainModal(main)
    setOpenModalMain(true)
  }

  const cancelSubmitMain = async id => {
    try {
      const { data } = await api.put(`maintenance/${id}`)
      if (data.sucess) {
        setMaintenance(maintenance.filter(main => main.ID !== id))
        setType('sucess')
        setChildrenError(data.sucess)
        setOpenModalAlert(true)
      } else {
        console.log(data)
      }
    } catch (e) {
      console.log(e)
      setType('error')
      setChildrenError("Erro ao comunicar com o Servidor")
      setOpenModalAlert(true)
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
              onChange={e => setTypesStatus(e.target.value)}
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
                <th className="cod">Cód. Assis.</th>
                <th className="cod">Cód. Venda</th>
                <th>Cliente</th>
                <th>Produto</th>
                <th className="date">Envio</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
            {maintenance.map( main => (
              <tr key={main.ID} onClick={e => onClickTdMain(e, main)}>
                <td>{main.ID}</td>
                <td>{main.ID_SALE}</td>
                <td>{main.NOMECLI}</td>
                <td>{main.PRODUTO}</td>
                <td>{dateSqlToReact(main.D_ENVIO)}</td>
                {
                  main.STATUS === 'Enviado'
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
        <ModalMain main={mainModal}/>
      </Modal>
    </>
  )
}

