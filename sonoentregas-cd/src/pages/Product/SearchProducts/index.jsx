import React, { useState } from "react"
import { 
  Box,
  InputBase, 
  Table, 
  TableContainer, 
  TableHead, 
  TableRow, 
  TableCell,
  TableBody, 
  Paper, 
  Button, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel 
} from "@material-ui/core"
import SearchIcon from '@material-ui/icons/Search'

import { useAlertSnackbar } from '../../../context/alertSnackbarContext'

import useStyles from '../style'

import api from '../../../services/api'

export default function SearchProducts() {
  const [ products, setProducts ] = useState([])
  const [ search, setSearch ] = useState()
  const [ typeSearch, setTypeSearch ] = useState('NOME')
  const classes = useStyles()
  const { setAlertSnackbar } = useAlertSnackbar()
  
  const searchProduct = async () => {
    try {
      if (search !== '') {
        const { data } = await api.get('products', {
          params: {
            search,
            typeSearch
          }
        })
        setProducts(data)
      } else {
        setProducts([])
      }
    } catch (e) {
      setAlertSnackbar(e)
      setProducts([])
    }
  }

  return(
    <Box>
      <Box className={classes.barHeader}>
        <FormControl variant="outlined">
          <InputLabel id="fieldSearch" className={classes.label}>Tipo</InputLabel>
          <Select
            label="Tipo"
            labelId="fieldSearch"
            className={classes.fieldSearch}
            onChange={e => setTypeSearch(e.target.value)}
            defaultValue={'NOME'}
          >
            <MenuItem value={'NOME'}>Descrição</MenuItem>
            <MenuItem value={'COD_ORIGINAL'}>Código</MenuItem>
          </Select>
        </FormControl>

        <div className={classes.search}>
          <div className={classes.searchIcon}>
            <SearchIcon/>
          </div>
          <InputBase
            placeholder="Pesquisar…"
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
            inputProps={{ 'aria-label': 'search' }}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={ e => e.key === 'Enter' && searchProduct()}
          />
        </div>

        <Button className={classes.btnSearch} onClick={searchProduct}>Pesquisar</Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow className={classes.rowHeader}>
              <TableCell>Código</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell align="right">Qtd. Total</TableCell>
              <TableCell align="right">Qtd. Reservado</TableCell>
              <TableCell align="right">Qtd. Disponível</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map( product => (
            <TableRow key={product.COD_ORIGINAL}>
              <TableCell>{product.COD_ORIGINAL}</TableCell>
              <TableCell>{product.NOME}</TableCell>
              <TableCell align="right">{product.EST_LOJA}</TableCell>
              <TableCell align="right">{product.EST_RESERVA}</TableCell>
              <TableCell align="right">{product.EST_DISPONIVEL}</TableCell>
            </TableRow>
            ))}

          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

