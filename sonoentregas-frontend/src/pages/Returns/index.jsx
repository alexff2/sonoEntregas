import React, { useEffect, useState } from 'react'
import { useModalAlert } from '../../context/modalAlertContext'
import { useBackdrop } from '../../context/backdropContext'
import Status from '../../components/Status'
import api from '../../services/api'
import ButtonPlus from '../../components/ButtonPlus'
import Modal from '../../components/Modal'
import ReturnsToSend from './ReturnsToSend'

export default function Returns(){
  const [openModalSendReturn, setModalSendReturn] = useState(false)
  const [returns, setReturns] = useState([])

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
      <div>
        {returns.length !== 0
          ?<table className="tableWithoutBordRad tableMain">
            <thead>
              <tr>
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
              <tr key={item.id}>
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