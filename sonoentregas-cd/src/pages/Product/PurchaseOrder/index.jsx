import React, { useEffect, useState } from 'react'
import { Box,
  Button,
  Dialog,
  Fab,
  FormControl,
  InputBase,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@material-ui/core'
import { Search as SearchIcon, Add, Print } from '@material-ui/icons'

import Modal from '../../../components/Modal'
import Reports from '../../../components/Reports'
import CreateUpdatePurchaseOrder from './CreateUpdatePurchaseOrder'
import PurchaseOderProducts from './PurchaseOrderProducts'
import { useAlertSnackbar } from '../../../context/alertSnackbarContext'
import { useBackdrop } from '../../../context/backdropContext'
import { debounce } from '../../../functions/debounce'
import api from '../../../services/api'
import useStyles from '../style'
import PurchaseOrderReport from './PurchaseOrderReport'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

export default function PurchaseOrder() {
  const [openPurchaseOrderProducts, setOpenPurchaseOrderProducts] = useState(false)
  const [openPurchaseCreateUpdate, setOpenPurchaseCreateUpdate] = useState(false)
  const [openPurchaseReport, setOpenPurchaseReport] = useState(false)
  const [openChangeFactoryData, setOpenChangeFactoryData] = useState(false)
  const [purchaseOrderSelected, setPurchaseOrderSelected] = useState()
  const [search, setSearch] = useState('')
  const [typeSearch, setTypeSearch] = useState('code')
  const [purchaseOrders, setPurchaseOrders] = useState([])
  const { setAlertSnackbar } = useAlertSnackbar()
  const { setOpenBackDrop } = useBackdrop()

  useEffect(() => {
    setOpenBackDrop(true)
    api.get('purchase/order/open')
      .then(({data}) => {
        setPurchaseOrders(data.purchaseOrder)
        setOpenBackDrop(false)
      })
      .catch((error) => {
        console.log(error)
        setAlertSnackbar('Erro no servidor')
      })
  }, [setAlertSnackbar, setOpenBackDrop])

  const classes = useStyles()

  const searchPurchaseOrder = async () => {
    try {
      if (search === '') {
        setAlertSnackbar('Pesquisa vazia')
      }

      const {data} = await api.get('purchase/order', {
        params: {
          type: typeSearch,
          search
        }
      })

      setPurchaseOrders(data.purchaseOrder)
    } catch (error) {
      console.log(error)
    }
  }

  const handleSelectPurchaseOrder = purchaseOrder => {
    setPurchaseOrderSelected(purchaseOrder)
    setOpenPurchaseOrderProducts(true)
  }

  const handleOpenPurchaseOrder = async id => {
    try {
      await api.patch(`purchase/order/${id}/open`)

      setPurchaseOrders(state => state.map(po => {
        if (po.id === id) {
          return {
            ...po,
            open: '1'
          }
        }

        return po
      }))
    } catch (error) {
      console.log(error)

      if (error.response.status === 409) {
        setAlertSnackbar('Existe um pedido com status aberto, finalize-o primeiro para abrir este!')
      }
    }
  }

  const handleChangeFactoryData = (key, value) => {
    try {
      setPurchaseOrderSelected(state => ({...state, [key]: value}))

      debounce(async () => {
        await api.put(`purchase/order/${purchaseOrderSelected.id}`, {
          fieldToUpdate: key,
          value: value
        })

        setPurchaseOrders(state => state.map(purchaseOrder => {
          if (purchaseOrder.id === purchaseOrderSelected.id) {
            purchaseOrder[key] = value
          }

          return purchaseOrder
        }))
      }, 1300)
    } catch (error) {
      console.log(error)
      setAlertSnackbar('Erro interno!')
    }
  }

  return (
    <Box>
      <Box className={classes.barHeader}>
        <FormControl variant="outlined">
          <InputLabel id="fieldSearch" className={classes.label}>Tipo</InputLabel>
          <Select
            label="Tipo"
            labelId="fieldSearch"
            className={classes.fieldSearch}
            value={typeSearch}
            onChange={e => setTypeSearch(e.target.value)}
          >
            <MenuItem value={'code'}>Código</MenuItem>
            <MenuItem value={'issue'}>Emissão</MenuItem>
          </Select>
        </FormControl>

        <div className={classes.search}>
          <div className={classes.searchIcon}>
            <SearchIcon/>
          </div>
          <InputBase
            type={typeSearch === 'issue' ? "date": "text"}
            placeholder="Pesquisar…"
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
            inputProps={{ 'aria-label': 'search' }}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                searchPurchaseOrder()
              }
            }}
          />
        </div>

        <Button className={classes.btnSearch} onClick={searchPurchaseOrder}>Pesquisar</Button>
      </Box>

      <TableContainer component={Paper}>
        <Table size='small'>
          <TableHead>
            <TableRow className={classes.rowHeader}>
              <TableCell>Status</TableCell>
              <TableCell>Nº</TableCell>
              <TableCell>Emissão</TableCell>
              <TableCell>Lançamento</TableCell>
              <TableCell>Comprador</TableCell>
              <TableCell align="right">Dados Fab.</TableCell>
              <TableCell align="right">R$ Total</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {purchaseOrders.map((purchaseOrder, i) => (
              <TableRow key={i}>
                <TableCell>{
                  purchaseOrder.open === '1'
                  ? <Box
                      style={{
                        background: 'var(--red)',
                        color: 'var(--white)',
                        textAlign: 'center'
                      }}
                    >Aberta</Box>
                  : <Box
                      style={{
                        background: 'var(--green)',
                        color: 'var(--white)',
                        textAlign: 'center',
                        cursor: 'pointer'
                      }}
                      onClick={() => handleOpenPurchaseOrder(purchaseOrder.id)}
                    >Fechada</Box>
                }</TableCell>
                <TableCell
                  onClick={() =>handleSelectPurchaseOrder(purchaseOrder)}
                  style={{
                    cursor: 'pointer'
                  }}
                >{purchaseOrder.id}</TableCell>
                <TableCell>{purchaseOrder.issue}</TableCell>
                <TableCell>{purchaseOrder.release}</TableCell>
                <TableCell>{purchaseOrder.employeeName}</TableCell>
                <TableCell
                  align="right"
                  style={{
                    cursor: 'pointer'
                  }}
                  onClick={() => {
                    setPurchaseOrderSelected(purchaseOrder)
                    setOpenChangeFactoryData(true)
                  }}
                >
                  {purchaseOrder.factoryData
                    ? purchaseOrder.factoryData
                    : <>
                        {(purchaseOrder.PED_FAB && purchaseOrder.PED_FAB !== '') ? `PF: ${purchaseOrder.PED_FAB}` : ''}
                        {(purchaseOrder.LOTE && purchaseOrder.LOTE !== '') ? ` / L: ${purchaseOrder.LOTE}` : ''}
                        {(purchaseOrder.CARGA && purchaseOrder.CARGA !== '') ? ` / C: ${purchaseOrder.CARGA}` : ''}
                      </>
                  }
                </TableCell>
                <TableCell align="right">{purchaseOrder.value}</TableCell>
                <TableCell align="right">
                  <Print onClick={() => {
                    setOpenPurchaseReport(true)
                    setPurchaseOrderSelected(purchaseOrder)
                  }}/>
                </TableCell>
              </TableRow>
            ))
            }
          </TableBody>
        </Table>
      </TableContainer>

      <Fab 
        color="primary"
        onClick={() => setOpenPurchaseCreateUpdate(true)}
        style={{
          position: 'fixed',
          right: 40,
          bottom: 40
        }}
      >
        <Add />
      </Fab>

      <Modal
        title={'Notas de entrada'}
        open={openPurchaseOrderProducts}
        setOpen={setOpenPurchaseOrderProducts}
      >
        <PurchaseOderProducts
          purchaseOrder={purchaseOrderSelected}
        />

      </Modal>

      <Dialog
        fullScreen
        open={openPurchaseCreateUpdate}
        onClose={() => setOpenPurchaseCreateUpdate(false)}
        TransitionComponent={Transition}
      >
        <CreateUpdatePurchaseOrder
          setOpen={setOpenPurchaseCreateUpdate}
          setPurchaseOrders={setPurchaseOrders}
        />
      </Dialog>

      {
        openChangeFactoryData &&
        <Dialog
          open={openChangeFactoryData}
          onClose={() => {
            setOpenChangeFactoryData(false)
            setPurchaseOrderSelected()
          }}
        >
          <Box display="flex" flexDirection="column" padding={2}>
            <InputBase
              placeholder="Ped. Fábrica"
              style={{
                padding: '8px 12px',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
              value={purchaseOrderSelected.PED_FAB || ''}
              onChange={e => handleChangeFactoryData('PED_FAB', e.target.value)}
            />
            <InputBase
              placeholder="Lote"
              style={{
                padding: '8px 12px',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
              value={purchaseOrderSelected.LOTE || ''}
              onChange={e => handleChangeFactoryData('LOTE', e.target.value)}
            />
            <InputBase
              placeholder="Carga"
              style={{
                padding: '8px 12px',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
              value={purchaseOrderSelected.CARGA || ''}
              onChange={e => handleChangeFactoryData('CARGA', e.target.value)}
            />
          </Box>
        </Dialog>
      }

      <Reports
        openModal={openPurchaseReport}
        setOpenModal={setOpenPurchaseReport}
        save={'Pedido Nº: '+purchaseOrderSelected?.id}
      >
        <PurchaseOrderReport purchaseOrder={purchaseOrderSelected}/>
      </Reports>
    </Box>
  )
}