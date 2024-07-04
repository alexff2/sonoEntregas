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
  const [ search, setSearch ] = useState('')
  const [ typeSearch, setTypeSearch ] = useState('name')
  const classes = useStyles()
  const { setAlertSnackbar } = useAlertSnackbar()
  
  const searchProduct = async () => {
    try {
      if ((typeSearch === 'name' || typeSearch === 'generalCode') && search === '') {
        setAlertSnackbar('Digite algo na pesquisa!')        
        setProducts([])
        return
      } 

      const { data } = await api.get('products/stock', {
        params: {
          typeSearch,
          search
        }
      })
      setProducts(data.products)
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
            style={{width: 162}}
            onChange={e => setTypeSearch(e.target.value)}
            value={typeSearch}
          >
            <MenuItem value={'name'}>Descrição</MenuItem>
            <MenuItem value={'generalCode'}>Alternativo</MenuItem>
            <MenuItem value={'maior'}>Maior que 0</MenuItem>
            <MenuItem value={'igual'}>Igual a 0</MenuItem>
          </Select>
        </FormControl>

        <div className={classes.search}>
          <div className={classes.searchIcon}>
            <SearchIcon/>
          </div>
          { (typeSearch === 'generalCode' || typeSearch === 'name') &&
            <InputBase
              placeholder="Pesquisar…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && searchProduct()}
            />
          }
        </div>

        <Button className={classes.btnSearch} onClick={searchProduct}>Pesquisar</Button>
      </Box>

      <TableContainer component={Paper} style={{maxHeight: 'calc(100vh - 300px)'}}>
        <Table stickyHeader>
          <TableHead>
            <TableRow className={classes.rowHeader}>
              <TableCell>Código</TableCell>
              <TableCell>Alternativo</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell align="right">Estoque</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map( product => (
              <TableRow key={product.id}>
                <TableCell>{product.id}</TableCell>
                <TableCell>{product.generalCode}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell align="right">{product.stock}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

