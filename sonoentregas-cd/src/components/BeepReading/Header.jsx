import React, { useState } from 'react'
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
    paddingLeft: 8
  },
  textHeader: {
    color: 'white',
  }
}))

export function Header({
  productSelected,
  title,
  module,
  setProducts,
  isReturn
}) {
  const [serialNumber, setSerialNumber] = useState('')
  const classes = useStyle()
  const { setAlertSnackbar } = useAlertSnackbar()

  const beepProduct = async () => {
    if (productSelected.quantityPedding === 0) {
      return
    }

    try {
      if (module.type === 'C') {
        await api.post('serial/first', {
          serialNumber,
          productId: productSelected.id,
          module: module.name === 'delivery' ? productSelected.module : module.name,
          moduleId: productSelected.moduleId
        })
      } else {
        await api.put('serial/finished', {
          serialNumber,
          productId: productSelected.id,
          module: module.name === 'delivery' ? productSelected.module : module.name,
          moduleId: productSelected.moduleId
        })
      }

      setProducts(productsGroup => {
        return productsGroup.map(productGroup => {
          return {
            ...productGroup,
            products: productGroup.products.map(product => {
              if(product.module) {
                if (product.id === productSelected.id && product.module === productSelected.module) {
                  productSelected.quantityPedding -= 1
                  productSelected.quantityBeep += 1
  
                  return productSelected
                }
              } else {
                if (product.id === productSelected.id) {
                  productSelected.quantityPedding -= 1
                  productSelected.quantityBeep += 1
  
                  return productSelected
                }
              }
    
              return product
            })
          }
        })
      })
      setSerialNumber('')
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
    if (productSelected.quantityPedding > 0) {
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
        disabled={!productSelected}
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