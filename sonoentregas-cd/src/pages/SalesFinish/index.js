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

import { useShop } from '../../context/shopContext'

import api from '../../services/api'
import getDate from '../../functions/getDates'
import { getComparator, stableSort } from '../../functions/orderTable'

import EnhancedTableHead from '../../components/EnhancedTableHead'
import Modal from '../../components/Modal'
import ModalSales from './ModalSales'

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
  fieldSeach: {
    color: fade(theme.palette.common.white, 0.55),
    height: '2.3rem',
    width: theme.spacing(20),
    marginRight: theme.spacing(2),
  },
  btnSearch: {
    background: theme.palette.primary.dark,
    color: theme.palette.common.white
  },
  tableHead: {
    fontWeight: theme.typography.fontWeightBold
  },
  tableHeadCell: {
    textAlign: 'end',
    //color: theme.palette.common.white,
    fontWeight: theme.typography.fontWeightBold
  },
  tableHeadCellStart:{
    //color: theme.palette.common.white,
    fontWeight: theme.typography.fontWeightBold
  }
}))

export default function Product() {
  const [ order, setOrder ] = useState('asc')
  const [ orderBy, setOrderBy ] = useState('idSales')
  const [ sales, setSalesFinish ] = useState([])
  const [ search, setSearch ] = useState()
  const [ typeSeach, setTypeSeach ] = useState('ID_SALES')
  const [ openModalSales, setOpenModalSales ] = useState(false)
  const [ saleCurrent, setSaleCurrent ] = useState([])

  const { shop } = useShop()
  const classes = useStyles()
  
  const searchSales = async () => {
    try {
      if (search !== '') {
        const { data } = await api.get(`sales/${typeSeach}/${search}/finalizada`)
        setSalesFinish(data)
      } else {
        setSalesFinish([])
      }
    } catch (e) {
      alert(e)
      setSalesFinish([])
    }
  }

  const setShops = codShop => {
    const shopCurrent = shop[codShop]
    return shopCurrent.database
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const modalDetalsSales = sale => {
    setSaleCurrent(sale)
    setOpenModalSales(true)
  }

  const headCell = [
    { id: 'ID_SALES', numeric: false, disablePadding: false, label: 'Nº Venda', class: classes.tableHeadCellStart },
    { id: 'NOMECLI', numeric: false, disablePadding: false, label: 'Nome do Cliente', class: classes.tableHeadCellStart },
    { id: 'EMISSAO', numeric: true, disablePadding: false, label: 'Data Emissão', class: classes.tableHeadCell },
    { id: 'D_ENTREGA2', numeric: true, disablePadding: false, label: 'Data Entregue', class: classes.tableHeadCell },
    { id: 'CODLOJA', numeric: true, disablePadding: false, label: 'Loja', class: classes.tableHeadCell },
  ]

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
          defaultValue={'ID_SALES'}
        >
          <MenuItem value={'ID_SALES'}>Código Venda</MenuItem>
          <MenuItem value={'NOMECLI'}>Nome Cliente</MenuItem>
          <MenuItem value={'D_ENTREGA2'}>Data Entrega</MenuItem>
        </Select>
      </FormControl>

        <div className={classes.search}>
          <div className={classes.searchIcon}>
            <SearchIcon/>
          </div>
          { typeSeach === 'D_ENTREGA2' ?
            <input 
              type="date" 
              className={classes.inputDate}
              onChange={e => setSearch(e.target.value)}
            />:
            <InputBase
              placeholder="Pesquisar…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
              onChange={e => setSearch(e.target.value)}
            />
          }
        </div>

        <Button className={classes.btnSearch} onClick={searchSales}>Pesquisar</Button>

      </Box>
      
      <Box>
        <TableContainer component={Paper}>
          <Table>
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              headCells={headCell}
              classe={classes}
            />
            <TableBody>
              {stableSort(sales, getComparator(order, orderBy))
                .map( sale => (
                <TableRow key={sale.ID} onClick={() => modalDetalsSales(sale)}>
                  <TableCell>{sale.ID_SALES}</TableCell>
                  <TableCell>{sale.NOMECLI}</TableCell>
                  <TableCell align="right">{getDate(sale.EMISSAO)}</TableCell>
                  <TableCell align="right">{getDate(sale.D_ENTREGA2)}</TableCell>
                  <TableCell align="right">{setShops(sale.CODLOJA)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Modal 
        open={openModalSales}
        setOpen={setOpenModalSales}
        title="Detalhes da entrega"
        >
        <ModalSales
          setOpen={setOpenModalSales}
          sale={saleCurrent}
        />
      </Modal>
    </Box>
  )
}

