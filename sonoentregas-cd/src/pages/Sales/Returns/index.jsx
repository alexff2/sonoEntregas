import React, { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Collapse,
  fade,
  FormControl,
  InputBase,
  InputLabel,
  makeStyles,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@material-ui/core'
import { KeyboardArrowDown, KeyboardArrowUp, Search as SearchIcon } from '@material-ui/icons'

import Status from '../../../components/Status'

const useStyles = makeStyles(theme => ({
  barHeader: {
    padding: theme.spacing(2),
    background: theme.palette.primary.main,
    display: 'flex',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      gap: 4
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      marginRight: theme.spacing(0)
    }
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
  inputDate: {
    background: 'rgba(0,0,0,0)',
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    height: '100%',
    border: 'none',
    color: theme.palette.common.white
  },
  label: {
    color: fade(theme.palette.common.white, 0.55)
  },
  fieldSearch: {
    color: fade(theme.palette.common.white, 0.55),
    height: '2.3rem',
    width: theme.spacing(20),
    marginRight: theme.spacing(2)
  },
  btnSearch: {
    background: theme.palette.primary.dark,
    color: theme.palette.common.white,
    [theme.breakpoints.down('sm')]: {
      padding: 8
    }
  },
  rowHeader: {
    backgroundColor: theme.palette.primary.light,
    '& th': {
      color: theme.palette.common.white,
    }
  },
  tdTableProduct: {
    padding: '0 36px'
  }
}))

const Row = ({item}) => {
  const [openProducts, setOpenProducts] = useState(false)
  const classes = useStyles()

  const setDeliveryId = async () => {
    console.log('Vinculando...'+item.id)
  }

  const resetReturn = async () => {
    console.log('Resetando...'+item.id)
  }

  return (
    <React.Fragment>
      <TableRow>
        <TableCell onClick={() => setOpenProducts(!openProducts)}>
          {openProducts ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
        </TableCell>
        <TableCell>{item.id}</TableCell>
        <TableCell>{item.saleId}</TableCell>
        <TableCell>{item.client}</TableCell>
        <TableCell align='right'>{item.district}</TableCell>
        <TableCell style={{display: 'flex', justifyContent: 'end'}}>
          {
            item.status === 'P' &&
            <Status
              variant='red'
              onClick={setDeliveryId}
            >Pendente</Status>
          }
          {
            item.status === 'T' &&
            <Status
              variant='orange'
              onClick={resetReturn}
            >Rota: {item.deliveryId}</Status>
          }
          {
            item.status === 'F' &&
            <Status
              variant='green'
            >Finalizada</Status>
          }
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={6} className={classes.tdTableProduct}>
          <Collapse in={openProducts}>
            <Table size='small'>
              <TableHead>
                <TableRow>
                  <TableCell>Código</TableCell>
                  <TableCell>Alternativo</TableCell>
                  <TableCell>Produto</TableCell>
                  <TableCell align='right'>Qtd</TableCell>
                  <TableCell align='right'>Qtd Bip</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  item.products.map(product =>(
                    <TableRow key={product.id}>
                      <TableCell>{product.id}</TableCell>
                      <TableCell>{product.generalCode}</TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell align='right'>{product.quantity}</TableCell>
                      <TableCell align='right'>{product.quantityBeep}</TableCell>
                    </TableRow>
                  ))
                }
              </TableBody>
            </Table>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  )
}

export default function Returns(){
  const classes = useStyles()
  const [typeSearch, setTypeSearch] = useState('salesId')
  const [search, setSearch] = useState('')
  const [returns, setReturns] = useState([])

  useEffect(() => {
    setReturns([
      {
        id: 100,
        saleId: 234680,
        client: 'MARIA DA CONCEICAO RAMARIO DA SILVA LARRAVAGIERE',
        district: 'SAO RAIMUNDO',
        status: 'T',
        deliveryId: 15234,
        products: [
          {
            id: 1244,
            generalCode: '1541-4',
            name: 'COLCHAO MODENA 31 X 198 X 193',
            quantity: 2,
            quantityBeep: 0,
          },
          {
            id: 1245,
            generalCode: '1541-4',
            name: 'Base Sued Black Bordada 31 X 200 X 100',
            quantity: 2,
            quantityBeep: 0,
          },
        ]
      },
      {
        id: 101,
        saleId: 234680,
        client: 'MARIA DA CONCEICAO RAMARIO DA SILVA LARRAVAGIERE',
        district: 'SAO RAIMUNDO',
        status: 'T',
        deliveryId: 15234,
        products: [
          {
            id: 1244,
            generalCode: '1541-4',
            name: 'COLCHAO MODENA 31 X 198 X 193',
            quantity: 2,
            quantityBeep: 0,
          },
          {
            id: 1245,
            generalCode: '1541-4',
            name: 'Base Sued Black Bordada 31 X 200 X 100',
            quantity: 2,
            quantityBeep: 0,
          },
        ]
      },
    ])
  }, [])

  const searchSalesReturn = async () => {}

  return (
    <Paper style={{ padding: 20}}>
      <Box className={classes.barHeader}>
        <FormControl variant="outlined">
          <InputLabel id="fieldSearch" className={classes.label}>Tipo</InputLabel>
          <Select
            label="Tipo"
            labelId="fieldSearch"
            className={classes.fieldSearch}
            value={typeSearch}
            onChange={e => {
              setTypeSearch(e.target.value)
              setSearch('')
            }}
          >
            <MenuItem value={'salesId'}>Código Venda</MenuItem>
            <MenuItem value={'client'}>Nome Cliente</MenuItem>
          </Select>
        </FormControl>

        <div className={classes.search}>
          <div className={classes.searchIcon}>
            <SearchIcon />
          </div>
          <InputBase
            placeholder="Pesquisar…"
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
            inputProps={{ 'aria-label': 'search' }}
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && searchSalesReturn()}
          />
        </div>

        <Button className={classes.btnSearch} onClick={searchSalesReturn}>Pesquisar</Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow className={classes.rowHeader}>
              <TableCell></TableCell>
              <TableCell>Código</TableCell>
              <TableCell>DAV</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell align='right'>Bairro</TableCell>
              <TableCell align='right'>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              returns.map(item => (
                <Row key={item.id} item={item}/>
              ))
            }
            
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}
