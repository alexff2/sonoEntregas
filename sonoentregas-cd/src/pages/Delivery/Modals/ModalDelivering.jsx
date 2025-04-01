import React, { useEffect, useState } from "react"
import { ButtonSuccess } from "../../../components/Buttons"
import {
  makeStyles,
  TextField,
  Divider,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from '@material-ui/core'

import { useDelivery } from "../../../context/deliveryContext"
import { useAlert } from '../../../context/alertContext'
import { useBackdrop } from '../../../context/backdropContext'

import api from "../../../services/api"

const useStyle = makeStyles(theme => ({
  errorDiv: {
    fontSize: 15,
    color: theme.palette.common.white,
    background: theme.palette.error.light,
    padding: 8
  },
  boxContainer: {
    width: 500,
    marginTop: 20,
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    '& > span' : {
      fontWeight: 'bold'
    }
  }
}))

export default function ModalDelivering({ setOpen, selectDelivery }){
  const [ date, setDate ] = useState('')
  const [ sales, setSales ] = useState([])
  const [ beepPendantProducts, setBeepPendantProducts ] = useState([])
  const [ error, setError ] = useState(false)
  const [ childrenError, setChildrenError ] = useState('')
  const [ disabledBtnSave, setDisabledBtnSave ] = useState(false)

  const classes = useStyle()
  const { setDelivery } = useDelivery()
  const { setAlert } = useAlert()
  const { setOpenBackDrop } = useBackdrop()

  useEffect(() => {
    setOpenBackDrop(true)
    const getDelivery = async () => {
      try {
        const { data: delivery } = await api.get(`/delivery/${selectDelivery.ID}/sales/view`)
        const { data: productsBeep } = await api.get('delivery', {
          params: {
            id: selectDelivery.ID,
          }
        })

        const pendantProducts = []

        productsBeep.deliveryProducts.forEach(group => {
          group.products.forEach(product => {
            if (product.quantityPedding > 0) {
              pendantProducts.push(product)
            }
          })
        })

        setSales(delivery.sales)
        setBeepPendantProducts(pendantProducts)
        setOpenBackDrop(false)
      } catch (error) {
        console.log(error)
        setOpenBackDrop(false)
      }
    }

    getDelivery()
  }, [selectDelivery, setOpenBackDrop])

  const delivering = async () => {
    try {
      if (date === '') {
        setError(true)
  
        setChildrenError('Selecione uma data válida!')

        return
      }

      setDisabledBtnSave(true)

      selectDelivery["sales"] = sales
      selectDelivery.STATUS = 'Entregando'
      selectDelivery['date'] = date
  
      selectDelivery.sales.forEach(sale =>{
        sale.products.forEach(produto => {
          produto.STATUS = 'Entregando'
          if (produto.QUANTIDADE !== (produto.QTD_DELIVERING + produto.QTD_DELIV)) produto['UPST'] = false
        }
      )})

      await api.put(`delivery/status/${selectDelivery.ID}`, selectDelivery)

      const {data} = await api.get('delivery/open')
      setDelivery(data)

      setOpen(false)
    } catch (e) {
      setDisabledBtnSave(false)

      if (!e.response){
        console.log(e)
        setAlert('Rede')
      } else if (e.response.status === 400){
        console.log(e.response.data)
        setAlert('Servidor')
      } else {
        console.log(e.response.data)
      }
    }
  }

  return(
    <>
      {beepPendantProducts.length > 0
        ?<Box>
          <div className={classes.errorDiv}>
            <span>Produtos abaixo pendentes de bipar!</span>
          </div>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Código</TableCell>
                <TableCell>Produto</TableCell>
                <TableCell>Qtd</TableCell>
                <TableCell>Qtd Bip</TableCell>
                <TableCell>Qtd Pen</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {beepPendantProducts.map((product, index) => (
                <TableRow key={index}>
                  <TableCell>{product.id}</TableCell>
                  <TableCell>{product.nameFull}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>{product.quantityBeep}</TableCell>
                  <TableCell>{product.quantityPedding}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
        :<div>
          <Divider />
          <Box className={classes.boxContainer}>
            <span>Selecione a data de saída:</span>
            <TextField
              type="date"
              onChange={e => setDate(e.target.value)}
              InputLabelProps={{
                shrink: true
              }}
            />

            <ButtonSuccess
              children={'SALVAR'}
              onClick={delivering}
              disabled={disabledBtnSave || beepPendantProducts.length > 0}
              loading={disabledBtnSave}
            />
          </Box>
          {error && <div className={classes.errorDiv}><span>{childrenError}</span></div>}
        </div>
      }
    </>
  )
}