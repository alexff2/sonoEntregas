import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField
} from '@material-ui/core'

import { useAlertSnackbar } from '../../../context/alertSnackbarContext' 

import { BeepReading } from '../../../components/BeepReading'
import { ButtonSuccess } from '../../../components/Buttons'
import api from '../../../services/api'

export default function EntryNote({handleRenderBox}) {
  const [openSearch, setOpenSearch] = useState(true)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [productSelected, setProductSelected] = useState(null)
  const [products, setProducts] = useState([])
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
      const { data } = await api.get(`purchase/note/${search}/beep`)
      setProducts(data.products)

      setOpenSearch(false)
      setLoading(false)
    } catch (error) {
      console.log(error)
      setSearch('')
      document.getElementById('searchId').focus()
      setLoading(false)

      if (error.response.data === 'not found purchase note!') {
        setAlertSnackbar('Transferência não encontrada!')
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
            title={`BEEP DA NOTA DE ENTRADA Nº: ${search}`}
            productSelected={productSelected}
            module={{
              name: 'purchaseNote',
              type: 'C'
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
        <DialogTitle>Digite o número da nota</DialogTitle>
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