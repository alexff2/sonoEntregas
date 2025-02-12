import React, { useEffect, useState } from 'react'
import {
  Box,
  InputBase,
  Typography,
  makeStyles
} from '@material-ui/core'
import api from '../../services/api'

import { useAlertSnackbar } from '../../context/alertSnackbarContext'

const useStyle = makeStyles(theme =>({
  header: {
    padding: 8,
    backgroundColor: theme.palette.primary.light,
    height: '84px'
  },
  fieldSearch: {
    height: '2rem',
    width: '100%',
    background: 'white',
    borderRadius: 4,
    marginBottom: 8,
    paddingLeft: 8,
  },
  textHeader: {
    color: 'white',
  }
}))

export function Header({
  productSelected,
  setProductSelected,
  title,
  module,
  products,
  setProducts,
  isReturn
}) {
  const [serialNumber, setSerialNumber] = useState('')
  const classes = useStyle()
  const { setAlertSnackbar } = useAlertSnackbar()

  useEffect(() => {
    document.getElementById('beep').focus()
  }, [])

  const beepProduct = async () => {
    if (productSelected?.quantityPedding === 0) {
      return
    }

    let productSelectedToSend, serie

    if (!!module.beepId) {
      const beep = serialNumber

      const [id, serieString] = beep.split(' ')

      if (serieString === '' || beep.split(' ').length === 1) {
        setAlertSnackbar('Número inválido!')

        return
      }

      serie = serieString

      products.forEach(group => {
        group.products.forEach(product => {
          if (product.originalId === id) {
            productSelectedToSend = product
            setProductSelected(product)
          }
        })
      })

      if (!productSelectedToSend) {
        setAlertSnackbar('Produto não encontrado! Verifique ID vinculado no cadastro do produto!')
        return
      }
    } else {
      productSelectedToSend = productSelected
    }

    try {
      if (module.type === 'C') {
        await api.post('serial/first', {
          serialNumber: !!module.beepId ? serie : serialNumber,
          productId: productSelectedToSend.id,
          module: module.name === 'delivery' ? productSelectedToSend.module : module.name,
          moduleId: productSelectedToSend.moduleId
        })
      } else {
        await api.put('serial/finished', {
          serialNumber: !!module.beepId ? serie : serialNumber,
          productId: productSelectedToSend.id,
          module: module.name === 'delivery' ? productSelectedToSend.module : module.name,
          moduleId: productSelectedToSend.moduleId
        })
      }

      setProducts(productsGroup => {
        return productsGroup.map(productGroup => {
          return {
            ...productGroup,
            products: productGroup.products.map(product => {
              if(product.module) {
                if (product.id === productSelectedToSend.id && product.module === productSelectedToSend.module) {
                  productSelectedToSend.quantityPedding -= 1
                  productSelectedToSend.quantityBeep += 1
  
                  return productSelectedToSend
                }
              } else {
                if (product.id === productSelectedToSend.id) {
                  productSelectedToSend.quantityPedding -= 1
                  productSelectedToSend.quantityBeep += 1
  
                  return productSelectedToSend
                }
              }
    
              return product
            })
          }
        })
      })
      setSerialNumber('')

      module.beepId && document.getElementById('beep').focus()
    } catch (error) {
      setSerialNumber('')
      console.log(error)

      if (error.response.data === 'the serial number has already been finalized or has not been entered!') {
        setAlertSnackbar('Número de série já finalizado ou não foi dado entrada!')
      } else if (error.response.data === 'This serial number does not belong to this product!') {
        setAlertSnackbar('Este número de série não pertence a esse produto!')
      } else if (error.response.data === 'the serial number already exists and is not finalized!') {
        setAlertSnackbar('Número de série já foi dado entrada em outro produto!')
      } else if (error.response.data === 'serial number invalid') {
        setAlertSnackbar('Número de série inválido!')
      } else {
        setAlertSnackbar('Erro interno, entre em contato com ADMs!')
      }
    }
  }

  const changeSerialInputSerialNumber = e => {
    if (productSelected?.quantityPedding > 0 || !!module.beepId) {
      setSerialNumber(e.target.value)
    }
  }

  return (
    <Box className={classes.header}>
      <InputBase
        id='beep'
        className={classes.fieldSearch}
        autoComplete='off'
        onKeyDown={e => e.key === 'Enter' && beepProduct()}
        value={serialNumber}
        disabled={!productSelected && !module.beepId}
        onChange={changeSerialInputSerialNumber}
      />

      <Box className={classes.textHeader}>
        <Typography>
          {title}{ isReturn && <> - <strong style={{color: 'red'}}>RETORNO / DEVOLUÇÕES</strong></>}
        </Typography>
        <Typography>{productSelected ? productSelected.nameFull : 'Selecione um produto...'}</Typography>
      </Box>
    </Box>
  )
}