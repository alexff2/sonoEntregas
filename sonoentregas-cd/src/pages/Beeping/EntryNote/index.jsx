import React, {useState} from 'react'
import {Typography} from '@material-ui/core'

import {useAlertSnackbar} from '../../../context/alertSnackbarContext'
import {useBackdrop} from '../../../context/backdropContext'

import {EntryNoteSearch} from './EntryNoteSearch'
import {Beep} from '../../../components/Beep'
import {ButtonSuccess, ButtonCancel} from '../../../components/Buttons'
import api from '../../../services/api'

export default function EntryNote({handleRenderBox}) {
  const [openSearch, setOpenSearch] = useState(true)
  const [beepById, setBeepById] = useState(true)
  const [loading, setLoading] = useState(false)
  const [beepLoading, setBeeLoading] = useState('')
  const [productSelected, setProductSelected] = useState(null)
  const [products, setProducts] = useState([])
  const [entryNoteNumber, setEntryNoteNumber] = useState('')
  const {setAlertSnackbar} = useAlertSnackbar()
  const {setOpenBackDrop} = useBackdrop()

  const handleResetProperties = () => {
    setLoading(false)
    setBeeLoading('')
    setOpenBackDrop(false)
    document.getElementById('beep').focus()
  }

  const handleBeepById = async () => {
    try {
      const [id, serieString] = beepLoading.split(' ')

      if (serieString === '' || beepLoading.split(' ').length === 1) {
        setAlertSnackbar('Número inválido!')
        handleResetProperties()
        return
      }

      let productSelectedToSend, productFound = null

      products.forEach(group => {
        group.products.forEach(product => {
          if(productFound && productSelectedToSend?.quantityPedding > 0) return
          if (product.originalId === id) {
            productFound = true
            if (product.quantityPedding === 0) {
              return
            }
            productSelectedToSend = product
            setProductSelected(product)
          }
        })
      })

      if (!productFound) {
        setAlertSnackbar('Produto não encontrado! Verifique ID vinculado no cadastro do produto!')
        handleResetProperties()
        return
      }

      if (!productSelectedToSend) {
        setAlertSnackbar('Produto já todo bipado')
        handleResetProperties()
        return
      }

      setOpenBackDrop(true)
      await api.post('serial/first', {
        serialNumber: serieString,
        productId: productSelectedToSend.id,
        module: 'purchaseNote',
        moduleId: productSelectedToSend.moduleId
      })

      const {data} = await api.get(`purchase-note-beep/${productSelectedToSend.moduleId}/product/${productSelectedToSend.id}`)

      setProducts(products.map(group => ({
        ...group,
        products: group.products.map(product => {
          if (product.id === data.product.id && product.moduleId === data.product.moduleId) {
            return data.product
          }
          return product
        })
      })))
      /*const {data} = await api.get(`purchase-note-beep/${entryNoteNumber}`)
      setProducts(data.products)*/

      setAlertSnackbar('Bipe realizado com sucesso!', 'success')
      handleResetProperties()
    } catch (error) {
      handleResetProperties()
      console.log(error)
      if (error.response.data === 'the serial number already exists and is not finalized!') {
        setAlertSnackbar('Número de série já foi dado entrada em outro produto!')
      }
    }
  }

  const handleBeepBySelect = async () => {
    if (!productSelected) {
      setAlertSnackbar('Selecione um produto!')
      handleResetProperties()
      return
    }

    try {
      setOpenBackDrop(true)
      await api.post('serial/first', {
        serialNumber: beepLoading,
        productId: productSelected.id,
        module: 'purchaseNote',
        moduleId: productSelected.moduleId
      })

      const {data} = await api.get(`purchase-note-beep/${productSelected.moduleId}/product/${productSelected.id}`)

      setProducts(products.map(group => ({
        ...group,
        products: group.products.map(product => {
          if (product.id === data.product.id && product.moduleId === data.product.moduleId) {
            product.quantityPedding === 0 ? setProductSelected(null) : setProductSelected(product)
            return data.product
          }
          return product
        })
      })))

      setAlertSnackbar('Bipe realizado com sucesso!', 'success')
      handleResetProperties()
    } catch (error) {
      handleResetProperties()
      console.log(error)
      if (error.response.data === 'the serial number already exists and is not finalized!') {
        setAlertSnackbar('Número de série já foi dado entrada em outro produto!')
      } else if (error.response.data === 'serial number invalid') {
        setAlertSnackbar('Número de série inválido!')
      }
    }
  }

  const handleSerialNumberLoading = () => {
    setLoading(true)
    beepById
      ? handleBeepById()
      : handleBeepBySelect()
  }

  if (openSearch === true) {
    return (
      <EntryNoteSearch
        openSearch={openSearch}
        setOpenSearch={setOpenSearch}
        setProducts={setProducts}
        handleRenderBox={handleRenderBox}
        setBeepById={setBeepById}
        beepById={beepById}
        entryNoteNumber={entryNoteNumber}
        setEntryNoteNumber={setEntryNoteNumber}
      />
    )
  }

  return (
    <Beep.Root>
      <Beep.Header
        value={beepLoading}
        onChange={(e) => setBeeLoading(e.target.value)}
        disabled={loading}
        onKeyEnter={handleSerialNumberLoading}
      >
        <Typography>
          Bipe da(s) Nota(s) de Entrada nº <strong>{entryNoteNumber}</strong>
        </Typography>
        {beepById 
          ? (<Typography>{productSelected?.nameFull ?? ''}</Typography>)
          : (<Typography>{productSelected ? productSelected.nameFull : 'Selecione um produto...'}</Typography>)
        }
      </Beep.Header>
      <Beep.Products
        data={products}
        productSelected={productSelected}
        setProductSelected={setProductSelected}
        beepById={beepById}
      />

      <Beep.Footer>
        <ButtonSuccess>SALVAR</ButtonSuccess>
        <ButtonCancel onClick={() => handleRenderBox()}>CANCELAR</ButtonCancel>
      </Beep.Footer>
    </Beep.Root>
  )
}