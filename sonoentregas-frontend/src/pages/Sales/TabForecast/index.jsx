import React, { useState, useEffect } from 'react'
import { BsArrowReturnRight } from 'react-icons/bs'

import { FormatValue } from '../../../components/FormatValue'

import { useAuthenticate } from '../../../context/authContext'
import { useModalAlert } from '../../../context/modalAlertContext'

import LoadingCircle from '../../../components/LoadingCircle'
import Modal from '../../../components/Modal'
import ConfirmDialog from '../../../components/ConfirmDialog'

import api from '../../../services/api'
import { dateSqlToReact } from '../../../functions/getDate'

import './style.css'

export function TabForecast(){
  const [ disableBtn, setDisableBtn ] = useState(false)
  const [ showDialog, setShowDialog ] = useState(false);
  const [ loading, setLoading ] = useState(true)
  const [ openModalStatus, setOpenModalStatus ] = useState(false)
  const [ forecasts, setForecasts ] = useState([])
  const [ saleSelect, setSaleSelect ] = useState({})
  const [ validationStatus, setValidationStatus ] = useState('')
  const [ contact, setContact ] = useState('')
  const [ obs, setObs ] = useState('')
  const { setAlert } = useModalAlert()
  const { shopAuth } = useAuthenticate()
  const { cod: codLoja } = shopAuth

  useEffect(() => {
    setLoading(true)
    api
      .get(`/forecast`, {
        params: {
          codLoja,
          status: 1
        }
      })
      .then(({ data }) => {
        setForecasts(data)
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        setAlert('Error in application')
        setLoading(false)
      })
  }, [codLoja, setAlert])

  const handleClickValidate = sale => {
    setSaleSelect(sale)
    setOpenModalStatus(true)
  }

  const handleValidation = async e => {
    e.preventDefault()
    setDisableBtn(true)
    try {
      if (saleSelect.validationStatus === null) {
        await api.put(`/forecast/${saleSelect.idForecast}/sale/${saleSelect.id}/validation`, {
          validationStatus,
          contact,
          obs
        })
      } else {
        await api.put(`/forecast/${saleSelect.idForecast}/sale/${saleSelect.id}/invalidation/request`, {
          contact,
          obs
        })
      }

      const { data } = await api.get(`/forecast`, {
        params: {
          codLoja,
          status: 1
        }
      })

      setForecasts(data)
      setDisableBtn(false)
      setOpenModalStatus(false)
    } catch (e) {
      console.log(e.response)
      setDisableBtn(false)
      setOpenModalStatus(false)

      if (e.response.data.dataInvalid) {
        setAlert(e.response.data.dataInvalid)
      } else if (e.response.data.message) {
        if (e.response.data.message === 'outdated forecast!') {
          setAlert('Previsão fora do prazo, entre em contato com o CD para realocar essa venda para uma nova previsão!')
          return
        }
        setAlert(e.response.data.message)
      } else if (e.response.data === 'onRoute') {
        setAlert('Venda já está em rota, verifique EM PROCESSO o status, se ainda estive em lançamento, solicite a retirada da rota ao CD!')
      }
    }

  }

  function handleDelete() {
    setShowDialog(true);
  }

  async function handleConfirm() {
    setTimeout(() => {
      setShowDialog(false)
    }, 2000)
  }

  function handleCancel() {
    setShowDialog(false)
  }

  return(
    <>
    { loading
      ? <div className="loadingTable">
        <LoadingCircle />
      </div>
      : <>
        {forecasts.map(forecast => (
          <div key={forecast.id} className='forecast'>
            <div className='headerPrev'>
              <span>Previsão de {dateSqlToReact(forecast.date)}</span>
              <span>Criado por: {forecast.userCreated}</span>
            </div>
            {forecast.sales.map( sale => (
              <React.Fragment key={sale.id}>
                <div className="salePrev">
                  <span>{sale.ID_SALES}</span>
                  <span>
                    {sale.NOMECLI} { sale.validationStatus !== null &&
                      <>
                        {!sale.validationStatus
                          ? <strong style={{color: 'var(--red)'}}> - Negada</strong> 
                          : <strong style={{color: 'var(--green)'}}> - Confirmada</strong>}
                      </>}
                  </span>
                  <span>{sale.FONE}</span>
                  <span><strong>Vendedor: </strong>{sale.VENDEDOR}</span>
                  <div className="btnValidRemove">
                  {(sale.validationStatus === null || (sale.validationStatus && !sale.requestInvalidate)) && 
                    <button
                      className="btnValidation"
                      style={{background: 'var(--blue)'}}
                      onClick={() => handleClickValidate(sale)}
                    >
                      { sale.validationStatus === null && 'Validar' }
                      { sale.validationStatus && 'Invalidar' }
                    </button>}
                    {(sale.validationStatus === null) && 
                    <button
                      className="btnRemove"
                      style={{background: 'var(--green)'}}
                      onClick={() => handleDelete()}
                    >
                      Remove
                    </button>}
                  </div>
                </div>
                {sale.products.map( product => (
                  <div key={product.COD_ORIGINAL} className="productPrev">
                    <span><BsArrowReturnRight /></span>
                    <span>{product.COD_ORIGINAL}</span>
                    <span>{product.NOME}</span>
                    <span><FormatValue>{product.NVTOTAL}</FormatValue></span>
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        ))}
      </>
    }

      <Modal openModal={openModalStatus} setOpenModal={setOpenModalStatus}>
        <h2>
          {saleSelect.validationStatus ? 'Invalidação' : 'Validação'} da venda {saleSelect.ID_SALES}
        </h2>
        {saleSelect.validationStatus && 
          <p style={{marginBottom: 12, color: 'var(--red)'}}>
            Atenção! A invalidação só acontece mediante confirmação do CD!
          </p>
        }

        <form onSubmit={handleValidation}>
          <div className='sales-field validateField'>
            <label htmlFor='idContact'>Contato: </label>
            <input 
              type="text"
              required
              onChange={e => setContact(e.target.value)}
              id='idContact' />
          </div>
          <div className='sales-field validateField'>
            <label htmlFor='idObs'>Obs: </label>
            <textarea 
              type="text"
              required
              onChange={e => setObs(e.target.value)}
              id='idObs'></textarea>
          </div><br />
          {saleSelect.validationStatus === null && 
          <div className='sales-field field-validate'>
            <div className='validate-radio confirm'>
              <input 
                type="radio"
                required
                id='idValidation'
                value={true}
                onChange={e => setValidationStatus(e.target.value === 'true')}
                name='validated'/>
              <label htmlFor='idValidation'>Confirmar </label>
            </div>
            <div className='validate-radio decline'>
              <input 
                type="radio"
                required
                id='idInValidation'
                value={true}
                onChange={e => setValidationStatus(e.target.value === 'false')}
                name='validated'/>
              <label htmlFor='idInValidation'>Recusar </label>
            </div>
          </div>}

          <input 
            disabled={disableBtn}
            type="submit"
            value={saleSelect.validationStatus === null ? "Salvar" : "Invalidar"}
            className='btnSaved'/>
        </form>
      </Modal>

      {showDialog && (
        <ConfirmDialog
          title="Autorizar remoção!"
          body="Deseja realmente autorizar a remoção desta venda? (Após autorizar, solicite a remoção da venda pelo CD)"
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </>
  )
}