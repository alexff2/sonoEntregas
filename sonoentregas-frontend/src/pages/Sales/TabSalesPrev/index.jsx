import React, { useState, useEffect } from 'react'
import { BsArrowReturnRight } from 'react-icons/bs'

import { FormatValue } from '../../../components/FormatValue'

import { useAuthenticate } from '../../../context/authContext'
import { useModalAlert } from '../../../context/modalAlertContext'

import LoadingCircle from '../../../components/LoadingCircle'

import api from '../../../services/api'

import './style.css'

export function TabSalesPrev(){
  const [ loading, setLoading ] = useState(false)
  const [ deliveriesPrev, setDeliveriesPrev ] = useState([])
  const { setAlert } = useModalAlert()
  const { shopAuth } = useAuthenticate()
  const { cod: codLoja } = shopAuth

  useEffect(() => {
    setLoading(true)
    api.get(`/deliverys/open`)
      .then( resp => {
        let deliveriesOfThisStore = []
        resp.data.forEach(delivery => {
          if (!delivery.ASSISTANT) {
            let salesFiltered = delivery.sales.filter(sale => sale.CODLOJA === codLoja)

            if (salesFiltered.length > 0) {
              delivery.sales = salesFiltered

              deliveriesOfThisStore = [
                ...deliveriesOfThisStore,
                delivery
              ]
            }
          }
        })

        setDeliveriesPrev(deliveriesOfThisStore)
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        setAlert('Error in application')
        setLoading(false)
      })
  }, [codLoja, setAlert])

  return(
    <>
    { loading
      ? <div className="loadingTable">
        <LoadingCircle />
      </div>
      : <>
        {deliveriesPrev.map(deliveryPrev => (
          <div key={deliveryPrev.ID} className='deliveryPrev'>
            <div className='headerPrev'>
              <span>{deliveryPrev.DESCRIPTION}</span>
              <span>Criado por: {deliveryPrev.USER_MOUNT}</span>
            </div>
            {deliveryPrev.sales.map( sale => (
              <React.Fragment key={sale.ID_SALES}>
                <div className="salePrev">
                  <span>{sale.ID_SALES}</span>
                  <span>{sale.NOMECLI}</span>
                  <span>{sale.FONE}</span>
                  <span><strong>Vendededor: </strong>{sale.VENDEDOR}</span>
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
      </>
    }
    </>
  )
}