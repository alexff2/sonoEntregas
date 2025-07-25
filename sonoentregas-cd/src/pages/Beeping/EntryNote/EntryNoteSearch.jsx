import React from 'react'
import { useAlertSnackbar } from '../../../context/alertSnackbarContext'
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
import { ButtonSuccess } from '../../../components/Buttons'
import api from '../../../services/api'

export const EntryNoteSearch = ({
  setProducts,
  openSearch,
  setOpenSearch,
  handleRenderBox,
  setBeepById,
  beepById,
  entryNoteNumber,
  setEntryNoteNumber
}) => {
  const [loading, setLoading] = React.useState(false)
  const {setAlertSnackbar} = useAlertSnackbar()

  const handleCloseSearch = () => {
    setOpenSearch(false)
    handleRenderBox()
  }

  const handleSearch = async () => {
    try {
      if (entryNoteNumber === '') {
        setAlertSnackbar('Pesquisa vazia!')
        document.getElementById('searchId').focus()
        return
      }

      setLoading(true)
      const {data} = await api.get(`purchase/note/${entryNoteNumber}/beep`)
      setProducts(data.products)

      setOpenSearch(false)
    } catch (error) {
      console.log(error)
      setEntryNoteNumber('')
      document.getElementById('searchId').focus()
      setLoading(false)

      if (error.response.data === 'not found purchase note!') {
        setAlertSnackbar('Nota de entrada não encontrada!')
      } else {
        setAlertSnackbar('Erro interno!')
      }
    }
  }

  const handleChangeRadioTypeBeep = e => {
    setBeepById(e.target.value === '1' ? true : false)
    document.getElementById('searchId').focus()
  }

  React.useEffect(() => {
    setTimeout(() => {
      document.getElementById('searchId').focus()
    }, 500)
  }, [])

  return (
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
          value={entryNoteNumber}
          onChange={e => setEntryNoteNumber(e.target.value)}
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
  )
}