import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField
} from '@material-ui/core'

import { useAlertSnackbar } from '../../context/alertSnackbarContext' 

import { BeepReading } from '../../components/BeepReading'
import { ButtonSuccess } from '../../components/Buttons'
import api from '../../services/api'

export default function Deliveries({handleRenderBox}) {
  const [openSearch, setOpenSearch] = useState(true)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [productSelected, setProductSelected] = useState(null)
  const [products, setProducts] = useState([])
  const [status, setStatus] = useState('')
  const { setAlertSnackbar } = useAlertSnackbar()

  useEffect(() => {
    setTimeout(() => {
      document.getElementById('searchId').focus()
    }, 500)
  }, [])

  const handleCloseSearch = () => {
    setOpenSearch(false)
    handleRenderBox()
  }

  const handleSearch = async () => {
    try {
      if (search === '') {
        setAlertSnackbar('Pesquisa vazia!')
        document.getElementById('searchId').focus()
        return
      }

      setLoading(true)
      const { data } = await api.get(`delivery`,{
        params: {
          id: search
        }
      })
      setProducts(data.deliveryProducts)
      setStatus(data.status)

      setOpenSearch(false)
      setLoading(false)
    } catch (error) {
      console.log(error)

      setSearch('')
      document.getElementById('searchId').focus()
      setLoading(false)

      if (error.response.data === 'Delivery not found') {
        setAlertSnackbar('Entrega não encontrada!')
      } else if (error.response.data === 'Delivery already beeped') {
        setAlertSnackbar('Entrega não tem retorno!')
      } else {
        setAlertSnackbar('Erro interno!')
      }
    }
  }

  return (
    <React.Fragment>
      {
        !openSearch &&
        <BeepReading.Root>
          <BeepReading.Header
            title={`BEEP DA ROTA Nº: ${search}`}
            isReturn={status === 'Finalizada'}
            productSelected={productSelected}
            module={{
              name: 'delivery',
              type: status === 'Finalizada' ? 'C' : 'D'
            }}
            setProducts={setProducts}
          />

          <BeepReading.Products
            data={products}
            productSelected={productSelected}
            setProductSelected={setProductSelected}
          />

          <BeepReading.Footer handleRenderBox={handleRenderBox} />
        </BeepReading.Root>
      }

      <Dialog open={openSearch} onClose={handleCloseSearch}>
        <DialogTitle>Digite o número da rota</DialogTitle>
        <DialogContent>
          <TextField
            id='searchId'
            placeholder='Digite aqui...'
            autoComplete='off'
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e =>  e.key === 'Enter' && handleSearch()}
          />
        </DialogContent>
        <DialogActions>
          <ButtonSuccess
            onClick={handleSearch}
            loading={loading}
          >Pesquisar</ButtonSuccess>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}