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
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  Search as SearchIcon,
  Print as PrintIcon
} from '@material-ui/icons'

import api from '../../../services/api'
import { getDateSql } from '../../../functions/getDates'
import { useBackdrop } from '../../../context/backdropContext'
import { useAlert } from '../../../context/alertContext'
import Status from '../../../components/Status'
import Modal from '../../../components/Modal'
import { ButtonSuccess } from '../../../components/Buttons'
import ReportContainer from '../../../components/Reports'
import ProofOfReturn from './ProofOfReturn'

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

const Row = ({item, clickStatus, printProof}) => {
  const [openProducts, setOpenProducts] = useState(false)
  const classes = useStyles()

  const statusColor = {
    'Pendente': 'red',
    'Buscando': 'orange',
    'Devolvido': 'green'
  }

  return (
    <React.Fragment>
      <TableRow>
        <TableCell onClick={() => setOpenProducts(!openProducts)}>
          {openProducts ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
        </TableCell>
        <TableCell>{item.id}</TableCell>
        <TableCell>{item.originalSaleId}</TableCell>
        <TableCell>{item.client}</TableCell>
        <TableCell align='right'>{item.district}</TableCell>
        <TableCell align='right'>{item.shop}</TableCell>
        <TableCell style={{display: 'flex', justifyContent: 'end'}}>          
          <Status
            variant={statusColor[item.status]}
            onClick={() => clickStatus(item)}
            style={item.status !== 'Devolvido' ? {cursor: 'pointer'} : {}}
          >{item.status}</Status>
          {
            item.status === 'Buscando' && (
              <Box
                style={{marginLeft: 11, cursor: 'pointer'}}
                onClick={() => printProof(item)}
              >
                <PrintIcon />
              </Box>
            )
          }
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={6} className={classes.tdTableProduct}>
          <Collapse in={openProducts}>
            <Table size='small'>
              <TableHead>
                <TableRow>
                  <TableCell>Alternativo</TableCell>
                  <TableCell>Produto</TableCell>
                  <TableCell align='right'>Qtd</TableCell>
                  {
                    process.env.REACT_APP_STOCK_BEEP === '1' &&
                    <TableCell align='right'>Qtd Bip</TableCell>
                  }
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  item.products.map(product =>(
                    <TableRow key={product.id}>
                      <TableCell>{product.alternativeCode}</TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell align='right'>{product.quantity}</TableCell>
                      {
                        process.env.REACT_APP_STOCK_BEEP === '1' &&
                        <TableCell align='right'>{product.quantityBeep}</TableCell>
                      }
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
  const [openModal, setOpenModal] = useState(false)
  const [openPrint, setOpenPrint] = useState(false)
  const [returnSaleSelect, setReturnSaleSelect] = useState(null)
  const [deliveries, setDeliveries] = useState([])
  const [deliveryIdSelected, setDeliveryIdSelected] = useState('')
  const [typeSearch, setTypeSearch] = useState('client')
  const [search, setSearch] = useState('')
  const [returns, setReturns] = useState([])
  const {setOpenBackDrop} = useBackdrop()
  const {setAlert} = useAlert()

  useEffect(() => {
    const searchOpenReturns = async () => {
      setOpenBackDrop(true)
      try {
        const {data} = await api.get('returns/open')
        setReturns(data.returns)
        setOpenBackDrop(false)
      } catch (error) {
        console.log(error)
        setOpenBackDrop(false)
        
        if (!error.response) {
          setAlert('Sem comunicação com servidor!')
        }
      }
    }

    searchOpenReturns()
  }, [setOpenBackDrop, setAlert])

  const searchSalesReturn = async () => {
    try {
      if (typeof search === 'object') {
        if (search.dateStart > search.dateFinish) {
          setAlert('Data inicial maior que data final!')
          return
        } else if (search.dateStart === '' || search.dateFinish === '') {
          setAlert('Preencha as datas!')
          return
        }
      } else if (search === '') {
        setAlert('Preencha o campo de pesquisa!')
        return
      }

      setOpenBackDrop(true)
      const { data } = await api.get('/returns', {
        params: {
          typeSearch,
          search,
          dateStart: search.dateStart,
          dateFinish: search.dateFinish
        }
      })
      setReturns(data.salesReturns)
      setOpenBackDrop(false)
    } catch (error) {
      setOpenBackDrop(false)
      console.log(error.response)
      if (!error.response) {
        setAlert('rede!')
        return
      }
      setAlert('Sem evidências!')
    }
  }

  const clickStatus = async returnSale => {
    setReturnSaleSelect(returnSale)
    if (returnSale.status === 'Pendente') {
      const { data } = await api.get('delivery/open')
      setDeliveries(data)
    } else if (returnSale.status === 'Buscando') {
      if (process.env.REACT_APP_STOCK_BEEP === '0' || !returnSale.products.some(product => product.quantity !== product.quantityBeep)) {
        returnSale.statusLocal = 'Finalizar'
      } else if (returnSale.products.some(product => product.quantityBeep > 0)) {
        returnSale.statusLocal = 'Bipando'
      }
    }
    setOpenModal(true)
  }

  const printProof = async returnSale => {
    setReturnSaleSelect(returnSale)
    setOpenPrint(true)
  }

  const linkSaleReturnInDelivery = async () => {
    try {
      const { data } = await api.put('returns/delivery/link', {
        returnId: returnSaleSelect.id,
        deliveryId: deliveryIdSelected
      })
      setOpenModal(false)
      setReturns(prev => prev.map(item => item.id !== returnSaleSelect.id ? item : data.linkedReturn))
    } catch (error) {
      console.log(error)
    }
  }

  const unlinkSaleReturnInDelivery = async () => {
    try {
      const { data } = await api.put('returns/delivery/unlink', {
        returnId: returnSaleSelect.id,
        deliveryId: deliveryIdSelected
      })
      setOpenModal(false)
      setReturns(prev => prev.map(item => item.id !== returnSaleSelect.id ? item : data.linkedReturn))
    } catch (error) {
      console.log(error.response)

      if (!error.response) {
        setAlert('Sem comunicação com servidor!')
      } else if (error.response.data.message === 'saleReturnStartedBeeping') {
        setAlert('Não é possível desvincular a devolução, pois o bip já foi iniciado!')
      }
    }
  }

  const finishSaleReturn = async () => {
    try {
      const { data } = await api.put('returns/delivery/finish', {
        returnId: returnSaleSelect.id
      })
      setOpenModal(false)
      setReturns(prev => prev.map(item => item.id !== returnSaleSelect.id ? item : data.saleReturn))
    } catch (error) {
      console.log(error)
    }
  }

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
              if (e.target.value === 'dateReturn') {
                setSearch({
                  dateStart: getDateSql(),
                  dateFinish: getDateSql()
                })
              } else {
                setSearch('')
              }
            }}
          >
            <MenuItem value={'originalSaleId'}>Código Venda</MenuItem>
            <MenuItem value={'client'}>Nome Cliente</MenuItem>
            <MenuItem value={'dateReturn'}>Dt Devolução</MenuItem>
          </Select>
        </FormControl>

        <div className={classes.search}>
          <div className={classes.searchIcon}>
            <SearchIcon />
          </div>
          {
            typeSearch === 'dateReturn' ? (
              <>
                <InputBase
                  placeholder="Pesquisar…"
                  type='date'
                  classes={{
                    root: classes.inputRoot,
                    input: classes.inputDate,
                  }}
                  style={{marginRight: 15}}
                  value={search.dateStart}
                  onChange={e => setSearch({...search, dateStart: e.target.value})}
                  onKeyPress={e => e.key === 'Enter' && searchSalesReturn()}
                />
                <span style={{color: 'white'}}>Até</span>
                <InputBase
                  placeholder="Pesquisar…"
                  type='date'
                  classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput,
                  }}
                  style={{marginLeft: -30}}
                  value={search.dateFinish}
                  onChange={e => setSearch({...search, dateFinish: e.target.value})}
                  onKeyPress={e => e.key === 'Enter' && searchSalesReturn()}
                />
              </>
            ) : (
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
            )
          }
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
              <TableCell align='right'>Loja</TableCell>
              <TableCell align='right'>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              returns.map(item => (
                <Row
                  key={item.id}
                  item={item}
                  clickStatus={clickStatus}
                  printProof={printProof}
                />
              ))
            }
            
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
        open={openModal}
        setOpen={setOpenModal}
        title={'Devoluções'}
      >
        {
          returnSaleSelect?.status === 'Pendente' && (
            <Box>
              <h3>Vincular devolução a entrega</h3>
              <Box>
                <FormControl variant="outlined" style={{width: '140px'}}>
                  <InputLabel id="fieldDelivery" className={classes.label}>Entrega</InputLabel>
                  <Select
                    label="Entrega"
                    labelId="fieldDelivery"
                    value={deliveryIdSelected}
                    onChange={e => setDeliveryIdSelected(e.target.value)}
                  >
                    {
                      deliveries.map(delivery => (
                        <MenuItem key={delivery.ID} value={delivery.ID}>{delivery.ID}</MenuItem>
                      ))
                    }
                  </Select>
                </FormControl>
              </Box>
              <Box>
                <ButtonSuccess
                  style={{marginTop: 10}}
                  onClick={linkSaleReturnInDelivery}
                >Vincular</ButtonSuccess>
              </Box>
            </Box>
          )
        }
        {
          returnSaleSelect?.status === 'Buscando' && (
            <> 
              {
                returnSaleSelect?.statusLocal === 'Bipando' && 
                <Box>
                  <h3>Devolução faltando bipar produto!</h3>
                  <p>
                    Devolução vinculada a entrega <strong>{returnSaleSelect.deliveryId}</strong>
                  </p>
                </Box>
                
              }
              {
                returnSaleSelect?.statusLocal === 'Finalizar' && 
                <Box>
                  <h3>Finalizar devolução: {returnSaleSelect.deliveryId}</h3>
                  <ButtonSuccess
                    onClick={finishSaleReturn}
                  >Confirmar</ButtonSuccess>
                </Box>
              }
              {
                returnSaleSelect.statusLocal ===  undefined && 
                <Box>
                  <h3>Desvincular devolução da entrega {returnSaleSelect.deliveryId}</h3>
                  <ButtonSuccess
                    onClick={unlinkSaleReturnInDelivery}
                  >Confirmar</ButtonSuccess>
                </Box>
              }
            </>
          )
        }
        {
          returnSaleSelect?.status === 'Devolvido' && (
            <Box>
              <h3>Devolução concluída</h3>
              <p>
                Devolução vinculada a entrega <strong>{returnSaleSelect.deliveryId}</strong>
              </p>
            </Box>
          )
        }
      </Modal>

      <ReportContainer
        openModal={openPrint}
        setOpenModal={setOpenPrint}
        save={`Comprovante de devolução Nº ${returnSaleSelect?.id}`}
      >
        <ProofOfReturn
          saleReturn={returnSaleSelect}
        />
      </ReportContainer>
    </Paper>
  )
}
