import React, { useState } from 'react'

import { useModalAlert } from '../../../context/modalAlertContext'

import { coinMask, coinToFloat } from '../../../functions/toLocString'
import api from '../../../services/api'

export default function ModalCreate({ setOpenModalCreateOnSale, setPromotions }){
  const [ productsSearch, setProductsSearch ] = useState([])
  const [ productsResultSearch, setProductsResultSearch ] = useState([])
  const [ description, setDescription ] = useState('')
  const [ dateStart, setDateStart ] = useState('')
  const [ dateFinish, setDateFinish ] = useState('')

  const { setAlert } = useModalAlert()

  const searchProducts = async e => {
    try {
      if (e.target.value.length > 4) {
        const response = await api.get(`/products/NOME/${e.target.value}`)
  
        setProductsSearch(response.data)
      } else {
        setProductsSearch([])
      }
    } catch (error) {
      console.log(error)
    }
  }

  const addProductsResultSearch = (product) => {
    if (productsResultSearch.find(productResultSearch => productResultSearch.COD_ORIGINAL === product.COD_ORIGINAL)) {
      return
    }

    setProductsResultSearch([...productsResultSearch, product])
    setProductsSearch([])
  }

  const onSubmit = async e => {
    e.preventDefault()
    try {
      let productsWhitValueOnSale = true

      productsResultSearch.forEach(async product => {
        if (!product.pricePromotion) {
          alert(`O produto ${product.NOME} não possui valor de promoção`)
          productsWhitValueOnSale = false
        }
      })

      if (!productsWhitValueOnSale) {
        return
      }

      const { data } = await api.post('/promotion', {
        description,
        dateStart,
        dateFinish,
        products: productsResultSearch
      })

      setPromotions(onSale => [...onSale, data])

      setOpenModalCreateOnSale(false)
    } catch (error) {
      console.log(error)

      if (error.response.data) {
        setAlert(error.response.data)
      }
    }
  }

  return(
    <>
      <h2>Cadastro de Promoções</h2>

      <form className='formOnSale' onSubmit={onSubmit}>
        <div className="headerAndFields">
          <div className='field fieldOnSale'>
            <label htmlFor="description">Descrição: </label>
            <input id='description' type='text' onChange={e => setDescription(e.target.value)} required/>
          </div>
          <div className="fieldsOnSaleDate">
            <div className='field fieldOnSale'>
              <label htmlFor="dateStart">Data Inicial: </label>
              <input id='dateStart' type='date' onChange={e => setDateStart(e.target.value)} required/>
            </div>
            <div className='field fieldOnSale'>
              <label htmlFor="dateFinish">Data Final: </label>
              <input id='dateFinish' type='date' onChange={ e => setDateFinish(e.target.value)} required/>
            </div>
          </div>
          <hr />
          <div className="bodyCreateOnSale">
            <div className="field fieldOnSale fieldOnSaleProduct">
              <label htmlFor="products">Produtos: </label>
              <input id='products' type='text' onChange={searchProducts} required />
              {productsSearch.length > 0 &&
              <div className="resultaSearchProduct">
                <table>
                  <tbody>
                    { productsSearch.map(product => (
                      <tr key={product.COD_ORIGINAL}>
                        <td>{product.COD_ORIGINAL}</td>
                        <td>{product.NOME}</td>
                        <td className='btnAdd' onClick={() => addProductsResultSearch(product)}>+</td>
                      </tr>))}
                  </tbody>
                </table>
              </div>}
            </div>
            <table>
              <tbody>
                { productsResultSearch.map(product => (
                  <tr key={product.COD_ORIGINAL}>
                    <td>{product.COD_ORIGINAL}</td>
                    <td>{product.NOME}</td>
                    <td>
                      <input id='valueProduct' type="text" onInput={coinMask} onChange={e => product.pricePromotion = coinToFloat(e.target.value)}/>
                    </td>
                  </tr>))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="btnBox">
          <button type='submit'>CADASTRAR</button>
          <button type='button' onClick={() => setOpenModalCreateOnSale(false)}>CANCELAR</button>
        </div>
      </form>
    </>
  )
}