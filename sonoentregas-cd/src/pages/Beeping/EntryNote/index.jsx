import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
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
  const [beepById, setBeepById] = useState(true)
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

  const handleChangeRadioTypeBeep = e => {
    setBeepById(e.target.value === '1' ? true : false)
  }

  return (
    <React.Fragment>
      {
        !openSearch &&
        <BeepReading.Root>
          <BeepReading.Header
            title={`BEEP DA NOTA DE ENTRADA Nº: ${search}`}
            productSelected={productSelected}
            setProductSelected={setProductSelected}
            module={{
              name: 'purchaseNote',
              type: 'C',
              beepById
            }}
            setProducts={setProducts}
            products={products}
          />

          <BeepReading.Products
            data={products}
            productSelected={productSelected}
            setProductSelected={setProductSelected}
            beepById={beepById}
          />

          <BeepReading.Footer handleRenderBox={handleRenderBox} />
        </BeepReading.Root>
      }

      <Dialog open={openSearch} onClose={handleCloseSearch}>
        <DialogTitle>Digite o número da nota</DialogTitle>
        <DialogContent>
          <FormControl component='fieldset' fullWidth>
            <RadioGroup
              style={{
                flexDirection: 'row',
                width: '100%',
                justifyContent: 'space-between',
                marginBottom: 20,
                border: 'solid 1px var(--gray-bold)',
                borderRadius: 5,
                padding: 10
              }}
              value={beepById ? '1' : '0'}
              onChange={handleChangeRadioTypeBeep}
            >
              <FormControlLabel
                value='1'
                control={<Radio id='type1'/>}
                label='Novo'
                style={{
                  marginLeft: 0
                }}
              />
              <FormControlLabel
                value='0'
                control={<Radio id='type1'/>}
                label='Antigo'
                style={{
                  marginLeft: 0
                }}
              />
            </RadioGroup>
          </FormControl>
          <TextField
            id='searchId'
            placeholder='Digite aqui...'
            autoComplete='off'
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e =>  e.key === 'Enter' && handleSearch()}
            fullWidth
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