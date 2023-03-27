import React, { useState } from "react"
import { 
  Box, 
  makeStyles, 
  InputBase, 
  fade, 
  Table, 
  Collapse,
  IconButton,
  Typography,
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
import { KeyboardArrowDown, KeyboardArrowUp} from '@material-ui/icons'

import { useAddress } from '../../context/addressContext'

import api from '../../services/api'
import { getDateBr } from '../../functions/getDates'
import { getComparator, stableSort } from '../../functions/orderTable'

import EnhancedTableHead from '../../components/EnhancedTableHead'
import Modal from '../../components/Modal'
import ModalAlert from '../../components/ModalAlert'
import ModalSales from './ModalSales'
import ModalUpdateDateDeliv from './ModalUpdateDateDeliv'
import BoxInfo from "../../components/BoxInfo"

const useStyles = makeStyles(theme => ({
  root: {
    '& > *': {
      borderBottom: 'unset'
    },
    '&:hover': {
      background: theme.palette.primary.light
    }
  },
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
    marginRight: theme.spacing(2)
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
  },
  updateDateDeliv: {
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.15),
    }
  }
}))

function Row({ sale, modalDetalProduct, setOpenModalBoxInfo }) {
  const [open, setOpen] = useState(false)
  const [openModalUpdaDate, setOpenModalUpdaDate] = useState(false)
  const classes = useStyles()
  const { setAddress } = useAddress()

  const setInfoInBox = () => {
    setOpenModalBoxInfo(true)
    setAddress({
      OBS2: sale.OBS2,
      ENDERECO: sale.ENDERECO,
      PONTOREF: sale.PONTOREF,
      OBS: sale.OBS,
      SCHEDULED: sale.SCHEDULED,
      OBS_SCHEDULED: sale.OBS_SCHEDULED
    })
  }

  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell
          style={sale.HAVE_OBS2 ? {color: 'Red', fontWeight: 700, cursor: 'pointer'}: {cursor: 'pointer'}}
          onClick={setInfoInBox}
          >{sale.ID_SALES}</TableCell>
        <TableCell>{sale.NOMECLI}</TableCell>
        <TableCell align="right">{getDateBr(sale.EMISSAO)}</TableCell>
        <TableCell align="right" onClick={()=>setOpenModalUpdaDate(true)} className={classes.updateDateDeliv}>
          {getDateBr(sale.D_ENTREGA1)}
        </TableCell>
        <TableCell align="right">{sale.SHOP}</TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                Produtos
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Código</TableCell>
                    <TableCell>Descrição</TableCell>
                    <TableCell>Quantidade</TableCell>
                    <TableCell align="right">Valor (R$)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sale.products.map((produto) => (
                    <TableRow key={produto.CODPRODUTO} onClick={() => modalDetalProduct(sale, produto)}>
                      <TableCell component="th" scope="row">
                        {produto.COD_ORIGINAL}
                      </TableCell>
                      <TableCell>{produto.NOME}</TableCell>
                      <TableCell>{produto.QUANTIDADE}</TableCell>
                      <TableCell align="right">{
                        Intl
                          .NumberFormat('pt-br',{style: 'currency', currency: 'BRL'})
                          .format(produto.NVTOTAL)
                      }</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>

      <ModalUpdateDateDeliv 
        open={openModalUpdaDate}
        setOpen={setOpenModalUpdaDate}
        saleCurrent={sale}
      />
    </React.Fragment>
  );
}

export default function Sales() {
  const [ openModalProduct, setOpenModalProduct ] = useState(false)
  const [ openModalBoxInfo, setOpenModalBoxInfo ] = useState(false)
  const [ openModalAlert, setOpenModalAlert ] = useState(false)
  const [ childrenAlert, setChildrenAlert ] = useState(false)
  const [ order, setOrder ] = useState('asc')
  const [ orderBy, setOrderBy ] = useState('idSales')
  const [ sales, setSales ] = useState([])
  const [ search, setSearch ] = useState('')
  const [ typeSearch, setTypeSearch ] = useState('ID_SALES')
  const [ saleCurrent, setSaleCurrent ] = useState([])
  const [ productCurrent, setProductCurrent ] = useState([])

  const classes = useStyles()
  
  const searchSales = async () => {
    try {
      if (search !== '') {
        const response = await api.get(`sales/`, {
          params: {
            typeSearch,
            search
          }
        })

        if (response.data === ''){
          console.log(response)
          setChildrenAlert('Venda(s) não encontrada(s)!') 
          setOpenModalAlert(true)
        } else {
          setSales(response.data)
        }
      } else {
        setChildrenAlert('Preencha o campo de pesquisa!') 
        setOpenModalAlert(true)
        setSales([])
      }
    } catch (e) {
      console.log(e.response)
      if (e.response.status === 400) {
        setChildrenAlert("Requisição Incorreta (Verifique valor digitado)!")
        setOpenModalAlert(true)
        setSales([])
      } else {
        setChildrenAlert("Erro ao comunicar com o Servidor")
        setOpenModalAlert(true)
        setSales([])
      }
    }
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const modalDetalProduct = (sale, product) => {
    setOpenModalProduct(true)
    setSaleCurrent(sale)
    setProductCurrent(product)
  }

  const headCell = [
    { id: '', numeric: false, disablePadding: false, label: '', class: classes.tableHeadCellStart },
    { id: 'ID_SALES', numeric: false, disablePadding: false, label: 'Nº Venda', class: classes.tableHeadCellStart },
    { id: 'NOMECLI', numeric: false, disablePadding: false, label: 'Nome do Cliente', class: classes.tableHeadCellStart },
    { id: 'EMISSAO', numeric: true, disablePadding: false, label: 'Emissão', class: classes.tableHeadCell },
    { id: 'D_ENTREGA1', numeric: true, disablePadding: false, label: 'Previsão', class: classes.tableHeadCell },
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
            onChange={e => {
              setTypeSearch(e.target.value)
              setSearch('')
            }}
            defaultValue={'ID_SALES'}
          >
            <MenuItem value={'ID_SALES'}>Código Venda</MenuItem>
            <MenuItem value={'NOMECLI'}>Nome Cliente</MenuItem>
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
            onKeyPress={e => e.key === 'Enter' ? searchSales() : null}
          />
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
                <Row 
                  key={sale.ID} 
                  modalDetalProduct={modalDetalProduct}
                  sale={sale}
                  setOpenModalBoxInfo={setOpenModalBoxInfo}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/*Modal sales product details*/}
      <Modal 
        open={openModalProduct}
        setOpen={setOpenModalProduct}
        title={false}
        >
        <ModalSales
          sale={saleCurrent}
          product={productCurrent}
        />
      </Modal>

      {/*Modal update date delivery*/}
      <Modal
        open={openModalBoxInfo}
        setOpen={setOpenModalBoxInfo}
        >
        <BoxInfo loc="Modal"/>
      </Modal>

      <ModalAlert open={openModalAlert} setOpen={setOpenModalAlert}>
        {childrenAlert}
      </ModalAlert>
    </Box>
  )
}

