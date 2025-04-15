import React, { useState, useEffect } from 'react'
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  makeStyles,
  InputBase, 
  fade,
  Button,
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Box,
  Typography
} from "@material-ui/core"
import SearchIcon from '@material-ui/icons/Search'

import { useAlert } from '../../../context/alertContext'
import { useMaintenance } from '../../../context/maintenanceContext'

import api from '../../../services/api'
import { getDateBr } from '../../../functions/getDates'
import styleStatus from '../../../functions/styleStatus'
import EnhancedTableHead from '../../../components/EnhancedTableHead'
import { getComparator, stableSort } from '../../../functions/orderTable'

import ReportMaintenance from '../../../components/Reports/ReportMaintenance'
import ModalProcessMain from './ModalProcessMain'
import ModalStartMain from './ModalStartMain'
import ModalMain from './ModalMain'
import Modal from '../../../components/Modal'

const useStyle = makeStyles(theme => ({
  btnStartMain: {
    backgroundColor: theme.palette.secondary.dark,
    borderRadius: 5,
    color: '#FFF',
    textAlign: 'center',
    cursor: 'pointer',
    transition: '0.3s',
    '&:hover': {
      opacity: 0.3
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
    width: '100%',
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
  },
  paperTable: {
    borderRadius: 0
  },
  headCell: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.common.white,
    fontWeight: theme.typography.fontWeightBold,
    padding: theme.spacing(1),
  },
  inputDate: {
    background: 'rgba(0,0,0,0)',
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    height: '100%',
    border: 'none',
    color: theme.palette.common.white
  }
}))

