import React, { useEffect, useState } from 'react'
import {
  Box,
  FormControl,
  InputBase,
  InputLabel,
  MenuItem,
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

  const handleReset = () => {
    setSearch('')
    setDisable(false)
    setProductsSearch([])
    setBarCode('')
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

      <ButtonSuccess onClick={handleReset} style={{marginTop: 12}}>Novo Produto</ButtonSuccess>
      <ButtonSuccess onClick={handleRenderBox} className={classes.btnAdd}>Voltar</ButtonSuccess>
    </Box>
  )
}