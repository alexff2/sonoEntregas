import React, { useEffect, useState } from "react"
import { BsArrowReturnRight } from 'react-icons/bs'

import './style.css'

import api from '../../../services/api'
//import { dateSqlToReact } from '../../../functions/getDate'

import { useAuthenticate } from '../../../context/authContext'
import { useModalAlert } from '../../../context/modalAlertContext'

import LoadingCircle from '../../../components/LoadingCircle'
import { FormatValue } from '../../../components/FormatValue'

export function TabSalesProcess() {
  const [ loading, setLoading ] = useState(false)
  const [ salesMounting, setSalesMounting ] = useState([])
  const [ salesDelivering, setSalesDelivering ] = useState([])
  const { setAlert } = useModalAlert()
  const { shopAuth } = useAuthenticate()
  const { cod: codLoja } = shopAuth

  useEffect(() => {
    setLoading(true)
    api.get(`/deliverys/open`)
      .then( resp => {
        let salesMountingOfThisStore = []
        let salesDeliveringOfThisStore = []
        resp.data.forEach(delivery => {
          if (delivery.ASSISTANT) {
            let salesFiltered = delivery.sales.filter(sale => sale.CODLOJA === codLoja)

            if (salesFiltered.length > 0) {
              delivery.sales = salesFiltered

              if (delivery.STATUS === 'Em lançamento') {
                salesMountingOfThisStore = [
                  ...salesMountingOfThisStore,
                  delivery
                ]
              } else {
                salesDeliveringOfThisStore = [
                  ...salesDeliveringOfThisStore,
                  delivery
                ]
              }
            }
          }
        })

        setSalesMounting(salesMountingOfThisStore)
        setSalesDelivering(salesDeliveringOfThisStore)
        setLoading(false)
      })
      .catch( err => {
        console.log(err)
        !err.response
          ? setAlert('Rede')
          : setAlert(err.response)
      })
  }, [codLoja, setAlert])

  return (
    <>
    { loading
      ? <div className="loadingTable">
        <LoadingCircle />
      </div>
      : <>
        <div className="boxSalesByStatus">
          <div className='headerSalesByStatus salesMounting'>
            <span>Em montagem</span>
          </div>
          {salesMounting.map(deliveryPrev => (
          <div key={deliveryPrev.ID} className='deliveries'>
            <div className='headerDeliveriesSales'>
              <span>{deliveryPrev.DESCRIPTION}</span>
              <span>Motorista: {deliveryPrev.DRIVER}</span>
              <span>Ajudante: {deliveryPrev.ASSISTANT}</span>
              <span>Lançado por: {deliveryPrev.USER_MOUNT}</span>
            </div>
            {deliveryPrev.sales.map( sale => (
              <React.Fragment key={sale.ID_SALES}>
                <div className="salePrev">
                  <span>{sale.ID_SALES}</span>
                  <span>{sale.NOMECLI}</span>
                  <span>{sale.FONE}</span>
                  <span><strong>Vendedor: </strong>{sale.VENDEDOR}</span>
                </div>
                {sale.products.map( product => (
                  <div key={product.COD_ORIGINAL} className="productPrev">
                    <span><BsArrowReturnRight /></span>
                    <span>{product.COD_ORIGINAL}</span>
                    <span>{product.DESCRICAO}</span>
                    <span><FormatValue>{product.NVTOTAL}</FormatValue></span>
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
          ))}
        </div>
        <div className="boxSalesByStatus">
          <div className='headerSalesByStatus salesDelivering'>
            <span>Entregando</span>
          </div>
          {salesDelivering.map(deliveryPrev => (
          <div key={deliveryPrev.ID} className='deliveries'>
            <div className='headerDeliveriesSales'>
              <span>{deliveryPrev.DESCRIPTION}</span>
              <span>Motorista: {deliveryPrev.DRIVER}</span>
              <span>Ajudante: {deliveryPrev.ASSISTANT}</span>
              <span>Alterado por: {deliveryPrev.USER_MOUNT}</span>
            </div>
            {deliveryPrev.sales.map( sale => (
              <React.Fragment key={sale.ID_SALES}>
                <div className="salePrev">
                  <span>{sale.ID_SALES}</span>
                  <span>{sale.NOMECLI}</span>
                  <span>{sale.FONE}</span>
                  <span><strong>Vendedor: </strong>{sale.VENDEDOR}</span>
                </div>
                {sale.products.map( product => (
                  <div key={product.COD_ORIGINAL} className="productPrev">
                    <span><BsArrowReturnRight /></span>
                    <span>{product.COD_ORIGINAL}</span>
                    <span>{product.DESCRICAO}</span>
                    <span><FormatValue>{product.NVTOTAL}</FormatValue></span>
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
          ))}
        </div>
      </>
    }
    </>
  )
}