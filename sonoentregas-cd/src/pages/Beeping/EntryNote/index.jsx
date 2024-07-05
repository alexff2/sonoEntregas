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

      setTimeout(() => {
        setProducts([
          {
            group: 'IMPERIAL AUXILIAR MOL/ESPU SOLTEIRAO',
            products: [
              {
                id: 1,
                mask: '11 X 188 X 93',
                nameFull: 'PRODUTO: IMPERIAL AUXILIAR MOL/ESPU SOLTEIRAO 11 X 188 X 93',
                quantify: 2,
                quantifyBeep: 0,
                quantifyPedding: 2,
              },
              {
                id: 2,
                mask: '11 X 100 X 200',
                nameFull: 'PRODUTO: IMPERIAL AUXILIAR MOL/ESPU SOLTEIRAO 11 X 100 X 200',
                quantify: 2,
                quantifyBeep: 2,
                quantifyPedding: 0,
              }
            ]
          },
          {
            group: 'CABECEIRA PISA MARROM',
            products: [
              {
                id: 3,
                mask: '11 X 188 X 93',
                nameFull: 'CABECEIRA PISA MARROM 11 X 188 X 93',
                quantify: 2,
                quantifyBeep: 1,
                quantifyPedding: 1,
              },
              {
                id: 4,
                mask: '140 X 124 X 11',
                nameFull: 'CABECEIRA PISA MARROM 140 X 124 X 11',
                quantify: 12,
                quantifyBeep: 8,
                quantifyPedding: 4,
              }
            ]
          },
          {
            group: 'BASE SUED CHOCOLATE INVERT BORDADA',
            products: [
              {
                id: 7,
                mask: '26 X 99 X 158',
                nameFull: 'BASE SUED CHOCOLATE INVERT BORDADA 26 X 99 X 158',
                quantify: 15,
                quantifyBeep: 15,
                quantifyPedding: 0,
              },
              {
                id: 8,
                mask: '26 X 101,5 X 193',
                nameFull: 'BASE SUED CHOCOLATE INVERT BORDADA 26 X101,5 X 193',
                quantify: 2,
                quantifyBeep: 0,
                quantifyPedding: 2,
              }
            ]
          },
          {
            group: 'BASE SUED CHOCOLATE INVERT BORDADA',
            products: [
              {
                id: 9,
                mask: '26 X 99 X 158',
                nameFull: 'BASE SUED CHOCOLATE INVERT BORDADA 26 X 99 X 158',
                quantify: 15,
                quantifyBeep: 15,
                quantifyPedding: 0,
              },
              {
                id: 10,
                mask: '26 X 101,5 X 193',
                nameFull: 'BASE SUED CHOCOLATE INVERT BORDADA 26 X101,5 X 193',
                quantify: 2,
                quantifyBeep: 0,
                quantifyPedding: 2,
              }
            ]
          },
          {
            group: 'BASE SUED CHOCOLATE INVERT BORDADA',
            products: [
              {
                id: 5,
                mask: '26 X 99 X 158',
                nameFull: 'BASE SUED CHOCOLATE INVERT BORDADA 26 X 99 X 158',
                quantify: 15,
                quantifyBeep: 15,
                quantifyPedding: 0,
              },
              {
                id: 6,
                mask: '26 X 101,5 X 193',
                nameFull: 'BASE SUED CHOCOLATE INVERT BORDADA 26 X101,5 X 193',
                quantify: 2,
                quantifyBeep: 0,
                quantifyPedding: 2,
              }
            ]
          },
        ])
        setOpenSearch(false)
        setLoading(false)
      }, 1000)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <React.Fragment>
      {
        !openSearch &&
        <BeepReading.Root>
          <BeepReading.Header
            title={'BEEP DA NOTA DE ENTRADA Nº: 123321'}
            productSelected={productSelected}
            module={'purchaseNote'}
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