import React, { useState } from "react"
import { 
  Box, 
  makeStyles, 
  InputBase, 
  fade, 
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

import api from '../../services/api'

const useStyles = makeStyles(theme => ({
  barHeader: {
    padding: theme.spacing(2),
    background: theme.palette.primary.main,
    display: 'flex'
    //flexGrow: 1
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    width: '60%'
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.common.white
  },
  inputRoot: {
    color: theme.palette.common.white,
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
  label: {
    color: fade(theme.palette.common.white, 0.55)
  },
  fieldSeach: {
    color: fade(theme.palette.common.white, 0.55),
    height: '2.3rem',
    width: theme.spacing(15),
    marginRight: theme.spacing(2),
  },
  btnSearch: {
    background: theme.palette.primary.dark,
    color: theme.palette.common.white
  }
}))

export default function Product() {
  const [ products, setProducts ] = useState([])
  const [ search, setSearch ] = useState()
  const [ typeSeach, setTypeSeach ] = useState('NOME')
  const classes = useStyles()
  
  const searchProduct = async () => {
    try {
      if (search !== '') {
        const { data } = await api.get(`products/${typeSeach}/${search}`)
        setProducts(data)
      } else {
        setProducts([])
      }
    } catch (e) {
      alert(e)
      setProducts([])
    }
  }

  return(
    <Box>
      <Box className={classes.barHeader}>

      <FormControl variant="outlined">
        <InputLabel id="fieldSeach" className={classes.label}>Tipo</InputLabel>
        <Select
          label="Tipo"
          labelId="fieldSeach"
          className={classes.fieldSeach}
          onChange={e => setTypeSeach(e.target.value)}
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
          />
        </div>

        <Button className={classes.btnSearch} onClick={searchProduct}>Pesquisar</Button>

      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
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
              <TableCell align="right">{product.EST_ATUAL}</TableCell>
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

