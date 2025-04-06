import React, { useEffect, useState } from 'react'
import {
  Box,
  FormControl,
  Input,
  InputBase,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow
} from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'

import useStyles from '../Product/style'
import { useAlertSnackbar } from '../../context/alertSnackbarContext'
import { ButtonSuccess } from '../../components/Buttons'
import api from '../../services/api'

export default function BarCode({ handleRenderBox }) {
  const [ search, setSearch ] = useState('')
  const [ typeSearch, setTypeSearch ] = useState('NOME')
  const [ productsSearch, setProductsSearch ] = useState([])
  const [ productSelect, setProductSelect ] = useState()
  const [ barCode, setBarCode ] = useState('')
  const [ serialNumberSelect, setSerialNumberSelect ] = useState('')
  const [ serialsNumber, setSerialsNumber ] = useState([])
  const [ disable, setDisable ] = useState(false)
  const classes = useStyles()
  const { setAlertSnackbar } = useAlertSnackbar()

  useEffect(() => {
    document.getElementById('searchProduct').focus()
  }, [])

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

  const handleSelectProduct = async product => {
    setProductsSearch([])
    setProductSelect(product)
    setSearch(product.name)

    if (!!product.barCode) {
      setBarCode(product.barCode)
      setDisable(true)

      const { data } = await api.get('serial/product', {
        params: { code: product.code }
      })

      setSerialsNumber(data)

      document.getElementById('serialNumberId').focus()
      return
    }

    document.getElementById('barCode').focus()
  }

  const handleUpdateBarCode = async () => {
    setDisable(true)

    try {
      if (barCode === '') {
        return
      }

      await api.put('product/barcode', { barCode, code: productSelect.code })

      document.getElementById('serialNumberId').focus() 
    } catch (error) {
      console.log(error)
      setDisable(false)
      setBarCode('')

      if (error.response) {
        console.log(error.response.data)
        if (error.response.data === 'barCode already') {
          setAlertSnackbar('Código de barras já usado em outro produto!')
        } else {
          setAlertSnackbar('Erro no servidor!')
        }
      } else {
        setAlertSnackbar('Erro no servidor!')
      }
    }
  }

  const handleCreateSerial = async () => {
    try {
      setSerialNumberSelect('')

      if (barCode !== '') {
        const { data } = await api.post('serial/first', {
          serialNumber: serialNumberSelect,
          productId: productSelect.code,
          module: 'single'
        })
  
        setSerialsNumber([...serialsNumber, data.serialNumberResponse])
      }
    } catch (error) {
      console.log(error)

      if (error.response) {
        console.log(error.response.data)

        if (error.response.data === 'the serial number already exists and is not finalized!') {
          setAlertSnackbar('Número de série já foi dado entrada em outro produto!')
        }
      }
    }
  }

  const handleReset = () => {
    setSearch('')
    setDisable(false)
    setProductsSearch([])
    setBarCode('')
    setSerialNumberSelect('')
    setSerialsNumber([])
    setTimeout(()=> {
      document.getElementById('searchProduct').focus()
    }, [10])
  }

  return (
    <Box>
      <form>
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
              disabled={disable}
            />
          </div>

          <Box style={{ position: 'relative' }}>
            <div className={classes.search}  style={{ width: '100%' }}>
              <InputBase
                style={{ width: '100%' }}
                placeholder="Código de Barras"
                id='barCode'
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                value={barCode}
                onChange={e => setBarCode(e.target.value)}
                disabled={disable}

                onKeyPress={e => e.key === 'Enter' && handleUpdateBarCode()}
              />
            </div>

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
      </form>

      <Input
        id='serialNumberId'
        autoComplete='off'
        style={{ width: '85%', marginTop: 20}}
        placeholder='Leitura número de série'
        value={serialNumberSelect}
        onChange={e => setSerialNumberSelect(e.target.value)}
        onKeyPress={e => e.key === 'Enter' && handleCreateSerial()}
      />

      <Box
        style={{
          padding: 4,
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'start'
        }}
      >Qtd: {serialsNumber.length}</Box>
      <Box component={Paper} style={{ marginTop: 20}}>
        <TableContainer>
          <Table size='small'>
            <TableBody>
              {serialsNumber.map((serialNumber, i) => (
                <TableRow hover key={i}> 
                  <TableCell>{serialNumber}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <ButtonSuccess onClick={handleReset} style={{marginTop: 12}}>Novo Produto</ButtonSuccess>
      <ButtonSuccess onClick={handleRenderBox} className={classes.btnAdd}>Voltar</ButtonSuccess>
    </Box>
  )
}