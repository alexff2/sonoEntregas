import React, { useState } from 'react'
import {
  AppBar,
  Box,
  Button,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
  Typography,
  makeStyles,
} from '@material-ui/core'
import {
  Close as CloseIcon,
  Search,
  GetApp,
  Cancel
} from '@material-ui/icons'

import { debounce } from '../../../../functions/debounce'
import { useBackdrop } from '../../../../context/backdropContext'
import { useAlertSnackbar } from '../../../../context/alertSnackbarContext'
import SearchPurchaseOrder from './SearchPurchaseOrder'
import BrMonetaryValue from '../../../../components/BrMonetaryValue'

import api from '../../../../services/api'

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}))

const Input = ({
  id,
  label,
  width='140px',
  type='text',
  disable=false,
  ...props
}) => {
  return (
    <TextField
      id={id}
      label={label}
      type={type}
      variant='outlined'
      disabled={disable}
      InputLabelProps={{
        shrink: true,
      }}
      margin='dense'
      size='small'
      style={{
        width,
        backgroundColor: 'white',
      }}
      {...props}
    />
  )
}

export default function CreateUpdatePurchaseOrder({
  setOpen,
  noteUpdate
}){
  const [typeSearch, setTypeSearch] = useState('name')
  const [openDialogSearch, setOpenDialogSearch] = useState(false)
  const [disablePurchaseOrderId, setDisablePurchaseOrderId] = useState(false)
  const [purchaseOrderId, setPurchaseOrderId] = useState('')
  const [quantifyInput, setQuantifyInput] = useState(1)
  const [searchProduct, setSearchProduct] = useState([])
  const [searchProductSelect, setSearchProductSelect] = useState(null)
  const [productsNote, setProductsNote] = useState([])
  const [note, setNote] = useState({})
  const { setAlertSnackbar } = useAlertSnackbar()
  const { setOpenBackDrop } = useBackdrop()
  const classes = useStyles()

  const handleImportPurchaseOrder = async purchaseOrderSearchId => {
    try {
      setOpenBackDrop(true)

      if (typeof purchaseOrderSearchId === 'number') 
        setPurchaseOrderId(purchaseOrderSearchId)

      const id = (typeof purchaseOrderSearchId === 'number')
        ? purchaseOrderSearchId
        : purchaseOrderId

      const { data } = await api.get(`purchase/order/${id}/products`)

      setProductsNote(data.productsPurchaseOrder)

      setOpenBackDrop(false)
      setDisablePurchaseOrderId(true)
    } catch (error) {
      console.log(error)
    }
  }

  const handleSearchProduct = value => {
    debounce(async () => {
      const {data} = await api.get('product', {
        params: {
          search: value,
          type: typeSearch
        }
      })

      setSearchProduct(data)
    }, 1300)
  }

  const handleSelectSearchProduct = prod => {
    setSearchProductSelect(prod)
    document.getElementById('quantifyId').focus()
  }

  const handleAddProductNote = () => {
    if (quantifyInput < 1) {
      setAlertSnackbar('Valor não pode ser menor ou igual a 0!')

      setQuantifyInput(1)
      return
    }

    setProductsNote([
      ...productsNote,
      {
        item: productsNote.length + 1,
        ...searchProductSelect,
        originalCode: searchProductSelect.generalCode,
        value: searchProductSelect.PCO_COMPRA,
        total: searchProductSelect.PCO_COMPRA * quantifyInput,
        quantify: quantifyInput 
      }
    ])

    setSearchProduct([])
  }

  const handleChangeQuantify = prod => {
    setProductsNote(
      states => (states.map(state => {
        if (state.item === prod.item) {
          state.quantify = prod.quantify
          state.total = prod.quantify * state.value
        }

        return state
      }))
    )
  }

  const handleCreateNote = () => {
    try {
      if (!note.id) {
        
      }
      console.log(note)
      //setOpen(false)
    } catch (error) {
      console.log(error)
    }
  }

  let quantifyFull = 0, valueTotalFull = 0

  productsNote.forEach(prod => {
    quantifyFull += prod.quantify
    valueTotalFull += prod.total
  })

  return (
    <>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => setOpen(false)} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            {!noteUpdate ? 'Lançamento de Nota de Entrada' : 'Atualização de Nota de Entrada'}
          </Typography>
          <Button autoFocus color="inherit" onClick={handleCreateNote}>
            save
          </Button>
        </Toolbar>
      </AppBar>
      <Box
        padding={2}
        bgcolor={'#F9F8F8'}
        height={'100%'}
      >
        <Box
          border='1px solid #CCC'
          padding={1}
          display={'flex'}
          alignItems={'center'}
          justifyContent={'space-between'}
        >
          <Input
            id="noteNumber"
            label="Nº da Nota"
            variant='outlined'
            onChange={e => setNote(state => ({...state, id: Number(e.target.value)}))}
          />
          <Input
            id="issue"
            label="Emissão"
            type='date'
            onChange={e => setNote(state => ({...state, issue: e.target.value}))}
          />
          <Input
            id="arrival"
            label="Chegada"
            type='date'
            onChange={e => setNote(state => ({...state, arrival: e.target.value}))}
          />
          <Box
            display={'flex'}
            alignItems={'center'}
            width={'220px'}
            style={{
              gap: 8
            }}
          >
            <Input
              id="noteOrder"
              label="Nº do Pedido"
              variant='outlined'
              value={purchaseOrderId}
              onChange={e => setPurchaseOrderId(e.target.value)}
              disable={disablePurchaseOrderId}
            />
            { !disablePurchaseOrderId &&
              <>
                <Box
                  bgcolor={'orange'}
                  color={'white'}
                  padding={'4px'}
                  display={'flex'}
                  alignItems={'center'}
                  style={{cursor: 'pointer'}}
                  onClick={() => setOpenDialogSearch(true)}
                >
                  <Search />
                </Box>
                <Box
                  bgcolor={'green'}
                  color={'white'}
                  padding={'4px'}
                  display={'flex'}
                  alignItems={'center'}
                  style={{cursor: 'pointer'}}
                  onClick={handleImportPurchaseOrder}
                >
                  <GetApp />
                </Box>
              </>
            }
            
          </Box>
        </Box>
        <Box
          border='1px solid #CCC'
          padding={1}
          position={'relative'}
        >
          <Box
            display={'flex'}
            alignItems={'center'}
            justifyContent={'space-between'}
          >
            <Select
              variant='outlined'
              value={typeSearch}
              onChange={e => setTypeSearch(e.target.value)}
              style={{
                width: '15%',
                height: 40,
                background: '#FFF',
                margin: '8px 0 4px 0'
              }}
            >
              <MenuItem value='name'>Descrição</MenuItem>
              <MenuItem value='code'>Código</MenuItem>
            </Select>
            <Input
              width='72%'
              placeholder='Procure por código ou descrição...'
              onChange={e => handleSearchProduct(e.target.value)}
            />
            <Input
              id={'quantifyId'}
              type='number'
              placeholder='Qtd'
              width='10%'
              value={quantifyInput}
              onChange={e => setQuantifyInput(Number(e.target.value))}
              onKeyDown={e => e.key === 'Enter' && handleAddProductNote()}
            />
          </Box>
          {
            searchProduct.length > 0 &&
            <TableContainer
              component={Paper}
              style={{
                height: '625px',
                position: 'absolute',
                zIndex: 1500,
                width: 'calc(100% - 16px)'
              }}
            >
              <Table size='small' stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Código</TableCell>
                    <TableCell>Alternativo</TableCell>
                    <TableCell>Nome</TableCell>
                    <TableCell>Estoque</TableCell>
                    <TableCell>Custo</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    searchProduct.map( prod => (
                      <TableRow
                        hover
                        key={prod.code}
                        onClick={() => handleSelectSearchProduct(prod)}
                      >
                        <TableCell>{prod.code}</TableCell>
                        <TableCell>{prod.generalCode}</TableCell>
                        <TableCell>{prod.name}</TableCell>
                        <TableCell align='right'>{prod.stock}</TableCell>
                        <TableCell align='right'>
                          <BrMonetaryValue value={prod.PCO_COMPRA}/>
                        </TableCell>
                      </TableRow>
                    ))
                  }
                </TableBody>
              </Table>
            </TableContainer>
          }
        </Box>
        <Box
          border='1px solid #CCC'
          padding={1}
        >
          <TableContainer
            component={Paper}
            style={{
              background: 'transparent',
              height: 600
            }}
          >
            <Table size='small' stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Item</TableCell>
                  <TableCell>Código</TableCell>
                  <TableCell>Alternativo</TableCell>
                  <TableCell>Descrição</TableCell>
                  <TableCell align='right'>Quantidade</TableCell>
                  <TableCell align='right'>Valor Unit</TableCell>
                  <TableCell align='right'>Valor Total</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody style={{background: 'white'}}>
                {
                  productsNote.map((prod, index) => (
                    <TableRow hover key={index}>
                      <TableCell>{prod.item}</TableCell>
                      <TableCell>{prod.code}</TableCell>
                      <TableCell>{prod.originalCode}</TableCell>
                      <TableCell>{prod.name}</TableCell>
                      <TableCell align='right'>
                        <input
                          style={{
                            border: 'none',
                            width: 50,
                            textAlign: 'right'
                          }}
                          type='number'
                          value={prod.quantify}
                          onChange={e => handleChangeQuantify({
                            item: prod.item,
                            quantify: Number(e.target.value)
                          })}
                        />
                      </TableCell>
                      <TableCell align='right'>
                        <BrMonetaryValue value={prod.value}/>
                      </TableCell>
                      <TableCell align='right'>
                        <BrMonetaryValue value={prod.total}/>
                      </TableCell>
                      <TableCell align='right'>
                        <Cancel
                          color='error'
                          style={{cursor: 'pointer'}}
                          onClick={() => {
                            setProductsNote(
                              states => states.filter(
                                state => state.item !== prod.item
                              )
                            )
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                }
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={4}>Totais</TableCell>
                  <TableCell align='right'>
                  <BrMonetaryValue value={quantifyFull}/>
                  </TableCell>
                  <TableCell
                    colSpan={2}
                    align='right'
                    style={{
                      color: 'green',
                      fontWeight: 900
                    }}
                  >
                    <BrMonetaryValue value={valueTotalFull} />
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </Box>
      </Box>

      <SearchPurchaseOrder
        openDialogSearch={openDialogSearch}
        setOpenDialogSearch={setOpenDialogSearch}
        handleImportPurchaseOrder={handleImportPurchaseOrder}
      />
    </>
  )
}