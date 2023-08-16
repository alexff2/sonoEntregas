import React, { useState, useEffect } from "react"
import { AiOutlineSearch, AiOutlineArrowDown, AiOutlineArrowUp } from 'react-icons/ai'

import Modal from "../../../components/Modal"
import ModaCreate from "./ModalCreate"
import LoadingCircle from "../../../components/LoadingCircle"

import { useModalAlert } from "../../../context/modalAlertContext"
import api from '../../../services/api'
import { toLocString } from '../../../functions/toLocString'

const Goals = ({ goal }) => {
  const [ open, setOpen ] = useState(false)
  const [ amountReached, setAmountReached ] = useState(goal.amountReached)
  const [ amountReturns, setAmountReturns ] = useState(goal.amountReturns)
  const { setAlert } = useModalAlert()

  const getAmountReached = async () => {
    try {
      setOpen(true)
      const { data } = await api.get('/goals/getAmount', {
        params: {
          idShop: goal.idShop,
          monthYear: goal.monthYear
        }
      })
  
      setOpen(false)
      setAmountReached(data.amountReached)
      setAmountReturns(data.amountReturns)
    } catch (error) {
      setOpen(false)
      if (error.response.data.original.code === 'ETIMEOUT') {
        setAlert('Loja está inacessível nesse momento, será mantido o valor anterior!')
      }
    }
  }

  return(
    <tr>
      <td>{goal.monthYear}</td>
      <td>{toLocString(goal.value)}</td>
      <td className="amountBtn" onClick={getAmountReached}>
        {toLocString(amountReached)}
        <Modal openModal={open}>
          <div className='loadingTable'>
            <LoadingCircle/>
          </div>
        </Modal>
      </td>
      <td>{toLocString(amountReturns)}</td>
      <td>{toLocString(amountReached - amountReturns)}</td>
      <td>{toLocString(((amountReached - amountReturns)/goal.value) * 100)} %</td>
    </tr>
  )
}

const ShopsGoals = ({ shop }) => {
  const [open, setOpen] = useState(false)
    
  return (
    <>
      <tr>
        <td style={{width: 10}} onClick={() => setOpen(!open)}>
          { open ? <AiOutlineArrowUp /> : <AiOutlineArrowDown /> }
        </td>
        <td>{shop.DESCRICAO}</td>
      </tr>
      <tr>
        <td colSpan="2">
          <div className={open ? 'tabProdSeach openDiv': 'tabProdSeach'}>
            <table>
              <thead id="trProd">
                <tr>
                  <th>Mês/Ano</th>
                  <th>R$ Meta</th>
                  <th>R$ Atingido</th>
                  <th>R$ Devoluções</th>
                  <th>R$ Liquido</th>
                  <th>%</th>
                </tr>
              </thead>
              <tbody>
                {shop.goals.map(goal => (
                  <Goals goal={goal} key={goal.id}/>
                ))}
              </tbody>
            </table>
          </div>
        </td>
      </tr>
    </>
  )
}

export default function TabGoals() {
  const [ search, setSearch ] = useState('')
  const [ typeSearch, setTypeSearch ] = useState('STATUS')
  const [ typesStatus, setTypesStatus ] = useState('open')
  const [ isOpenModalCreateGoals, setIsOpenModalCreateGoals ] = useState(false)
  const [ shopsGoals, setShopsGoals ] = useState([])

  const searchGoals = async () => console.log('searchGoals')

  const getGoals = async () => {
    const response = await api.get('/goals')
    setShopsGoals(response.data)
  }

  useEffect(() => {
    getGoals()
  }, [])

  return (
    <>
      <div className="fieldsSearchSales">
        <select
          className="selectSearchSales"
          onChange={e => {
            setTypeSearch(e.target.value)
            setSearch('')
            e.target.value === 'STATUS'
              ? setTypesStatus('open')
              : setTypesStatus('')
          }}
        >
          <option value={'STATUS'}>Status</option>
          <option value={'ID_SALE'}>Código Meta</option>
          <option value={'NOMECLI'}>Descrição</option>
        </select>

          { typeSearch === 'STATUS' &&
            <select
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
            <div className="inputsSearchSales">
              <AiOutlineSearch />
                <input
                  type="date" 
                  onChange={e => setSearch(e.target.value)}
                />
            </div>
          }
          { typeSearch !== 'STATUS' && 
            <div className="inputsSearchSales">
              <AiOutlineSearch />
              <input
                type="text"
                placeholder="Pesquisar…"
                onChange={e => setSearch(e.target.value)}
                onKeyPress={e => e.key === 'Enter' ? searchGoals() : null}
                value={search}
              />
            </div>
          }

        <button onClick={searchGoals}>PESQUISAR</button>
      </div>

      {shopsGoals.length === 0
        ? <div className="red">Nenhuma meta cadastrada!</div>
        : <table className="tableSales">
            <thead>
              <tr>
                <th id="thSales-firstItem"></th>
                <th>Descrição</th>
              </tr>
            </thead>
            <tbody>
              {shopsGoals.map(shop => (
                <ShopsGoals key={shop.CODLOJA} shop={shop} />
              ))}
            </tbody>
          </table>}
      <button 
        className="circle-add"
        onClick={() => setIsOpenModalCreateGoals(true)}
      >+</button>

      <Modal
        openModal={isOpenModalCreateGoals}
        setOpenModal={setIsOpenModalCreateGoals}
      >
        <ModaCreate setIsOpenModalCreateGoals={setIsOpenModalCreateGoals} getGoals={getGoals}/>
      </Modal>
    </>
  )
}