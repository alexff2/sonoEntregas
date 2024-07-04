import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogTitle,
  makeStyles,
  TextField
} from '@material-ui/core'

import { useAlertSnackbar } from '../../context/alertSnackbarContext' 

import { BeepReading } from '../../components/BeepReading'
import { ButtonSuccess } from '../../components/Buttons'
import api from '../../services/api'

const useStyle = makeStyles(theme => ({
  btn: {
    padding: theme.spacing(2),
    margin: theme.spacing(1),
    '&:hover': {
      background: theme.palette.success.light
    },
    background: theme.palette.success.main,
    color: theme.palette.common.white
  }
}))

export default function EntryNote({handleRenderBox}) {
  const [openSearch, setOpenSearch] = useState(true)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState([])
  const [productSelected, setProductSelected] = useState(null)
  const { setAlertSnackbar } = useAlertSnackbar()
  const classes = useStyle()

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
      const { data } = await api.get(`transfer/${search}/beep`)
      //console.log(data.products)
      setProducts(data.products)

      setOpenSearch(false)
      setLoading(false)
    } catch (error) {
      console.log(error.response)

      if (error.response.data === 'not found transfer!') {
        setAlertSnackbar('Transferência não encontrada!')
        setSearch('')
        document.getElementById('searchId').focus()
        setLoading(false)
      }
    }
  }

  return (
    <React.Fragment>
      {
        !openSearch &&
        <BeepReading.Root>
          <BeepReading.Header
            title={'BEEP DA TRANSFERÊNCIA Nº: 123321'}
            productSelected={productSelected}
            module={{
              name: 'transfer',
              type: productSelected?.type
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
        <DialogTitle>Digite o número da transferência</DialogTitle>
        <TextField
          id='searchId'
          placeholder='Digite aqui...'
          autoComplete='off'
          style={{
            padding: 4,
            margin: 4
          }}
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e =>  e.key === 'Enter' && handleSearch()}
        />
        <ButtonSuccess
          className={classes.btn}
          onClick={handleSearch}
          loading={loading}
        >Pesquisar</ButtonSuccess>
      </Dialog>
    </React.Fragment>
  )
}