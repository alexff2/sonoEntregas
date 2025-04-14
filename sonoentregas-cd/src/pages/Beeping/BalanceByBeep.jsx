import React from 'react'
import {
  Box,
  Dialog,
  DialogTitle,
  FormControl,
  Input,
  InputBase,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography
} from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'
import useStyles from '../Product/style'
import { useAlertSnackbar } from '../../context/alertSnackbarContext'
import { useBackdrop } from '../../context/backdropContext'
import { ButtonSuccess } from '../../components/Buttons'
import api from '../../services/api'

const BalanceByBeep = ({handleRenderBox}) => {
  const [ search, setSearch ] = React.useState('')
  const [ searchBalanceId, setSearchBalanceId ] = React.useState('')
  const [ openModalSearch, setOpenModalSearch ] = React.useState(true)
  const [ loading, setLoading ] = React.useState(false)
  const [ typeSearch, setTypeSearch ] = React.useState('NOME')
  const [ productsSearch, setProductsSearch ] = React.useState([])
  const [ productSelect, setProductSelect ] = React.useState('')
  const [ serialNumberSelect, setSerialNumberSelect ] = React.useState('')
  const [ openModalSelectProduct, setOpenModalSelectProduct ] = React.useState(false)
  const { setAlertSnackbar } = useAlertSnackbar()
  const { setOpenBackDrop } = useBackdrop()
  const classes = useStyles()

  const handleSearchProduct = async e => {
    setSearch(e.target.value)
    try {
      if (e.target.value.length > 3) {
        const { data } = await api.get('/product', {
          params: {
            type: typeSearch,
            search
          }
        })
  
        setProductsSearch(data)
      } else {
        setProductsSearch([])
      }
    } catch (error) {
      console.log(error)

      setAlertSnackbar('Erro no servidor!')
    }
  }

  const handleCreateSerial = async () => {
    const serialArray = serialNumberSelect.split(' ')
    if (serialArray.length > 1) {
      setAlertSnackbar('Número de série inválido!')
      setSerialNumberSelect('')
      document.getElementById('serialNumberId').focus()
      return
    }

    try {
      setOpenBackDrop(true)
      const { data } = await api.post('balance-by-beep/beep', {
        serialNumber: serialNumberSelect,
        balanceId: searchBalanceId
      })
      if (data.notFoundSerialNumber) {
        setOpenModalSelectProduct(true)
        setTimeout(() => {
          document.getElementById('searchProduct').focus()
        }, 100)
        return
      }
      setProductSelect(data.product)
      setSerialNumberSelect('')
    } catch (error) {
      setSerialNumberSelect('')
      console.log(error)
      if (error.response.data.message) {
        setAlertSnackbar(error.response.data.message)
      }
    } finally {
      setOpenBackDrop(false)
      document.getElementById('serialNumberId').focus()
    }
  }

  const handleSelectProduct = async product => {
    try {
      setOpenBackDrop(true)
      await api.post('balance-by-beep/beep-not-found', {
        serialNumber: serialNumberSelect,
        productId: product.code,
        balanceId: searchBalanceId
      })
      setProductSelect(product.name)
    } catch (error) {
      console.log(error)
      if (error.response.data.message) {
        setAlertSnackbar(error.response.data.message)
      }
    } finally {
      setSerialNumberSelect('')
      setProductsSearch([])
      setSearch('')
      setOpenBackDrop(false)
      setOpenModalSelectProduct(false)
      document.getElementById('serialNumberId').focus()
    }
  }

  const handleSearchBalance = async () => {
    try {
      if (searchBalanceId === '') {
        setAlertSnackbar('Pesquisa vazia!')
        document.getElementById('searchBalanceId').focus()
        return
      }

      setLoading(true)

      const { data } = await api.get(`balance-by-beep/${searchBalanceId}`)

      if (data.balance.dtFinish) {
        setAlertSnackbar('Número de balanço já finalizado!')
        setSearchBalanceId('')
        document.getElementById('searchBalanceId').focus()
        setLoading(false)
        return
      }

      localStorage.setItem('balanceId', searchBalanceId)
      setOpenModalSearch(false)
      setLoading(false)
      document.getElementById('serialNumberId').focus()
    } catch (error) {
      console.log(error)
      setSearchBalanceId('')
      document.getElementById('searchBalanceId').focus()
      setLoading(false)

      if (error.response.data.message) {
        setAlertSnackbar(error.response.data.message)
      } else {
        setAlertSnackbar('Erro interno!')
      }
    }
  }

  const handleCloseSearch = () => {
    setOpenModalSearch(false)
    handleRenderBox()
  }

  const handleClearLocalStorage = () => {
    localStorage.removeItem('balanceId')
    setOpenModalSearch(true)
    setSearchBalanceId('')
    setTimeout(() => {
      document.getElementById('searchBalanceId').focus()
    }, 100)
  }

  React.useEffect(() => {
    const balanceLocalStage = async () => {
      const balanceId = localStorage.getItem('balanceId')
      console.log('balanceId', balanceId)
      if (balanceId) {
        setOpenModalSearch(false)
        setSearchBalanceId(balanceId)
        return
      }

      setOpenModalSearch(true)
      setTimeout(() => {
        document.getElementById('searchBalanceId').focus()
      }, 100)
    }

    balanceLocalStage()
  }, [])

  return (
    <Box>
      <Box className={classes.barHeader} style={{ padding: 8 }}>
        <p style={{color: '#FFF'}}>
          Balanço Nº {searchBalanceId}
        </p>
        <p style={{color: '#FFF'}}>
          {productSelect}
        </p>
      </Box>

      <Input
        id='serialNumberId'
        autoComplete='off'
        style={{ width: '85%', marginTop: 20}}
        placeholder='Leitura número de série'
        value={serialNumberSelect}
        onChange={e => setSerialNumberSelect(e.target.value)}
        onKeyPress={e => e.key === 'Enter' && handleCreateSerial()}
      />

      <ButtonSuccess
        onClick={handleRenderBox}
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem'
        }}
      >Voltar</ButtonSuccess>
      <ButtonSuccess
        onClick={handleClearLocalStorage}
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          left: '1.5rem'
        }}
      >Recarregar</ButtonSuccess>

      <Dialog open={openModalSelectProduct} onClose={() => setOpenModalSelectProduct(false)} fullWidth>
        <Box p={2}>
          <Typography variant='h6'>Produto não encontrado</Typography>
          <Typography>Selecione o produto o qual pertence esse Nº de Série</Typography>

          <Box className={classes.barHeader}>
            <FormControl variant="outlined" style={{ width: '100%', marginBottom: 8 }}>
              <InputLabel id="fieldSearch" className={classes.label}>Tipo</InputLabel>
              <Select
                style={{ width: '100%' }}
                label="Tipo"
                labelId="fieldSearch"
                className={classes.fieldSearch}
                value={typeSearch}
                onChange={e => {
                  setSearch('')
                  setTypeSearch(e.target.value)
                  setProductsSearch([])
                }}
                defaultValue={'NOME'}
              >
                <MenuItem value={'NOME'}>Descrição</MenuItem>
                <MenuItem value={'code'}>Código</MenuItem>
              </Select>
            </FormControl>

            <div className={classes.search} style={{ width: '100%' }}>
              <div className={classes.searchIcon}>
                <SearchIcon/>
              </div>
              <InputBase
                id='searchProduct'
                style={{ width: '100%' }}
                autoComplete='off'
                placeholder="Pesquisar produto"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                inputProps={{ 'aria-label': 'search' }}
                value={search}
                onChange={handleSearchProduct}
              />
            </div>
          </Box>

          <Box style={{ position: 'relative', height: 200 }}>
          { productsSearch.length > 0 &&
            <TableContainer className={classes.tableSearch}>
              <Table size='small'>
                <TableBody>
                  {productsSearch.map((product, i) => (
                    <TableRow hover key={i} onClick={() => {
                      handleSelectProduct(product)
                    }}> 
                      <TableCell>{product.generalCode}</TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.barCode}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          }
          </Box>
        </Box>
      </Dialog>
      
      <Dialog open={openModalSearch} onClose={handleCloseSearch}>
        <DialogTitle>Digite o número do balanço</DialogTitle>
        <TextField
          id='searchBalanceId'
          placeholder='Digite aqui...'
          autoComplete='off'
          style={{
            padding: 4,
            margin: 4
          }}
          value={searchBalanceId}
          onChange={e => setSearchBalanceId(e.target.value)}
          onKeyDown={e =>  e.key === 'Enter' && handleSearchBalance()}
        />
        <ButtonSuccess
          className={classes.btn}
          onClick={handleSearchBalance}
          loading={loading}
        >Pesquisar</ButtonSuccess>
      </Dialog>
    </Box>
  )
}

export default BalanceByBeep