export default function TableMain() {
  const [ order, setOrder ] = useState('asc')
  const [ orderBy, setOrderBy ] = useState('ID')
  const [search, setSearch] = useState('')
  const [typeSeach, setTypeSeach] = useState('STATUS')
  const [typesStatus, setTypesStatus] = useState('open')
  const [openModalMain, setOpenModalMain] = useState(false)
  const [openReport, setOpenReport] = useState(false)
  const [openModalProcess, setOpenModalProcess] = useState(false)
  const [openModalStart, setOpenModalStart] = useState(false)
  const [selectMain, setSelectMain] = useState({})
  const { maintenance, setMaintenance } = useMaintenance()
  const { setAlert } = useAlert()
  const classes = useStyle()

  useEffect(() => {
    api
      .get('/maintenancedeliv')
      .then( resp => {
        setMaintenance(resp.data)
      })
  },[setMaintenance])

  const clickMaintenance = (e, main) => {
    setSelectMain(main)
    if(e.target.id === 'btnStartMain') setOpenModalStart(true)
    else if (e.target.id === 'btnProcessMain') setOpenModalProcess(true)
    else setOpenModalMain(true)
  }

  const clickReport = () => {
    setOpenReport(true)
    setOpenModalMain(false)
  }

  const searchMain = async () => {
    try {
      var resp

      if (typeSeach === 'STATUS' && typesStatus === 'open') {
        resp = await api.get(`maintenancedeliv`)
      } else  if (typeSeach === 'STATUS' && typesStatus === 'close'){
        resp = await api.get(`maintenancedeliv/${typesStatus}/${search}`)
      } else {
        if (search !== '') {
          if (typeSeach === 'ID_SALE') {
            if (isNaN(parseInt(search))) {
              setAlert('Digite apenas números!') 
              return
            }
          }
          resp = await api.get(`maintenancedeliv/${typeSeach}/${search}`)
        } else {
          setAlert('Preencha o campo de pesquisa!') 
          return
        }
      }

      if (resp.data.length === 0){
        setAlert('Assistência(s) não encontrada(s)!') 
      } else {
        setMaintenance(resp.data)
      }
    } catch (e) {
      console.log(e)
      setAlert("Erro ao comunicar com o Servidor")
      setMaintenance([])
    }
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const headCell = [
    { id: 'ID', label: 'Código', class: classes.headCell },
    { id: 'ID_SALE', label: 'Cód. Venda.', class: classes.headCell },
    { id: 'NOMECLI', label: 'Cliente', class: classes.headCell },
    { id: 'PRODUTO', label: 'Produto', class: classes.headCell },
    { id: 'QUANTIDADE', label: 'QTD', class: classes.headCell },
    { id: 'D_PREV', label: 'Previsão', class: classes.headCell },
    { id: 'DESC_ABREV', label: 'Loja', class: classes.headCell },
    { id: 'Actions', label: '', class: classes.headCell }
  ]

  return (
    <>
      <Box className={classes.barHeader}>
        <FormControl variant="outlined">
          <InputLabel id="fieldSeach" className={classes.label}>Tipo</InputLabel>
          <Select
            label="Tipo"
            labelId="fieldSeach"
            className={classes.fieldSeach}
            onChange={e => setTypeSeach(e.target.value)}
            value={typeSeach}
          >
            <MenuItem value={'STATUS'}>STATUS</MenuItem>
            <MenuItem value={'ID_SALE'}>DAV</MenuItem>
            <MenuItem value={'NOMECLI'}>Cliente</MenuItem>
          </Select>
        </FormControl>

        {typeSeach !== 'STATUS' &&
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
              <InputBase
                placeholder="Pesquisar…"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }
              }
              inputProps={{ 'aria-label': 'search' }}
              onChange={e => setSearch(e.target.value)}
              onKeyPress={e => e.key === 'Enter' ? searchMain() : null}
            />
          </div>
        }
        {typeSeach === 'STATUS' &&
        <>
          <FormControl variant="outlined">
            <InputLabel id="fieldStatus" className={classes.label}>Estatus</InputLabel>
            <Select
              label="Status"
              labelId="fieldStatus"
              className={classes.fieldSeach}
              onChange={e => setTypesStatus(e.target.value)}
              value={typesStatus}
            >
              <MenuItem value={'open'}>Abertas</MenuItem>
              <MenuItem value={'close'}>Fechadas</MenuItem>
            </Select>
          </FormControl>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            {typesStatus !== 'open' &&
              <input 
                type="date" 
                className={classes.inputDate}
                onChange={e => setSearch(e.target.value)}
              /> 
            }
          </div>
        </>
        }

        <Button
          className={classes.btnSearch}
          onClick={searchMain}
        >Pesquisar</Button>
        <Box mt={1} ml={1}>
          <Typography color='secondary' style={{fontWeight: 'bold'}}> - QTD:{maintenance.length}</Typography>
        </Box>
      </Box>

      <TableContainer className={classes.paperTable} component={Paper}>
        <Table>
          <EnhancedTableHead
            order={order}
            orderBy={orderBy}
            classes={classes}
            headCells={headCell}
            onRequestSort={handleRequestSort}
          />
          <TableBody>
            {stableSort(maintenance, getComparator(order, orderBy)).map(main => (
              <TableRow key={main.ID} onClick={e =>clickMaintenance(e, main)}>
                <TableCell style={{width: '11%'}}>{main.ID}</TableCell>
                <TableCell style={{width: '11%'}}>{main.ID_SALE}</TableCell>
                <TableCell>{main.NOMECLI}</TableCell>
                <TableCell>{main.PRODUTO}</TableCell>
                <TableCell>{main.QUANTIDADE}</TableCell>
                <TableCell>{getDateBr(main.D_PREV)}</TableCell>
                <TableCell>{main.DESC_ABREV}</TableCell>
                <TableCell style={{width: '15%'}}>
                  {main.STATUS !== 'No CD'
                    ? <>
                        { (main.ID_DELIV_MAINT && (main.STATUS === 'Em lançamento' || main.STATUS === 'Finalizada'))
                          ? main.STATUS
                          : <div
                              style={styleStatus(main.STATUS)}
                              id="btnProcessMain"
                            >{main.STATUS}</div>
                        }
                      </>
                    : <div
                        className={classes.btnStartMain}
                        id="btnStartMain"
                      >Iniciar</div>
                  }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
        open={openModalStart}
        setOpen={setOpenModalStart}
        title="Iniciar Assistência"
      >
        <ModalStartMain
          setOpen={setOpenModalStart}
          selectMain={selectMain}
        />
      </Modal>

      <Modal
        open={openModalMain}
        setOpen={setOpenModalMain}
        title=""
      >
        <ModalMain
          clickReport={clickReport}
          maint={selectMain}
        />
      </Modal>

      <ReportMaintenance
        maintenance={selectMain}
        openModal={openReport}
        setOpenModal={setOpenReport}
      />

      <Modal
        open={openModalProcess}
        setOpen={setOpenModalProcess}
        title="Processar Assistência"
      >
        <ModalProcessMain main={selectMain} setOpen={setOpenModalProcess}/>
      </Modal>
    </>
  )
}