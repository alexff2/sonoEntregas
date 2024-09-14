import React, { useState } from 'react'

import { useAuthenticate } from '../../../context/authContext'
import { useBackdrop } from '../../../context/backdropContext'

import api from '../../../services/api'
import AddressSelection from './AddressSelection'
import Search from './Search'

import './style.css'

export default function ReturnsToSend({setOpen, setReturns}) {
  
  const [ tabDefault, setTabDefault ] = useState(true)
  const [addresses, setAddresses] = useState([])

  const { shopAuth } = useAuthenticate()
  const [ selectSaleReturn, setSelectSaleReturn ] = useState({})

  const { setOpen: setOpenBackdrop } = useBackdrop()

  const handleSelectSaleReturn = async sale => {
    try {
      const { data } = await api.get('returns/address', {
        params: {
          originalSaleId: sale.originalSaleId,
          clientId: sale.clientId,
          shopId: shopAuth.cod
        }
      })
      setAddresses(data.addresses)
      setSelectSaleReturn(sale)
      setTabDefault(false)
    } catch (error) {
      console.log(error)
    }
  }

  const sendSalesReturns = async address => {
    try {
      setOpenBackdrop(true)

      const {data} = await api.post('returns', {
        saleReturnInput: { ...selectSaleReturn, shopId: shopAuth.cod, ...address},
        productsInput: selectSaleReturn.products
      })
      console.log(data)

      setReturns(prev => [...prev, data.returnCreated])

      setOpenBackdrop(false)
      setOpen(false)
    } catch (error) {
      setOpenBackdrop(false)
      console.log(error)
    }
  }

  return (
    <React.Fragment>
      <h2>Devoluções válidas</h2>
      {
        tabDefault
        ? <Search
            handleSelectSaleReturn={handleSelectSaleReturn}
          />
        : <AddressSelection
            addresses={addresses}
            sendSalesReturns={sendSalesReturns}
          />
      }
    </React.Fragment>
  )
}
