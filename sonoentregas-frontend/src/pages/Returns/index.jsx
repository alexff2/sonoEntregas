import React, { useEffect, useState } from 'react'
import { AiOutlineArrowDown, AiOutlineArrowUp, AiOutlineSearch } from 'react-icons/ai'

import api from '../../services/api'
import { getDateToSql } from '../../functions/getDate'
import { useModalAlert } from '../../context/modalAlertContext'
import { useBackdrop } from '../../context/backdropContext'
import Status from '../../components/Status'
import ButtonPlus from '../../components/ButtonPlus'
import Modal from '../../components/Modal'
import ReturnsToSend from './ReturnsToSend'

const Row = ({ item, cancelReturn }) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <tr>
        <td onClick={() => setOpen(!open)}>
          { open ? <AiOutlineArrowUp /> : <AiOutlineArrowDown /> }
        </td>
        <td>{item.id}</td>
        <td>{item.originalSaleId}</td>
        <td>{item.originalReturnId}</td>
        <td>{item.client}</td>
        <td>{item.dateSendToLocale}</td>
        {
          item.status === 'Pendente'
          ? <td id="btnCancel" onClick={() => cancelReturn(item)}>Cancelar</td>
          : <td><Status params={{type: 1, color: 2, status: item.status}}/></td>
        }
      </tr>

      {
        open &&
        <tr>
          <td colSpan={7} style={{padding: '0 60px'}}>
            <table>
              <thead>
                <tr>
                  <th>Cod Alt</th>
                  <th>Produto</th>
                  <th>Quantidade</th>
                </tr>
              </thead>
              <tbody>
                {item.products.map(product => (
                  <tr key={product.id}>
                    <td>{product.alternativeCode}</td>
                    <td>{product.name}</td>
                    <td>{product.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </td>
        </tr>
      }
    </>
  )
}

export default function Returns(){
  const [openModalSendReturn, setModalSendReturn] = useState(false)
  const [returns, setReturns] = useState([])
  const [typeSearch, setTypeSearch] = useState('client')
  const [search, setSearch] = useState('')

  const { setAlert } = useModalAlert()
  const { setOpen: setOpenBackdrop } = useBackdrop()

  useEffect(() => {
    const searchOpenReturns = async () => {
      setOpenBackdrop(true)
      try {
        const {data} = await api.get('returns/open')
        setReturns(data.returns)
        setOpenBackdrop(false)
      } catch (error) {
        console.log(error)
        setOpenBackdrop(false)
        
        if (!error.response) {
          setAlert('Sem comunicação com servidor!')
        }
      }
    }

    searchOpenReturns()
  }, [setAlert, setOpenBackdrop])

  const searchSalesReturn = async () => {
    try {
      if (typeof search === 'object') {
        if (search.dateStart > search.dateFinish) {
          setAlert('Data inicial maior que data final!')
          return
        } else if (search.dateStart === '' || search.dateFinish === '') {
          setAlert('Preencha as datas!')
          return
        }
      } else if (search === '') {
        setAlert('Preencha o campo de pesquisa!')
        return
      }

      setOpenBackdrop(true)
      const { data } = await api.get('/returns', {
        params: {
          typeSearch,
          search,
          dateStart: search.dateStart,
          dateFinish: search.dateFinish
        }
      })
      setReturns(data.salesReturns)
      setOpenBackdrop(false)
    } catch (error) {
      setOpenBackdrop(false)
      console.log(error.response)
      if (!error.response) {
        setAlert('rede!')
        return
      }
      setAlert('Sem evidências!')
    }
  }

  const cancelReturn = async (returnSale) => {
    try {
      setOpenBackdrop(true)
      await api.delete(`returns/${returnSale.id}`, {
        params: {
          shopId: returnSale.shopId
        }
      })
      setOpenBackdrop(false)
      setReturns(prev => prev.filter(item => item.id !== returnSale.id))
    } catch (error) {
      console.log(error)
      setOpenBackdrop(false)
      
      if (!error.response) {
        setAlert('Sem comunicação com servidor!')
      }
    }
  }

  return (
    <div className='container'>
      <div className="fieldsSearchSales">
        <select 
          name="typeSales"
          id="typeSales" 
          className="selectSearchSales"
          onChange={e => { 
            setTypeSearch(e.target.value)
            if (e.target.value === 'dateReturn') {
              setSearch({
                dateStart: getDateToSql(),
                dateFinish: getDateToSql()
              })
            } else {
              setSearch('')
            }
          }}
        >
          <option value={'originalSaleId'}>Código Venda</option>
          <option value={'client'}>Nome Cliente</option>
          <option value={'dateReturn'}>Dt Devolução</option>
        </select>

        {(typeSearch !== 'dateReturn') &&
        <div className="inputsSearchSales">
          <AiOutlineSearch />
          <input
            type="text"
            placeholder="Pesquisar…"
            onChange={e => setSearch(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && searchSalesReturn()}
            value={search}
          />
        </div>
        }
        {typeSearch === 'dateReturn' &&
        <div className="inputsSearchSales">
          <AiOutlineSearch />
          <input
            type="date"
            style={{marginRight: '10px'}}
            onChange={e => setSearch({...search, dateStart: e.target.value})}
            onKeyPress={e => e.key === 'Enter' && searchSalesReturn()}
            value={search.dateStart}
          />
          <span style={{fontSize: '16px'}}>Até</span>
          <input
            type="date"
            style={{marginLeft: '10px'}}
            onChange={e => setSearch({...search, dateFinish: e.target.value})}
            onKeyPress={e => e.key === 'Enter' && searchSalesReturn()}
            value={search.dateFinish}
          />
        </div>
        }

        <button onClick={searchSalesReturn}>PESQUISAR</button>
      </div>
      <div>
        {returns.length !== 0
          ?<table className="tableWithoutBordRad tableMain">
            <thead>
              <tr>
                <th></th>
                <th className="cod">Código</th>
                <th className="cod">Cód. Venda</th>
                <th className="cod">Cód. Dev</th>
                <th>Cliente</th>
                <th>Dt Envio</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
            {returns.map( item => (
              <Row key={item.id} item={item} cancelReturn={cancelReturn}/>
            ))}
            </tbody>
          </table>
          : <div style={{ color: 'var(--red)', marginTop: '1rem' }}>Sem devoluções pendentes!</div>
        }
      </div>

      <ButtonPlus
        onClick={() => setModalSendReturn(true)}
      />

      <Modal
        openModal={openModalSendReturn}
        setOpenModal={setModalSendReturn}
      >
        <ReturnsToSend setOpen={setModalSendReturn} setReturns={setReturns}/>
      </Modal>
    </div>
  )
}
