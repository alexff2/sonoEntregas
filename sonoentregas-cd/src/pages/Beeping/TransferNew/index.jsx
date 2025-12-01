import React from 'react'
import { Typography } from '@material-ui/core'
import { useAlertSnackbar } from '../../../context/alertSnackbarContext'
import { useBackdrop } from '../../../context/backdropContext'
import api from '../../../services/api'
import { Beep } from '../../../components/Beep'
import { ButtonCancel, ButtonSuccess } from '../../../components/Buttons'
import { TransferSearch } from './TransferSearch'

export default function TransfersBeep({ handleRenderBox }) {
  const [openSearch, setOpenSearch] = React.useState(true)
  const [beepById, setBeepById] = React.useState(true)
  const [serialNumber, setSerialNumber] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [productSelected, setProductSelected] = React.useState(null)
  const [products, setProducts] = React.useState([])
  const [transferNumber, setTransferNumber] = React.useState('')
  const { setAlertSnackbar } = useAlertSnackbar()
  const { setOpenBackDrop } = useBackdrop()

  const handleResetProperties = () => {
    setLoading(false)
    setSerialNumber('')
    setOpenBackDrop(false)
    document.getElementById('beep').focus()
  }

  const handleBeepById = async () => {
    try {
      const [id, serieString] = serialNumber.split(' ')

      if (serieString === '' || serialNumber.split(' ').length === 1) {
        setAlertSnackbar('Número inválido!')
        handleResetProperties()
        return
      }

      let productSelectedToSend, productFound = false

      const { data } = await api.get(`transfer/${transferNumber}/beep`)

      data.products.forEach(group => {
        group.products = group.products.map(product => {
          if (product.originalId === id) {
            productFound = true
            if (product.quantityPedding === 0) {
              return product
            }
            product = {
              ...product,
              quantityPedding: product.quantityPedding - 1,
              quantityBeep: product.quantityBeep + 1
            }
            productSelectedToSend = product
            setProductSelected(product)
            return product
          }
          return product
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

      if (productSelectedToSend.type === 'C') {
        await api.post('serial/first', {
          serialNumber: serieString,
          productId: productSelectedToSend.id,
          module: 'transfer',
          moduleId: transferNumber
        })
      } else {
        await api.put('serial/finished', {
          serialNumber: serieString,
          productId: productSelectedToSend.id,
          module: 'transfer',
          moduleId: transferNumber
        })
      }

      setProducts(data.products)
      setAlertSnackbar('Bipe realizado com sucesso!', 'success')
      handleResetProperties()
    } catch (error) {
      handleResetProperties()
      console.log(error)
      if (error.response.data === 'the serial number has already been finalized or has not been entered!') {
        setAlertSnackbar('Número de série já finalizado ou não foi dado entrada!')
      } else if (error.response.data === 'This serial number does not belong to this product!') {
        setAlertSnackbar('Este número de série não pertence a esse produto!')
      } else if (error.response.data === 'Serial number not linked to this module on output!') {
        setAlertSnackbar('Número de série não vinculado a esse modulo na saída!')
      } else if (error.response.data === 'the serial number already exists and is not finalized!') {
        setAlertSnackbar('Número de série já foi dado entrada em outro produto!')
      } else if (error.response.data === 'serial number invalid') {
        setAlertSnackbar('Número de série inválido!')
      } else {
        setAlertSnackbar('Erro interno, entre em contato com ADMs!')
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
      const { data } = await api.get(`transfer/${transferNumber}/beep`)

      let productSelectedToSend

      data.products.forEach(group => {
        group.products = group.products.map(product => {
          if (product.id === productSelected.id && product.quantityPedding > 0) {
            product = {
            ...product,
              quantityPedding: product.quantityPedding - 1,
              quantityBeep: product.quantityBeep + 1
            }
            productSelectedToSend = product
            return product
          }
          return product
        })
      })

      if (!productSelectedToSend) {
        setAlertSnackbar('Produto já todo bipado!')
        handleResetProperties()
        return
      }

      if (productSelected.type === 'C') {
        await api.post('serial/first', {
          serialNumber,
          productId: productSelected.id,
          module: 'transfer',
          moduleId: transferNumber
        })
      } else {
        await api.put('serial/finished', {
          serialNumber,
          productId: productSelected.id,
          module: 'transfer',
          moduleId: transferNumber
        })
      }

      setProducts(data.products)

      setAlertSnackbar('Bipe realizado com sucesso!', 'success')
      handleResetProperties()
    } catch (error) {
      handleResetProperties()
      console.log(error)
      if (error.response.data === 'the serial number has already been finalized or has not been entered!') {
        setAlertSnackbar('Número de série já finalizado ou não foi dado entrada!')
      } else if (error.response.data === 'This serial number does not belong to this product!') {
        setAlertSnackbar('Este número de série não pertence a esse produto!')
      } else if (error.response.data === 'Serial number not linked to this module on output!') {
        setAlertSnackbar('Número de série não vinculado a esse modulo na saída!')
      } else if (error.response.data === 'the serial number already exists and is not finalized!') {
        setAlertSnackbar('Número de série já foi dado entrada em outro produto!')
      } else if (error.response.data === 'serial number invalid') {
        setAlertSnackbar('Número de série inválido!')
      } else {
        setAlertSnackbar('Erro interno, entre em contato com ADMs!')
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
        <TransferSearch
          openSearch={openSearch}
          setOpenSearch={setOpenSearch}
          setProducts={setProducts}
          handleRenderBox={handleRenderBox}
          setBeepById={setBeepById}
          beepById={beepById}
          transferNumber={transferNumber}
          setTransferNumber={setTransferNumber}
        />
      )
    }

  return (
    <Beep.Root>
      <Beep.Header
        value={serialNumber}
        onChange={(e) => setSerialNumber(e.target.value)}
        disabled={loading}
        onKeyEnter={handleSerialNumberLoading}
      >
        <Typography>
          Bipe da transferência nº: <strong>{transferNumber}</strong>
        </Typography>
        {beepById 
          ? (<Typography>{productSelected?.nameFull}</Typography>)
          : (<Typography>{productSelected?.nameFull ?? 'Selecione um produto...'}</Typography>)
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